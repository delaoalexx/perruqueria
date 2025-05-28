import { useState } from 'react';
import { updatePet } from '../../services/petsService';

const useUpdatePet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editPet = async (id, updatedData) => {
    setLoading(true);
    setError(null); // ✅ Limpiar error anterior
    
    try {
      const result = await updatePet(id, updatedData);
      return result; // ✅ Retornar el resultado
    } catch (err) {
      setError(err.message || 'Error al actualizar la mascota'); // ✅ Extraer mensaje del error
      throw err; // ✅ Re-lanzar el error
    } finally {
      setLoading(false);
    }
  };

  return { editPet, loading, error };
};

export default useUpdatePet;