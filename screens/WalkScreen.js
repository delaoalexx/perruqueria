import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getProducts } from '../services/productsService'; // Asegúrate de que la ruta sea correcta

const WalkScreen = ({ navigation }) => {
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const numColumns = 2;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setToys(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón de retroceso */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Juguetes</Text>
      
      {toys.length === 0 ? (
        <Text style={styles.noProductsText}>No hay productos disponibles</Text>
      ) : (
        <FlatList
          data={toys}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>{item.name}</Text>
              {/* <Text style={styles.cardText}>{item.imageUrl}</Text> */}
              {/* Puedes añadir más campos aquí si lo necesitas */}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    marginTop: 50,
    textAlign: 'center',
  },
  listContainer: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 5,
    height: 150,
    maxWidth: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '200',
    
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  noProductsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default WalkScreen;