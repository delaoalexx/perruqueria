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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';


WebBrowser.maybeCompleteAuthSession();




export const useGoogleAuth = () => {
  const [userInfo, setUserInfo] = useState(null);

  const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true, // Para desarrollo
});

  const expoClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID; // Para dev EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId,
    redirectUri,
    iosClientId,
    androidClientId,
    expoClientId,
  });

  const getLocalUser = async () => {
    try {
      const data = await AsyncStorage.getItem('user');
      if (data !== null) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Error getting local user:', error);
      throw error;
    }
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = await response.json();
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      console.log('Google auth result:', result);
      if (result?.type === 'success' && result.authentication) {
      const { idToken, accessToken } = result.authentication;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      await signInWithCredential(auth, credential);
      await getUserInfo(accessToken);
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

  useEffect(() => {
    getLocalUser().then(user => {
      if (user) {
        setUserInfo(user);
      }
    });
  }, []);

  return { request, response, promptAsync, signInWithGoogle, userInfo };
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

export const logoutFirebase = async () => {
  try {
    await AsyncStorage.removeItem('user');
    return await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};
