import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPetsByOwner } from "../services/petsService";
import { Calendar } from "react-native-calendars";
import * as ExpoCalendar from "expo-calendar";
import {
  createAppointment,
  updateAppointment,
} from "../services/appointmentService";
import { useGoogleAuth } from "../hooks/auth/useGoogleAuth";

const schedules = [
  { label: "10:00", value: "10:00" },
  { label: "11:00", value: "11:00" },
  { label: "12:00", value: "12:00" },
  { label: "13:00", value: "13:00" },
  { label: "16:00", value: "16:00" },
  { label: "17:00", value: "17:00" },
];

// Helper para crear fecha local (no UTC)
function getLocalDateTime(dateString, hour, minute) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { service, appointmentToEdit } = route.params || {};

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loadingPets, setLoadingPets] = useState(true);

  // Fecha local hoy
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Horario seleccionado
  const [selectedHour, setSelectedHour] = useState(null);

  // Google Auth
  const { userInfo } = useGoogleAuth();
  const [userEmail, setUserEmail] = useState(null);

  // Estado de carga al confirmar cita
  const [loadingConfirm, setLoadingConfirm] = useState(false);

  // Inicializar campos si es edición
  useEffect(() => {
    if (appointmentToEdit) {
      // Convierte a Date si es string
      const dateObj =
        typeof appointmentToEdit.start === "string"
          ? new Date(appointmentToEdit.start)
          : appointmentToEdit.start;
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      setSelectedDate(`${yyyy}-${mm}-${dd}`);

      const hour = dateObj.getHours().toString().padStart(2, "0");
      const minute = dateObj.getMinutes().toString().padStart(2, "0");
      setSelectedHour(`${hour}:${minute}`);

      if (appointmentToEdit.petId) {
        setSelectedPet(appointmentToEdit.petId);
      }
    }
  }, [appointmentToEdit]);

  // Obtener email del usuario
  useEffect(() => {
    const fetchEmail = async () => {
      if (userInfo?.email) {
        setUserEmail(userInfo.email);
      } else {
        const email = await AsyncStorage.getItem("userEmail");
        setUserEmail(email);
      }
    };
    fetchEmail();
  }, [userInfo]);

  // Obtener mascotas
  useEffect(() => {
    const fetchPets = async () => {
      setLoadingPets(true);
      const uid = await AsyncStorage.getItem("userUid");
      if (uid) {
        const petsData = await getPetsByOwner(uid);
        const petsList = petsData.map((pet) => ({
          label: pet.name,
          value: pet.id,
        }));
        setPets(petsList);

        // Si es edición y el petId existe en la lista, selecciona la mascota
        if (
          appointmentToEdit &&
          appointmentToEdit.petId &&
          petsList.some((p) => p.value === appointmentToEdit.petId)
        ) {
          setSelectedPet(appointmentToEdit.petId);
        }
      }
      setLoadingPets(false);
    };
    fetchPets();
  }, []);

  // Agendar en calendario del dispositivo
  const createDeviceCalendarEvent = async (appointment) => {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permiso de calendario no concedido");
    }
    const calendars = await ExpoCalendar.getCalendarsAsync(
      ExpoCalendar.EntityTypes.EVENT
    );
    const defaultCalendar =
      calendars.find((cal) => cal.allowsModifications) || calendars[0];

    const eventId = await ExpoCalendar.createEventAsync(defaultCalendar.id, {
      title: `Cita con ${appointment.petName}`,
      startDate: appointment.start,
      endDate: appointment.end,
      timeZone: "America/Mexico_City",
      notes: appointment.description || "",
    });
    return eventId;
  };

  // Confirmar cita (crear o editar)
  const handleConfirm = async () => {
    // Validación de campos
    if (!selectedDate || !selectedHour || !selectedPet) {
      Alert.alert(
        "Faltan datos",
        "Selecciona fecha, hora y mascota para continuar."
      );
      return;
    }
    if (pets.length === 0) {
      Alert.alert(
        "Sin mascotas",
        "Debes agregar una mascota antes de agendar una cita."
      );
      return;
    }

    try {
      setLoadingConfirm(true);
      const petObj = pets.find((p) => p.value === selectedPet);
      const [hour, minute] = selectedHour.split(":");
      const start = getLocalDateTime(
        selectedDate,
        Number(hour),
        Number(minute)
      );
      const end = new Date(start.getTime() + (service?.time || 60) * 60000);

      const appointment = {
        petName: petObj?.label || "",
        petId: selectedPet,
        description: `Servicio: ${service?.title}`,
        start,
        end,
        userEmail: userEmail,
      };

      const googleToken = userInfo?.accessToken;

      if (appointmentToEdit) {
        // EDITAR cita
        await updateAppointment(
          appointmentToEdit.id,
          appointment,
          googleToken,
          appointmentToEdit.googleEventId
        );
      } else {
        // CREAR cita
        await createAppointment(appointment, googleToken);
      }

      // Agenda en el calendario del dispositivo (solo para nuevas citas)
      if (!appointmentToEdit) {
        await createDeviceCalendarEvent(appointment);
      }

      // Redirige a la sección/tab "Mis Citas" del TabNavigator
      navigation.navigate("Dashboard", { screen: "Mis Citas" });
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo agendar la cita");
    } finally {
      setLoadingConfirm(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {appointmentToEdit ? "Editar cita" : "Agendar cita"}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {service && (
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceInfo}>Precio: {service.price} Mx</Text>
            <Text style={styles.serviceInfo}>
              Tiempo aprox: {service.time} min
            </Text>
          </View>
        )}

        {/* Calendario visual */}
        <View style={styles.calendarContainer}>
          <Text style={styles.timeSlotsTitle}>Selecciona una fecha</Text>
          <Calendar
            minDate={today}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={
              selectedDate
                ? {
                    [selectedDate]: {
                      selected: true,
                      selectedColor: "#007aff",
                    },
                  }
                : {}
            }
            theme={{
              todayTextColor: "#007aff",
              arrowColor: "#007aff",
              selectedDayBackgroundColor: "#007aff",
            }}
          />
        </View>

        {/* Horarios Disponibles */}
        <View style={styles.timeSlotsContainer}>
          <Text style={styles.timeSlotsTitle}>Horarios Disponibles</Text>
          <View style={styles.timeSlotsList}>
            {schedules.map((h) => (
              <TouchableOpacity
                key={h.value}
                style={[
                  styles.hourButton,
                  selectedHour === h.value && styles.selectedHourButton,
                ]}
                onPress={() => setSelectedHour(h.value)}
              >
                <Text
                  style={[
                    styles.hourButtonText,
                    selectedHour === h.value && styles.selectedHourButtonText,
                  ]}
                >
                  {h.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dropdown para seleccionar mascota */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Selecciona la mascota</Text>
          {loadingPets ? (
            <ActivityIndicator color="#007aff" />
          ) : pets.length === 0 ? (
            <View style={styles.dropdownCard}>
              <Text
                style={{ color: "#e74c3c", fontSize: 16, textAlign: "center" }}
              >
                No tienes mascotas registradas. Agrega una para poder agendar
                una cita.
              </Text>
            </View>
          ) : (
            <View style={styles.dropdownCard}>
              <RNPickerSelect
                onValueChange={setSelectedPet}
                items={pets}
                placeholder={{
                  label: "Selecciona una mascota...",
                  value: null,
                }}
                style={{
                  inputIOS: styles.dropdownInput,
                  inputAndroid: styles.dropdownInput,
                  iconContainer: styles.dropdownIconContainer,
                  placeholder: styles.dropdownPlaceholder,
                }}
                value={selectedPet}
                disabled={!!appointmentToEdit}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={
              loadingConfirm || pets.length === 0 // Deshabilita si no hay mascotas
            }
          >
            {loadingConfirm ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmButtonText}>
                {appointmentToEdit ? "Guardar cambios" : "Confirmar"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    padding: 20,
    marginTop: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 5,
  },
  serviceDetails: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  serviceInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  calendarContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  timeSlotsContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  timeSlotsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  timeSlotsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 60,
    gap: 10,
  },
  hourButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 5,
  },
  selectedHourButton: {
    backgroundColor: "#007aff",
  },
  hourButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedHourButtonText: {
    color: "#fff",
  },
  placeholderText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    padding: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginLeft: 5,
  },
  dropdownCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  dropdownInput: {
    fontSize: 16,
    color: "#333",
    padding: 8,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
    paddingRight: 40,
  },
  dropdownPlaceholder: {
    color: "#999",
    fontSize: 16,
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: "#f5f5f5",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 15,
    width: "48%",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#007aff",
    borderRadius: 20,
    padding: 15,
    width: "48%",
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});

export default ScheduleScreen;
