// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
  appId: "1:795011560935:web:3a1e5ef25ede9a2b9f3942",
  measurementId: "G-QRRCJG5CJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
