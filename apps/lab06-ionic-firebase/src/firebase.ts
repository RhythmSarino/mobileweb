// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHRZgwmOJFvpPdJRka833HB0oh2YliN1I",
  authDomain: "lab06-ionic-firebase-1094a.firebaseapp.com",
  projectId: "lab06-ionic-firebase-1094a",
  storageBucket: "lab06-ionic-firebase-1094a.firebasestorage.app",
  messagingSenderId: "348495174124",
  appId: "1:348495174124:web:a4cf741978941ac8bfc8c9",
  measurementId: "G-L9ELJQ1LXT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);