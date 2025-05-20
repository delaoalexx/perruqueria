import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ServiceCard = ({ title, price, time, onPress }) => {
  return (
    <View style={styles.serviceCard}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceDetail}>Precio: {price} Mx</Text>
        <Text style={styles.serviceDetail}>Tiempo aprox: {time} min</Text>
      </View>
      <View style={styles.serviceActions}>
        {title.includes("Corte") && (
          <Ionicons name="cut-outline" size={24} color="#333" style={styles.serviceIcon} />
        )}
        {title.includes("Baño") && (
          <Ionicons name="water-outline" size={24} color="#333" style={styles.serviceIcon} />
        )}
        <TouchableOpacity style={styles.scheduleButton} onPress={onPress}>
          <Text style={styles.scheduleButtonText}>Agendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ServicesScreen = () => {
  const services = [
    {
      id: 1,
      title: "Corte de cabello",
      price: "900",
      time: "90",
    },
    {
      id: 2,
      title: "Corte de uñas",
      price: "900",
      time: "30",
    },
    {
      id: 3,
      title: "Baño sencillo",
      price: "900",
      time: "30",
    },
    {
      id: 4,
      title: "Baño especial",
      price: "900",
      time: "30",
    },
  ];

  const handleSchedule = (serviceId) => {
    console.log(`Agendar servicio con ID: ${serviceId}`);
    // Aquí puedes implementar la lógica para agendar el servicio
  };

  return (
    <ScrollView style={styles.container}>
      {/* Título de la sección */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Servicios</Text>
      </View>

      {/* Lista de servicios */}
      <View style={styles.servicesContainer}>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            price={service.price}
            time={service.time}
            onPress={() => handleSchedule(service.id)}
          />
        ))}
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
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  servicesContainer: {
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  serviceDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  serviceActions: {
    alignItems: 'center',
  },
  serviceIcon: {
    marginBottom: 10,
  },
  scheduleButton: {
    backgroundColor: "#007aff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scheduleButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default ServicesScreen;