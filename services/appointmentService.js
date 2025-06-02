import { db } from '../firebase/firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

// Crear evento en Google Calendar
const createGoogleEvent = async (appointment, googleToken) => {
  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${googleToken}`,
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

  if (!res.ok) throw new Error('Error al crear evento en Google Calendar');
  const data = await res.json();
  return data.id;
};

// Crear cita en Firestore + Google Calendar
export const createAppointment = async (appointment, googleToken) => {
  const googleEventId = await createGoogleEvent(appointment, googleToken);
  const docRef = await addDoc(collection(db, 'appointments'), {
    ...appointment,
    start: Timestamp.fromDate(appointment.start),
    end: Timestamp.fromDate(appointment.end),
    googleEventId,
  });
  return docRef.id;
};

// Obtener citas de un usuario
export const getAppointmentsForUser = async (userEmail) => {
  const q = query(collection(db, 'appointments'), where('userEmail', '==', userEmail));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    start: doc.data().start.toDate(),
    end: doc.data().end.toDate(),
  }));
};

// Eliminar cita de Firestore + Google Calendar
export const deleteAppointment = async (appointmentId, googleEventId, googleToken) => {
  await deleteDoc(doc(db, 'appointments', appointmentId));

  if (googleEventId) {
    await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${googleToken}`,
      },
    });
  }
};

// Editar cita en Firestore + Google Calendar
export const updateAppointment = async (appointmentId, updatedData, googleToken, googleEventId) => {
  await updateDoc(doc(db, 'appointments', appointmentId), {
    ...updatedData,
    start: Timestamp.fromDate(updatedData.start),
    end: Timestamp.fromDate(updatedData.end),
  });

  if (googleEventId) {
    await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${googleToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `Cita con ${updatedData.petName}`,
        description: updatedData.description || '',
        start: {
          dateTime: updatedData.start.toISOString(),
          timeZone: 'America/Mexico_City',
        },
        end: {
          dateTime: updatedData.end.toISOString(),
          timeZone: 'America/Mexico_City',
        },
      }),
    });
  }
};
