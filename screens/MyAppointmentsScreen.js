import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
//import { View, Text } from 'react-native';

const MyAppointmentsScreen = () => {
  // const navigation = useNavigation();
  return (
    <View>
      <Text>Mis citas</Text>
        <Text>Mis ciddddddtas</Text>

     <View style={styles.card}>
  <View style={styles.cardHeader}>
    <Text style={styles.cardTitle}>Corte de cabello</Text>
    <View style={styles.icons}>
      <TouchableOpacity>
        <Text style={styles.editIcon}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  </View>
  <Text style={styles.status}>Confirmada</Text>
  <Text style={styles.time}>Mañana, 10:00 AM</Text>
</View> 
  
    </View>
  );
};
const styles = StyleSheet.create({
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
  padding: 15,
},

cardTitle: {
  fontWeight: "bold",
  fontSize: 16,
  color: "#000",
},

icons: {
  flexDirection: "row",
  gap: 10,
},

editIcon: {
  fontSize: 16,
  color: "#555",
  marginRight: 10,
},

deleteIcon: {
  fontSize: 16,
  color: "red",
},

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

export default MyAppointmentsScreen; 
