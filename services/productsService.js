import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const productsCollection = collection(db, 'products');

export const addProduct = async (data) => {
  const docRef = await addDoc(productsCollection, data);
  return docRef.id;
};

export const getProductsByCategory = async (categoryId) => {
  const q = query(productsCollection, where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProducts = async () => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateProduct = async (id, data) => {
  const productDoc = doc(db, 'products', id);
  await updateDoc(productDoc, data);
};



export const deleteProduct = async (id) => {
  const productDoc = doc(db, 'products', id);
  await deleteDoc(productDoc);
};
