import { useState } from 'react';
import { deletePet } from '../../services/petService';

const useDeletePet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removePet = async (id) => {
    setLoading(true);
    try {
      await deletePet(id);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { removePet, loading, error };
};

export default useDeletePet;
