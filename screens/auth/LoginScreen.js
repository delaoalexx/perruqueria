import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEmailAuth } from "../../hooks/auth/useEmailAuth";
import { useGoogleAuth } from "../../hooks/auth/useGoogleAuth";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();

  const { loginWithEmail } = useEmailAuth();
  const { signInWithGoogle } = useGoogleAuth(); // a a i i tuki tuki

  // Función para validar formato de email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    // Validación de email
    if (!email) {
      setEmailError("El correo es requerido.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Ingresa un correo válido");
      isValid = false;
    }

    // Validación de contraseña
    if (!password) {
      setPasswordError("La contraseña es requerida.");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      await loginWithEmail(email, password).then(async (userCredential) => {
        const uid = userCredential.user.uid;
        await AsyncStorage.setItem("userUid", uid);
        await AsyncStorage.setItem("userEmail", email);
        console.log("Usuario autenticado:", uid);
      });
      navigation.replace("Dashboard");
    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-login-credentials" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        Toast.show({
          type: "error",
          text1: "Error de inicio de sesión",
          text2: "Correo o contraseña incorrectos.",
          position: "top",
          visibilityTime: 3000,
          text1Style: {
            fontSize: 18,
            fontWeight: "bold",
          },
          text2Style: {
            fontSize: 12,
          },
          props: {
            style: {
              height: 80,
              paddingHorizontal: 20,
              paddingVertical: 15,
              marginHorizontal: 10,
            },
          },
        });
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Correo electrónico inválido");
      } else {
        Alert.alert("Error al iniciar sesión", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithGoogle();

      if (userCredential && userCredential.user) {
        const uid = userCredential.user.uid;

        // Guardar el UID en AsyncStorage
        await AsyncStorage.setItem("userUid", uid);

        console.log("Usuario de Google autenticado:", uid);

        // Navegar al Dashboard
        navigation.replace("Dashboard");
      } else {
        throw new Error("No se pudo obtener la información del usuario");
      }
    } catch (error) {
      console.error("Error completo:", error);
      Alert.alert("Error con Google", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginTitle}>Login</Text>

      <Text style={styles.inputLabel}>Correo Electrónico</Text>
      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="Introduce tu correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <Text style={styles.inputLabel}>Contraseña</Text>
      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Introduce tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
          >
            <Text style={styles.buttonText}>Iniciar con Google</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.createAccountLink}
        onPress={() => navigation.navigate("Register")}
        disabled={loading}
      >
        <Text style={styles.linkText}>Crea una cuenta</Text>
      </TouchableOpacity>
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
  loginTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333333",
  },
  inputLabel: {
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
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    height: 50,
    backgroundColor: "#3498db",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  googleButton: {
    height: 50,
    backgroundColor: "#db4437", // rojo Google
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccountLink: {
    marginTop: 20,
    alignSelf: "center",
  },
  linkText: {
    color: "#3498db",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    marginBottom: 10,
    marginTop: -15,
    fontSize: 13,
  },
});

export default LoginScreen;
