import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  AccessibilityInfo,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getProductsByCategory } from "../services/productsService";

const FoodScreen = ({ navigation }) => {
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const numColumns = 2;

  useEffect(() => {
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };

    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setIsScreenReaderEnabled
    );

    checkScreenReader();

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryId = " eAN4tHu28JjfRKjhrcnD ";
        console.log("Fetching products for category:", categoryId);
        const products = await getProductsByCategory(categoryId);

        if (!products || products.length === 0) {
          console.warn("No products found for category:", categoryId);
        }

        setToys(products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProductCard = ({ item }) => (
    <View style={styles.card} accessible={true}>
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
            accessibilityIgnoresInvertColors={true}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="paw" size={40} color="#ccc" />
          </View>
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          MX{item.price ? item.price.toFixed(2) : "0.00"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      importantForAccessibility="yes"
      accessibilityViewIsModal={isScreenReaderEnabled}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver atrás"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Comida</Text>
      </View>

      {toys.length === 0 ? (
        <View style={[styles.container, styles.center]}>
          <Text style={styles.emptyText}>No hay productos disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={toys}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          accessibilityElementsHidden={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginTop: 20,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  textContainer: {
    paddingHorizontal: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    height: 40, // Altura fija para 2 líneas
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2ecc71",
    textAlign: "right",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 16,
  },
  emptyText: {
    color: "#7f8c8d",
    fontSize: 16,
  },
});

export default FoodScreen;
