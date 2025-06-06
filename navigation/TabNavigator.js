import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DashboardScreen from "../screens/DashboardScreen";
import ServicesScreen from "../screens/ServicesScreen";
import ProductsScreen from "../screens/ProductsScreen";
import MyAppointmentsScreen from "../screens/MyAppointmentsScreen";
import AccountScreen from "../screens/AccountScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Inicio") {
            iconName = focused ? "paw" : "paw-outline";
          } else if (route.name === "Servicios") {
            iconName = focused ? "cut" : "cut-outline";
          } else if (route.name === "Productos") {
            iconName = focused ? "bag-handle" : "bag-handle-outline";
          } else if (route.name === "Mis Citas") {
            iconName = focused ? "calendar-clear" : "calendar-clear-outline";
          } else if (route.name === "Cuenta") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007aff",
        tabBarInactiveTintColor: "#aeb6bf",
        tabBarStyle: {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 0),
        },
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen name="Servicios" component={ServicesScreen} />
      <Tab.Screen name="Productos" component={ProductsScreen} />
      <Tab.Screen name="Mis Citas" component={MyAppointmentsScreen} />
      <Tab.Screen name="Cuenta" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;