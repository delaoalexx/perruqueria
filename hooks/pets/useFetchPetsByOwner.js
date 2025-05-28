import { useEffect, useState } from 'react';
import { getPetsByOwner } from '../../services/petsService';

const useFetchPetsByOwner = (uid) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false); // ✅ Si no hay uid, no debe estar cargando
      return;
    }

    const fetchPets = async () => {
      setLoading(true); // ✅ Asegurar que loading sea true al iniciar
      setError(null);   // ✅ Limpiar errores anteriores
      
      try {
        const data = await getPetsByOwner(uid);
        setPets(data || []); // ✅ Fallback por si data es null/undefined
      } catch (err) {
        setError(err.message || 'Error al cargar las mascotas'); // ✅ Extraer mensaje
        setPets([]); // ✅ Limpiar mascotas si hay error
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [uid]);

  // ✅ Función para refrescar manualmente
  const refetch = () => {
    if (uid) {
      const fetchPets = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const data = await getPetsByOwner(uid);
          setPets(data || []);
        } catch (err) {
          setError(err.message || 'Error al cargar las mascotas');
          setPets([]);
        } finally {
          setLoading(false);
        }
      };
      fetchPets();
    }
  };

  return { pets, loading, error, refetch };
};

export default useFetchPetsByOwner;