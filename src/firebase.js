// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCU_rsvfBqEJmFXDI9ZjDM2AL_5UVh3OVw",
  authDomain: "creditsmart-524df.firebaseapp.com",
  projectId: "creditsmart-524df",
  storageBucket: "creditsmart-524df.firebasestorage.app",
  messagingSenderId: "135947453684",
  appId: "1:135947453684:web:127a02e972bec1d3bf8aa1",
  measurementId: "G-BSRPEQSV3Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);