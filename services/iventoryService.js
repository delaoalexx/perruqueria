import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const inventoryCollection = collection(db, 'inventory_by_branch');

export const addInventoryItem = async (data) => {
  const docRef = await addDoc(inventoryCollection, data);
  return docRef.id;
};

export const getInventoryByBranch = async (branchId) => {
  const q = query(inventoryCollection, where("branchId", "==", branchId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateInventoryItem = async (id, data) => {
  const itemDoc = doc(db, 'inventory', id);
  await updateDoc(itemDoc, data);
};

export const deleteInventoryItem = async (id) => {
  const itemDoc = doc(db, 'inventory', id);
  await deleteDoc(itemDoc);
};
