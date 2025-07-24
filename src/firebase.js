// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Dodaj Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTJhsIHOVQI57l2YN-tTsLaz1gsh4kdmw",
  authDomain: "snapsolve-1190b.firebaseapp.com",
  projectId: "snapsolve-1190b",
  storageBucket: "snapsolve-1190b.firebasestorage.app",
  messagingSenderId: "352763766287",
  appId: "1:352763766287:web:3846e55c0d19b175cc657a",
  measurementId: "G-K7R0VCNMFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app); // Eksportuj Firestore