import { useEffect, useState } from 'react';
import { getPets } from '../../services/petService';

const useFetchPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
        setPets(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return { pets, loading, error };
};

export default useFetchPets;
