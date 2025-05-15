import { GoogleAuthProvider, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { auth } from './firebaseConfig';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const signInWithGoogle = async () => {
    const result = await promptAsync();
    if (result.type === 'success') {
      const { id_token } = result.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      return await signInWithCredential(auth, credential);
    }
  };

  return { request, response, promptAsync, signInWithGoogle };
};

export const registerWithEmail = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};
