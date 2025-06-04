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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPetsByOwner } from "../services/petsService";
import { Calendar } from "react-native-calendars";

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { service } = route.params || {};

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loadingPets, setLoadingPets] = useState(true);

  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    const fetchPets = async () => {
      setLoadingPets(true);
      const uid = await AsyncStorage.getItem("userUid");
      if (uid) {
        const petsData = await getPetsByOwner(uid);
        setPets(
          petsData.map((pet) => ({
            label: pet.name,
            value: pet.id,
          }))
        );
      }
      setLoadingPets(false);
    };
    fetchPets();
  }, []);

  const handleConfirm = () => {
    console.log(
      `Cita confirmada para el servicio ${service?.title} el día ${selectedDate}`
    );
    navigation.goBack();
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
          <Text style={styles.headerTitle}>Agendar cita</Text>
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

        {/* Horarios Disponibles (puedes personalizar esto) */}
        <View style={styles.timeSlotsContainer}>
          <Text style={styles.timeSlotsTitle}>Horarios Disponibles</Text>
          <View style={styles.timeSlotsList}>
            <Text style={styles.placeholderText}>
              Aquí se mostrarán los horarios disponibles para la fecha
              seleccionada.
            </Text>
          </View>
        </View>

        {/* Dropdown para seleccionar mascota */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Selecciona la mascota</Text>
          {loadingPets ? (
            <ActivityIndicator color="#007aff" />
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
            disabled={!selectedDate || !selectedPet}
          >
            <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
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
