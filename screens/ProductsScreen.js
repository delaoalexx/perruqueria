// import React from 'react';
// import { View, Text } from 'react-native';

// const ProductsScreen = () => {
//   return (
//     <View>
//       <Text>Productos</Text>
//     </View>
//   );
// };

// export default ProductsScreen; 
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const productos = [
  { id: '1', nombre: 'Paseo', icono: require('../assets/bone.png') },
  { id: '2', nombre: 'Limpieza', icono: require('../assets/soap.png') },
  { id: '3', nombre: 'Alimentación', icono: require('../assets/food.png') },
  { id: '4', nombre: 'Ropa', icono: require('../assets/g.png') },
  { id: '5', nombre: 'Juguetes', icono: require('../assets/toy.png') },
];

const ProductsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={item.icono} style={styles.icono} />
            <Text style={styles.nombre}>{item.nombre}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

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
