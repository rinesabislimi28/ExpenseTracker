import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase Configuration Object
 * Values are pulled from environment variables defined in your .env file.
 * We use 'process.env.EXPO_PUBLIC_' to ensure compatibility with Expo.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

/**
 * Initialize Firebase Application
 */
const app = initializeApp(firebaseConfig);

/**
 * Initialize Cloud Firestore Database
 * This 'db' instance will be used across the app to perform CRUD operations.
 */
export const db = getFirestore(app);

/**
 * Configuration Debugging
 * Checks if the API Key is loaded correctly. 
 * If it logs a warning, verify your .env file naming and location.
 */
if (!firebaseConfig.apiKey) {
  console.warn("Firebase configuration keys are missing. Check your .env file!");
}