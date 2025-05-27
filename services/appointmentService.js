import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// 👉 Guarda la cita en Firestore
export const saveAppointmentToFirestore = async (appointment) => {
  const ref = collection(db, 'appointments');
  await addDoc(ref, {
    ...appointment,
    createdAt: Timestamp.now(),
  });
};

// 👉 Crea evento en Google Calendar
export const createGoogleCalendarEvent = async (token, appointment) => {
  const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: `Cita con ${appointment.petName}`,
      description: appointment.description || '',
      start: {
        dateTime: appointment.start.toISOString(),
        timeZone: 'America/Mexico_City',
      },
      end: {
        dateTime: appointment.end.toISOString(),
        timeZone: 'America/Mexico_City',
      },
    }),
  });

  if (!calendarResponse.ok) {
    throw new Error('Error al crear el evento en Google Calendar');
  }

  const eventData = await calendarResponse.json();
  return eventData;
};
