import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPetsByOwner } from "../services/petsService";

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);

  const loadPets = useCallback(async () => {
    const ownerId = await AsyncStorage.getItem("userUid");
    if (ownerId) {
      const petsList = await getPetsByOwner(ownerId);
      setPets(petsList);
    }
  }, []);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

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

      <Text style={styles.date}>Próxima cita</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Corte de cabello</Text>
          <View style={styles.icons}>
            <TouchableOpacity>
              <Text style={styles.pIcon}>🐾</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.status}>Confirmada</Text>
        <Text style={styles.time}>Mañana, 10:00 AM</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Mascotas</Text>
        {pets.length === 0 ? (
          <Text style={styles.emptyPetsText}>No tienes mascotas registradas</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petCard}
                onPress={() => navigation.navigate("PetDetails", { pet })}
              >
                {pet.picUrl ? (
                  <Image source={{ uri: pet.picUrl }} style={styles.petImage} />
                ) : (
                  <View style={styles.defaultPetImage}>
                    <Ionicons name="paw" size={32} color="#666" />
                  </View>
                )}
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petInfo}>
                  {pet.type === "Dog" ? "Perro" : "Gato"} • {pet.breed}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  status: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
  time: {
    fontSize: 14,
    color: "#555",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  emptyPetsText: {
    marginTop: 10,
    color: "#666",
  },
  carousel: {
    marginTop: 10,
  },
  petCard: {
    width: 120,
    marginRight: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "cover",
    marginBottom: 8,
  },
  defaultPetImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  petName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  petInfo: {
    fontSize: 12,
    color: "#666",
  },
  pIcon: {
    fontSize: 20,
  }
});

export default DashboardScreen;