import { useState } from 'react';
import { deletePet } from '../../services/petsService';

const useDeletePet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removePet = async (id) => {
    setLoading(true);
    setError(null); // ✅ Limpiar error anterior
    try {
      const result = await deletePet(id);
      return result; // ✅ Retornar el resultado 
    } catch (err) {
      setError(err.message || 'Error al eliminar la mascota'); // ✅ Extraer mensaje del error
      throw err; // ✅ Re-lanzar el error
    } finally {
      setLoading(false);
    }
  };

  return { removePet, loading, error };
};

export default useDeletePet;