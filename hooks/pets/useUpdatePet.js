import { useState } from 'react';
import { updatePet } from '../../services/petService';

const useUpdatePet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editPet = async (id, updatedData) => {
    setLoading(true);
    try {
      await updatePet(id, updatedData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { editPet, loading, error };
};

export default useUpdatePet;
