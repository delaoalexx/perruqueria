import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart, LineChart } from "react-native-chart-kit";
import {
  getTotalPets,
  getTotalProducts,
  getPetsByTypeAndSex,
  getClientsByMonth
} from "../services/statsService";

const BddScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [totalPets, setTotalPets] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [petsStats, setPetsStats] = useState(null);
  const [clientsByMonth, setClientsByMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      setLoadingProducts(true);
      setLoadingStats(true);
      setLoadingClients(true);

      const [petsTotal, productsTotal, stats, clientsMonthly] = await Promise.all([
        getTotalPets(),
        getTotalProducts(),
        getPetsByTypeAndSex(),
        getClientsByMonth()
      ]);

      setTotalPets(petsTotal);
      setTotalProducts(productsTotal);
      setPetsStats(stats);
      setClientsByMonth(clientsMonthly);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
      setLoadingProducts(false);
      setLoadingStats(false);
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
    if (route.params?.onGoBack) {
      setTimeout(() => {
        route.params.onGoBack();
      }, 100);
    }
  };

  const prepareChartData = () => {
    if (!petsStats) return [];

    return [
      {
        name: "Perros Machos",
        population: petsStats.Dog.Male,
        color: "#2125F0",
        legendFontColor: "#2125F0",
        legendFontSize: 15
      },
      {
        name: "Perros Hembras",
        population: petsStats.Dog.Female,
        color: "#9621F0",
        legendFontColor: "#9621F0",
        legendFontSize: 15
      },
      {
        name: "Gatos Machos",
        population: petsStats.Cat.Male,
        color: "#3AD6EE",
        legendFontColor: "#3AD6EE",
        legendFontSize: 15
      },
      {
        name: "Gatos Hembras",
        population: petsStats.Cat.Female,
        color: "#F396FA",
        legendFontColor: "#F396FA",
        legendFontSize: 15
      }
    ];
  };

  const prepareBarChartData = () => {
    const labels = [
      "Ene", "Feb", "Mar", "Abr",
      "May", "Jun", "Jul", "Ago",
      "Sep", "Oct", "Nov", "Dic"
    ];

    return {
      labels,
      datasets: [
        {
          data: clientsByMonth,
         
          color: () => '#4CC0FF', 
          strokeWidth: 2
        }
      ]
    };
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con título centrado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard admin</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.infoBox}>
          {loading ? (
            <Text style={styles.infoText}>Cargando...</Text>
          ) : (
            <>
              <Text style={styles.infoTitle}>Total de Mascotas</Text>
              <Text style={styles.infoNumber}>{totalPets}</Text>
            </>
          )}
        </View>

        <View style={styles.infoBox}>
          {loadingProducts ? (
            <Text style={styles.infoText}>Cargando...</Text>
          ) : (
            <>
              <Text style={styles.infoTitle}>Total de Productos</Text>
              <Text style={styles.infoNumber}>{totalProducts}</Text>
            </>
          )}
        </View>
      </View>

      {/* Gráfica de Torta - Distribución de Mascotas */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribución de Mascotas</Text>
        {loadingStats ? (
          <Text style={styles.infoText}>Cargando gráfica...</Text>
        ) : petsStats ? (
          <PieChart
            data={prepareChartData()}
            width={300}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={styles.infoText}>No hay datos disponibles</Text>
        )}
      </View>

      {/* Gráfica de Líneas - Clientes por Mes */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Clientes por Mes</Text>
        {loadingClients ? (
          <Text style={styles.infoText}>Cargando gráfica...</Text>
        ) : (
          <LineChart
            data={prepareBarChartData()}
            width={300}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 171, 245, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 171, 245, ${opacity})`,
              style: {
                borderRadius: 10
              },
              propsForBackgroundLines: {
                stroke: "#ccc",
                strokeWidth: 1
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 10
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 24,
  },
  backButton: {},
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "45%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  infoNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
  },
  infoText: {
    fontSize: 18,
    color: "#666",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
});

export default BddScreen;















