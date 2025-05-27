import { useEffect, useState } from 'react';
import { getPetsByOwner } from '../../services/petsService';

const useFetchPetsByOwner = (uid) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchPets = async () => {
      try {
        const data = await getPetsByOwner(uid);
        setPets(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [uid]);

  return { pets, loading, error };
};

export default useFetchPetsByOwner;
