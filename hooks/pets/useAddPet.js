import { useState } from 'react';
import { addPet } from '../../services/petsService';

export const useAddPet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPet = async (petData) => {
    setLoading(true);
    try {
      await addPet(petData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { createPet, loading, error };
};


