import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Esta funcion devuelve la cantidad de clientes que hay en general
export const getTotalPets = async () => {
  const snapshot = await getDocs(collection(db, 'pets'));
  return snapshot.size;
};

// Esta funcion devuelve la cantidad de productos que hay en general
export const getTotalProducts = async () => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.size;
};

 //esto ASUMIENDO que cada cita tiene un precio fijo de 900, como asi sale en el front lo deje asi xD
export const getMonthlyEarnings = async () => {
  const snapshot = await getDocs(collection(db, 'appointments'));
  const totalAppointments = snapshot.size;

  const pricePerService = 900;
  const total = totalAppointments * pricePerService;

  return total;
};

// Esta funcion devuelve un objeto con la cantidad de mascotas por tipo y sexo
export const getPetsByTypeAndSex = async () => {
  const snapshot = await getDocs(collection(db, 'pets'));
  const stats = {
    Dog: { Male: 0, Female: 0 },
    Cat: { Male: 0, Female: 0 },
  };

  snapshot.forEach(doc => {
    const { type, gender } = doc.data();
    if (stats[type] && stats[type][gender] !== undefined) {
      stats[type][gender]++;
    }
  });

  return stats;
};

// Esta funcion devuelve un array con la cantidad de clientes por mes
// Ejemplo: [2, 3, 1, 0, ...] donde el indice 0 es enero, 1 es febrero, etc.
export const getClientsByMonth = async () => {
  const snapshot = await getDocs(collection(db, 'appointments'));

  const monthMap = {}; // mes (0-11) 

  snapshot.forEach(doc => {
    const { start, userEmail } = doc.data();
    if (start && userEmail) {
      const date = new Date(start.seconds * 1000);
      const month = date.getMonth(); // 0 = enero, 11 = diciembre, ojo con eso Lau/Michi

      if (!monthMap[month]) {
        monthMap[month] = new Set();
      }

      monthMap[month].add(userEmail);
    }
  });

  // Pasamos a array tipo [2, 3, 1, 0, ...]
  const result = Array(12).fill(0);
  for (let i = 0; i < 12; i++) {
    result[i] = monthMap[i]?.size || 0;
  }

  return result;
};
