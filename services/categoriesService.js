import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';


const categoriesCollection = collection(db, 'categories');

export const addCategory = async (data) => {
  const docRef = await addDoc(categoriesCollection, data);
  return docRef.id;
};

export const getCategories = async () => {
  const snapshot = await getDocs(categoriesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateCategory = async (id, data) => {
  const categoryDoc = doc(db, 'categories', id);
  await updateDoc(categoryDoc, data);
};

export const deleteCategory = async (id) => {
  const categoryDoc = doc(db, 'categories', id);
  await deleteDoc(categoryDoc);
};
