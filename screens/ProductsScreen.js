import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const productos = [
  { id: '1', nombre: 'Paseo', icono: require('../assets/bone.png'), screen: 'WalkScreen' },
  { id: '2', nombre: 'Limpieza', icono: require('../assets/soap.png'), screen: 'LimpiezaScreen' },
  { id: '3', nombre: 'Alimentación', icono: require('../assets/food.png'), screen: 'AlimentacionScreen' },
  { id: '4', nombre: 'Ropa', icono: require('../assets/g.png'), screen: 'RopaScreen' },
  { id: '5', nombre: 'Juguetes', icono: require('../assets/toy.png'), screen: 'JuguetesScreen' },
];

const ProductsScreen = ({ navigation }) => {
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item}
            onPress={() => handlePress(item.screen)}
          >
            <Image source={item.icono} style={styles.icono} />
            <Text style={styles.nombre}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// Los estilos se mantienen igual...
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  icono: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
  },
});

export default ProductsScreen;