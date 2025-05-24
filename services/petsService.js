import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const petsCollection = collection(db, 'pets');

// CRUD

export const addPet = async (petData) => await addDoc(petsCollection, petData);

export const getPets = async () => {
  const snapshot = await getDocs(petsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPetsByOwner = async (uid) => {
  const q = query(petsCollection, where("propietarioId", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updatePet = async (id, data) => {
  const petDoc = doc(db, 'pets', id);
  await updateDoc(petDoc, data);
};

export const deletePet = async (id) => {
  const petDoc = doc(db, 'pets', id);
  await deleteDoc(petDoc);
};
