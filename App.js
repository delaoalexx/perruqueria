import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


console.log("🔥 HOLAAA");

console.log("🔥 API KEY:", process.env.EXPO_PUBLIC_FIREBASE_API_KEY);


export default function App() {
  return (
    
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
