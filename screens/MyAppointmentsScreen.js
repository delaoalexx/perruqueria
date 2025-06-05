import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  getAppointmentsForUser,
  deleteAppointment,
} from "../services/appointmentService";
import { useGoogleAuth } from "../hooks/auth/useGoogleAuth";

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

const AppointmentCard = ({ appointment, onDelete, onEdit }) => {
  const date = new Date(appointment.start);
  return (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentInfo}>
        <Text style={styles.appointmentTitle}>
          {appointment.description.replace("Servicio: ", "")}
        </Text>
        <Text style={styles.appointmentStatus}>Confirmada</Text>
        <Text style={styles.appointmentDate}>{formatDateTime(date)}</Text>
      </View>
      <View style={styles.appointmentActions}>
        <TouchableOpacity onPress={onEdit}>
          <Ionicons
            name="create-outline"
            size={22}
            color="#666"
            style={styles.actionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons
            name="trash-outline"
            size={22}
            color="#e74c3c"
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MyAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userInfo } = useGoogleAuth();
  const navigation = useNavigation();

  const fetchAppointments = async () => {
    setLoading(true);
    const email = await AsyncStorage.getItem("userEmail");
    if (email) {
      const data = await getAppointmentsForUser(email);
      setAppointments(data);
    } else {
      setAppointments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  const handleDelete = async (appointment) => {
    Alert.alert(
      "Eliminar cita",
      "¿Estás seguro de que deseas eliminar esta cita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAppointment(
                appointment.id,
                appointment.googleEventId,
                userInfo?.accessToken
              );
              await fetchAppointments();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la cita");
            }
          },
        },
      ]
    );
  };

  // FUNCIÓN PARA EDITAR
  const handleEdit = (appointment) => {
    const serviceTitle = appointment.description.replace("Servicio: ", "");
    const service = {
      title: serviceTitle,
      price: appointment.price || "",
      time: appointment.time || 60,
    };
    // Convierte las fechas a string para evitar el warning de React Navigation
    navigation.navigate("ScheduleScreen", {
      service,
      appointmentToEdit: {
        ...appointment,
        start:
          typeof appointment.start === "string"
            ? appointment.start
            : appointment.start.toISOString(),
        end:
          typeof appointment.end === "string"
            ? appointment.end
            : appointment.end.toISOString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Encabezado fijo */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mis Citas</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          appointments.length === 0 && !loading ? { flex: 1 } : {},
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.appointmentsContainer}>
          {loading ? (
            <ActivityIndicator
              color="#007aff"
              size="large"
              style={{ marginTop: 40 }}
            />
          ) : appointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tiene citas agendadas</Text>
            </View>
          ) : (
            appointments.map((appointment, idx) => (
              <AppointmentCard
                key={appointment.id || idx}
                appointment={appointment}
                onDelete={() => handleDelete(appointment)}
                onEdit={() => handleEdit(appointment)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  sectionHeader: {
    backgroundColor: "#f5f5f5",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContent: {
    paddingBottom: 20,
    minHeight: Dimensions.get("window").height * 0.7,
  },
  appointmentsContainer: {
    marginBottom: 20,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  appointmentStatus: {
    fontSize: 14,
    color: "#007aff",
    marginBottom: 2,
  },
  appointmentDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  appointmentActions: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 10,
  },
  actionIcon: {
    marginHorizontal: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  emptyText: {
    color: "#999",
    fontSize: 18,
    textAlign: "center",
  },
});

export default MyAppointmentsScreen;
