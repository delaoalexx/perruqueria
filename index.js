import { registerRootComponent } from 'expo';

import App from './App';

console.log("🔥🔥🔥 ENV VAR en index.js:", process.env.EXPO_PUBLIC_FIREBASE_API_KEY);

registerRootComponent(App);
