import { useState } from 'react';
import { saveAppointmentToFirestore, createGoogleCalendarEvent } from '../../services/appointmentService';

export const useCreateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAppointment = async (appointmentData, googleToken) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Crear en Google Calendar
      const event = await createGoogleCalendarEvent(googleToken, appointmentData);

      // 2. Guardar en Firestore (puedes guardar también el ID del evento si quieres sincronizar después)
      await saveAppointmentToFirestore({
        ...appointmentData,
        googleEventId: event.id,
    
      });

      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Ocurrió un error');
      setLoading(false);
      return { success: false };
    }
  };

  return {
    createAppointment,
    loading,
    error,
  };
};
