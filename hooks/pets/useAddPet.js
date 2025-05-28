import { useState } from 'react';
import { addPet } from '../../services/petsService';

export const useAddPet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPet = async (petData) => {
    setLoading(true);
    setError(null);
    try {
      const id = await addPet(petData);
      return id; // ✅ Ahora sí retorna el id 
      setError(err.message || 'Error al agregar la mascota');
      throw err; // ✅ También es buena práctica re-lanzar el error
    } finally {
      setLoading(false);
    }
  };

  return { createPet, loading, error };
};