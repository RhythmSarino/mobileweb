// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "fir-lab6-11bd7.firebaseapp.com",
  projectId: "fir-lab6-11bd7",
  storageBucket: "fir-lab6-11bd7.firebasestorage.app",
  messagingSenderId: "500978961177",
  appId: "1:500978961177:web:e6010dff2d733497489388",
  measurementId: "G-611YWRMMT9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);