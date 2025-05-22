import {
  GoogleAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { auth } from './firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  
  const redirectUri = 'http://localhost:8081'; 
  const expoClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID;
  

  const [request, response, promptAsync] = Google.useAuthRequest({
  webClientId,
  redirectUri,
  iosClientId,

  
});


  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      console.log(result);
      if (result?.type === 'success' && result.authentication?.idToken) {
        const { idToken } = result.authentication;
        const credential = GoogleAuthProvider.credential(idToken);
        return await signInWithCredential(auth, credential);
      } else if (result?.type === 'cancel') {
        console.log('Usuario canceló el login');
      } else {
        throw new Error('Google sign-in failed or was cancelled');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  return { request, response, promptAsync, signInWithGoogle };
};

export const registerWithEmail = async (email, password) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Email Registration Error:', error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};
