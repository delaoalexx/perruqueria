import { logoutFirebase } from '../../firebase/authService';

export const useLogout = () => {
  const logout = async () => {
    try {
      await logoutFirebase();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return { logout };
};
