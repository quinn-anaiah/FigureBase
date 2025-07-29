// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0GVzjaBPheiroOzD1WSuGDRh9qTUhNqs",
  authDomain: "funko-base.firebaseapp.com",
  projectId: "funko-base",
  storageBucket: "funko-base.firebasestorage.app",
  messagingSenderId: "519754714621",
  appId: "1:519754714621:web:44ba53cab4a3fc14275d94",
  measurementId: "G-ZM9L1WS1Y6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export  {db, storage};