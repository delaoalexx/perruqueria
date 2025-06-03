import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerWithEmail } from "../../firebase/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleRegister = async () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    if (!email) {
      setEmailError("El correo es requerido");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Ingresa un correo válido");
      isValid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirma tu contraseña");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      isValid = false;
    }

    if (!isValid) return;

    try {
      setLoading(true);
      const userCredential = await registerWithEmail(email, password);
      const uid = userCredential.user.uid;
      await AsyncStorage.setItem("userUid", uid);
      console.log("Usuario registrado:", uid);
      navigation.replace("Dashboard");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setEmailError("Este correo ya está registrado");
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Correo inválido");
      } else if (error.code === "auth/weak-password") {
        setPasswordError("La contraseña es muy débil");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Ingrese un correo"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        placeholder="Crea una contraseña"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError("");
        }}
        secureTextEntry
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <Text style={styles.label}>Confirmar contraseña</Text>
      <TextInput
        style={[styles.input, confirmPasswordError && styles.inputError]}
        placeholder="Repite tu contraseña"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setConfirmPasswordError("");
        }}
        secureTextEntry
      />
      {confirmPasswordError ? (
        <Text style={styles.errorText}>{confirmPasswordError}</Text>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333333",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 5,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginBottom: 15,
  },
  registerButton: {
    height: 50,
    backgroundColor: "#3498db",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 20,
    alignSelf: "center",
  },
  linkText: {
    color: "#3498db",
    fontSize: 16,
  },
});

export default RegisterScreen;
