import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";

const DashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Image
          source={require("../assets/iconDog.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Perruqueria</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 30,
  },
  header: {
    flexDirection: 'row',       // Esto coloca los elementos en fila (horizontal)
    alignItems: 'center',      // Centra verticalmente los elementos
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  }
});

export default DashboardScreen;
