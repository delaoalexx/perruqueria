import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  // Estados para almacenar lo que el usuario escribe
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Título "Login" centrado */}
      <Text style={styles.loginTitle}>Login</Text>

      {/* Campo de Email */}
      <Text style={styles.inputLabel}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Introduce tu correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo de Contraseña */}
      <Text style={styles.inputLabel}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Introduce tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Botón "Entrar" */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Enlace "Crea una cuenta" */}
      <TouchableOpacity
        style={styles.createAccountLink}
        onPress={() => navigation.navigate("Register")}
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
