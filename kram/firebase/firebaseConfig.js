// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkykYB7CdbXxsYj6ETdXqNQiFDFQhX0Mc",
  authDomain: "connected-e23fd.firebaseapp.com",
  projectId: "connected-e23fd",
  storageBucket: "connected-e23fd.firebasestorage.app",
  messagingSenderId: "795011560935",
  appId: "1:795011560935:web:220990e2e61bb3b79f3942",
  measurementId: "G-JQCEG6M36J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { auth, db };




