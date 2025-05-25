import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useEmailAuth = () => {
  const registerWithEmail = async (email, password) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email Registration Error:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      return await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  };

  return {
    registerWithEmail,
    loginWithEmail,
    logout,
  };
};
