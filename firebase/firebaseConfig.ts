import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkykYB7CdbXxsYj6ETdXqNQiFDFQhX0Mc",
  authDomain: "connected-e23fd.firebaseapp.com",
  projectId: "connected-e23fd",
  storageBucket: "connected-e23fd.firebasestorage.app",
  messagingSenderId: "795011560935",
  appId: "1:795011560935:web:220990e2e61bb3b79f3942",
  measurementId: "G-JQCEG6M36J"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { auth, db };



