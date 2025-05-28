import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";

const DashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Image
          source={require("../assets/iconDog.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Perruqueria</Text>
      </View>

      <Text style={styles.date}>Próxima cita</Text>
            <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Corte de cabello</Text>
          <View style={styles.icons}>
            <TouchableOpacity>
              <Text style={styles.pIcon}>🐾</Text>
            </TouchableOpacity>
            <TouchableOpacity>
             
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.status}>Confirmada</Text>
        <Text style={styles.time}>Mañana, 10:00 AM</Text>
</View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 30,
  },
  header: {
    flexDirection: 'row',       // Esto coloca los elementos en fila (horizontal)
    alignItems: 'center',      // Centra verticalmente los elementos
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  card: {
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 15,
  marginTop: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
},

cardHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

cardTitle: {
  fontWeight: "bold",
  fontSize: 16,
  color: "#000",
},

// icons: {
//   flexDirection: "row",
//   gap: 10,
// },

// editIcon: {
//   fontSize: 16,
//   color: "#555",
//   marginRight: 10,
// },

// deleteIcon: {
//   fontSize: 16,
//   color: "red",
// },

status: {
  marginTop: 8,
  fontSize: 14,
  color: "#333",
},

time: {
  fontSize: 14,
  color: "#555",
},

});

export default DashboardScreen;
