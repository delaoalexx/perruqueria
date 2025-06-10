import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "./screens/auth/WelcomeScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import TabNavigator from "./navigation/TabNavigator";
import ScheduleScreen from "./screens/ScheduleScreen";
import AddPetScreen from "./screens/AddPetScreen";
import Toast from "react-native-toast-message";
import PetDetailsScreen from "./screens/PetDetailsScreen";
import MyAppointmentsScreen from "./screens/MyAppointmentsScreen";
import WalkScreen from './screens/WalkScreen';
import CleanScreen from './screens/CleanScreen';
import FoodScreen from "./screens/FoodScreen";
import ClothesScreen from "./screens/ClothesScreen";
import ToyScreen from "./screens/ToyScreen";
import BddScreen from "./screens/BddScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScheduleAppointment"
          component={ScheduleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddPet"
          component={AddPetScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PetDetails"
          component={PetDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyAppointments"
          component={MyAppointmentsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScheduleScreen"
          component={ScheduleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WalkScreen"
          component={WalkScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CleanScreen"
          component={CleanScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FoodScreen"
          component={FoodScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ClothesScreen"
          component={ClothesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ToyScreen"
          component={ToyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BddScreen"
          component={BddScreen}
          options={{ headerShown: false }}
        />
        
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
