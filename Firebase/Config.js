// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbdu1PPNQIGII1Zhnm-gitSW-CpbnEj_Q",
  authDomain: "grabdealsdaily-64a2d.firebaseapp.com",
  projectId: "grabdealsdaily-64a2d",
  storageBucket: "grabdealsdaily-64a2d.appspot.com",
  messagingSenderId: "496220460249",
  appId: "1:496220460249:web:b9a387fa3ae1cb5c2adac8",
  measurementId: "G-XLBKZWC8ZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
