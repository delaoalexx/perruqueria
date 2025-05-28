import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase/firebaseConfig";
import { useLogout } from "../hooks/auth/useLogout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPetsByOwner } from "../services/petsService";

const AccountScreen = () => {
  const navigation = useNavigation();
  const { logout } = useLogout();
  const user = auth.currentUser;
  const email = user?.email || "usuario@email.com";

  const [pets, setPets] = useState([]);

  // Cargar mascotas del usuario autenticado
  const loadPets = useCallback(async () => {
    const ownerId = await AsyncStorage.getItem("userUid");
    if (ownerId) {
      const petsList = await getPetsByOwner(ownerId);
      setPets(petsList);
    }
  }, []);

  useEffect(() => {
    loadPets();
    const unsubscribe = navigation.addListener("focus", loadPets);
    return unsubscribe;
  }, [navigation, loadPets]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
        </View>

        {/* Tarjeta de Usuario */}
        <View style={[styles.card, styles.userCard]}>
          <View style={styles.cardContent}>
            <View style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.userName}>Usuario</Text>
              <Text style={styles.userEmail}>{email}</Text>
            </View>
          </View>
        </View>

        {/* Sección de Mascotas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Mascotas</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AddPet")}>
            <Ionicons name="add" size={30} color="#333" />
          </TouchableOpacity>
        </View>

        {pets.length === 0 ? (
          <View style={[styles.card, styles.petCard]}>
            <Text style={styles.emptyPetsText}>No tienes mascotas</Text>
          </View>
        ) : (
          pets.map((pet) => (
            <View
              key={pet.id}
              style={[
                styles.card,
                styles.petCard,
                { flexDirection: "row", alignItems: "center", marginBottom: 10 },
              ]}
            >
              <View style={styles.petAvatar}>
                <Ionicons name="paw" size={32} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petInfo}>
                  {pet.type === "Dog" ? "Perro" : "Gato"} • {pet.breed}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={28} color="#fff" />
            </View>
          ))
        )}

        {/* Sección de Configuración */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Configuración</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={[styles.optionItem, styles.borderBottom]}>
            <View style={styles.optionContent}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#333"
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>Información Personal</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionItem, styles.borderBottom]}>
            <View style={styles.optionContent}>
              <Ionicons
                name="list-outline"
                size={20}
                color="#333"
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>Listas</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionContent}>
              <Ionicons
                name="settings-outline"
                size={20}
                color="#333"
                style={styles.optionIcon}
              />
              <Text style={styles.optionText}>Opción 3</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Espacio para el botón fijo */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Botón de Cerrar Sesión (fijo en la parte inferior) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  userCard: {
    backgroundColor: "#007aff",
  },
  petCard: {
    backgroundColor: "#007aff",
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginRight: 15,
  },
  petAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  petInfo: {
    fontSize: 15,
    color: "#fff",
    opacity: 0.85,
  },
  emptyPetsText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    marginRight: 15,
    width: 20,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  spacer: {
    height: 20,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
  logoutButton: {
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e74c3c",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    color: "#e74c3c",
    marginLeft: 10,
    fontWeight: "bold",
  },
});

export default AccountScreen;