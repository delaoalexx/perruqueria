import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';

// Datos de ejemplo para las cards
const toys = [
  { id: '1', name: 'Pelota interactiva' },
  { id: '2', name: 'Hueso de goma' },
  { id: '3', name: 'Cuerda para jugar' },
  { id: '4', name: 'Peluche sonoro' },
];

const WalkScreen = ({ navigation }) => {
  // Calcular el número de columnas basado en la orientación/pantalla
  const numColumns = 2;
  
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
      
      {/* Usar FlatList para mejor rendimiento y manejo responsive */}
      <FlatList
        data={toys}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.name}</Text>
          </View>
        )}
      />
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
    maxWidth: '48%', // Esto asegura que solo haya 2 cards por fila con espacio entre ellas
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
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
});

export default WalkScreen;