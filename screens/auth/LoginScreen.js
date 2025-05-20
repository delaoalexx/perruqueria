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
import { loginWithEmail } from "../../firebase/authService";

const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigation.replace("Dashboard");
    } catch (error) {
      Alert.alert("Error al iniciar sesión", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginTitle}>Login</Text>

      <Text style={styles.inputLabel}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Introduce tu correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.inputLabel}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Introduce tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
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

// Estilos para el login
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
});

export default LoginScreen;
