import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPetsByOwner } from "../services/petsService";
import { getAppointmentsForUser } from "../services/appointmentService";

function formatDateTime(date) {
  const fecha = date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let hora = date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${fecha}, ${hora}`;
}

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);

  const loadPets = useCallback(async () => {
    const ownerId = await AsyncStorage.getItem("userUid");
    if (ownerId) {
      const petsList = await getPetsByOwner(ownerId);
      setPets(petsList);
    }
  }, []);

  // Cargar próxima cita
  const loadNextAppointment = useCallback(async () => {
    setLoadingAppointment(true);
    const email = await AsyncStorage.getItem("userEmail");
    if (email) {
      const appointments = await getAppointmentsForUser(email);
      const now = new Date();
      // Asegura que startDate siempre sea un Date válido
      const futureAppointments = appointments
        .map((a) => ({
          ...a,
          startDate: a.start instanceof Date ? a.start : new Date(a.start),
        }))
        .filter((a) => a.startDate > now)
        .sort((a, b) => a.startDate - b.startDate);
      setNextAppointment(futureAppointments[0] || null);
    } else {
      setNextAppointment(null);
    }
    setLoadingAppointment(false);
  }, []);

  useEffect(() => {
    loadPets();
    loadNextAppointment();
    const unsubscribe = navigation.addListener("focus", () => {
      loadPets();
      loadNextAppointment();
    });
    return unsubscribe;
  }, [navigation, loadPets, loadNextAppointment]);

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Image source={require("../assets/iconDog.png")} style={styles.logo} />
        <Text style={styles.title}>Perruqueria</Text>
      </View>

      {/* Contenedor Próxima Cita */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próxima cita</Text>
      </View>
      <View style={styles.card}>
        {loadingAppointment ? (
          <ActivityIndicator color="#007aff" size="small" />
        ) : nextAppointment ? (
          <>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                {nextAppointment.description
                  ? nextAppointment.description.replace("Servicio: ", "")
                  : "Cita"}
              </Text>
            </View>
            <Text style={styles.status}>Confirmada</Text>
            <Text style={styles.time}>
              {formatDateTime(
                nextAppointment.start instanceof Date
                  ? nextAppointment.start
                  : new Date(nextAppointment.start)
              )}
            </Text>
          </>
        ) : (
          <Text style={styles.emptyPetsText}>No tienes próximas citas</Text>
        )}
      </View>

      {/* Contenedor Mis Mascotas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Mascotas</Text>
        {pets.length === 0 ? (
          <Text style={styles.emptyPetsText}>
            No tienes mascotas registradas
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          >
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
    padding: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
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
    marginTop: 5,
    fontSize: 14,
    color: "#007aff",
  },
  time: {
    fontSize: 14,
    color: "#555",
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
  },
});

export default DashboardScreen;
