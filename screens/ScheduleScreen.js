import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { service } = route.params || {};

  // Función para manejar la confirmación de la cita
  const handleConfirm = () => {
    // Aquí iría la lógica para crear la cita en Google Calendar
    console.log(`Cita confirmada para el servicio ${service?.title}`);

    // Navegar de vuelta a la pantalla de servicios
    navigation.goBack();

    /* 
    IMPLEMENTACIÓN FUTURA CON GOOGLE CALENDAR API:
    
    1. Necesitarás configurar OAuth2 para Google Calendar:
       - Registrar tu app en Google Cloud Console (https://console.cloud.google.com/)
       - Crear un proyecto y habilitar la API de Google Calendar
       - Obtener credenciales de cliente OAuth2 (ID de cliente y secreto)
       - Implementar el flujo de autenticación en tu app usando react-native-app-auth
    
    2. Instalar las dependencias necesarias:
       npm install react-native-app-auth axios
    
    3. Configurar la autenticación OAuth2:
       const config = {
         clientId: 'TU_ID_DE_CLIENTE',
         redirectUrl: 'com.tuapp:/oauth2callback',
         scopes: ['https://www.googleapis.com/auth/calendar'],
         serviceConfiguration: {
           authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
           tokenEndpoint: 'https://accounts.google.com/o/oauth2/token',
         },
       };
    
    4. Autenticar al usuario:
       const { accessToken } = await authorize(config);
    
    5. Una vez autenticado, usarás la API de Google Calendar para:
       - Verificar disponibilidad en el calendario
       - Obtener horarios disponibles
       - Crear un nuevo evento con los detalles de la cita
       
       async function createCalendarEvent(date, time) {
         try {
           // Formatear fecha y hora para la API
           const appointmentDateTime = new Date(date);
           const [hours, minutes] = time.split(':');
           appointmentDateTime.setHours(parseInt(hours));
           appointmentDateTime.setMinutes(parseInt(minutes));
           
           // Calcular la hora de finalización (basada en la duración del servicio)
           const endDateTime = new Date(appointmentDateTime.getTime() + parseInt(service.time) * 60000);
           
           // Crear el evento en Google Calendar
           const event = {
             summary: `Cita: ${service.title}`,
             description: `Servicio: ${service.title}\nPrecio: ${service.price} Mx\nDuración: ${service.time} min`,
             start: {
               dateTime: appointmentDateTime.toISOString(),
               timeZone: 'America/Mexico_City',
             },
             end: {
               dateTime: endDateTime.toISOString(),
               timeZone: 'America/Mexico_City',
             },
           };
           
           // Llamar a la API de Google Calendar
           const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
             method: 'POST',
             headers: {
               Authorization: `Bearer ${accessToken}`,
               'Content-Type': 'application/json',
             },
             body: JSON.stringify(event),
           });
           
           const data = await response.json();
           console.log('Evento creado:', data);
           return data;
         } catch (error) {
           console.error('Error al crear el evento:', error);
           throw error;
         }
       }
       
    6. Para obtener horarios disponibles:
       async function getAvailableTimeSlots(date) {
         try {
           // Configurar los límites de tiempo para el día seleccionado
           const startOfDay = new Date(date);
           startOfDay.setHours(0, 0, 0, 0);
           
           const endOfDay = new Date(date);
           endOfDay.setHours(23, 59, 59, 999);
           
           // Consultar eventos existentes para ese día
           const response = await fetch(
             `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}`,
             {
               headers: {
                 Authorization: `Bearer ${accessToken}`,
               },
             }
           );
           
           const data = await response.json();
           const existingEvents = data.items || [];
           
           // Generar horarios disponibles basados en los eventos existentes
           // Aquí implementarías tu lógica para determinar qué horarios están disponibles
           
           return availableTimeSlots;
         } catch (error) {
           console.error('Error al obtener horarios disponibles:', error);
           throw error;
         }
       }
    */
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Encabezado con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendar cita</Text>
        </View>

        {/* Detalles del servicio seleccionado */}
        {service && (
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceInfo}>Precio: {service.price} Mx</Text>
            <Text style={styles.serviceInfo}>
              Tiempo aprox: {service.time} min
            </Text>
          </View>
        )}

        {/* Contenedor para el Calendario (a implementar con Google Calendar) */}
        <View style={styles.calendarContainer}>
          <Text style={styles.placeholderText}>
            Aquí se mostrará el calendario de Google Calendar
          </Text>
        </View>

        {/* Contenedor para Horarios Disponibles (a implementar con Google Calendar) */}
        <View style={styles.timeSlotsContainer}>
          <Text style={styles.timeSlotsTitle}>Horarios Disponibles</Text>
          <View style={styles.timeSlotsList}>
            <Text style={styles.placeholderText}>
              Aquí se mostrarán los horarios disponibles obtenidos de Google
              Calendar
            </Text>
          </View>
        </View>

        {/* Botones de acción */}
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
          >
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
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
