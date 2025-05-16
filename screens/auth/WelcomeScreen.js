import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.content}>
        <Text style={styles.title}>Mimos y estilo para tu mascota</Text>
        <Text style={styles.subtitle}>¡Explora nuestros servicios y productos!</Text>

        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/iconApp.jpeg")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.signupButtonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFCC33",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
    overflow: "hidden",
  },
  logoImage: {
    width: "80%",
    height: "80%",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loginButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "500",
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFCC33", 
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default WelcomeScreen;
