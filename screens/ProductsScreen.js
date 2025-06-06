import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

const productos = [
  {
    id: "1",
    nombre: "Paseo",
    icono: require("../assets/bone.png"),
    screen: "WalkScreen",
  },
  {
    id: "2",
    nombre: "Limpieza",
    icono: require("../assets/soap.png"),
    screen: "CleanScreen",
  },
  {
    id: "3",
    nombre: "Alimentación",
    icono: require("../assets/food.png"),
    screen: "FoodScreen",
  },
  {
    id: "4",
    nombre: "Ropa",
    icono: require("../assets/g.png"),
    screen: "ClothesScreen",
  },
  {
    id: "5",
    nombre: "Juguetes",
    icono: require("../assets/toy.png"),
    screen: "ToyScreen",
  },
];

const ProductsScreen = ({ navigation }) => {
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Productos</Text>
      </View>
      <View style={styles.productsContainer}>
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
          columnWrapperStyle={{ justifyContent: "space-between" }}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginTop: 20,
  },
  sectionHeader: {
    marginBottom: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  productsContainer: {
    marginBottom: 20,
  },
  list: {
    justifyContent: "center",
  },
  item: {
    width: "47%",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  icono: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
});

export default ProductsScreen;
