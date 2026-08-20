// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMF5ECcRirNyJxaLPRk4-CH49xL4G9Z84",
  authDomain: "ecom-frontend-902b2.firebaseapp.com",
  projectId: "ecom-frontend-902b2",
  storageBucket: "ecom-frontend-902b2.firebasestorage.app",
  messagingSenderId: "390772071142",
  appId: "1:390772071142:web:7309a304236c501243b927",
  measurementId: "G-QRS25M3FMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);