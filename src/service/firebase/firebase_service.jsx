// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
 
const firebaseConfig = {
    apiKey: "AIzaSyCVIrAiB56GM9kTSLayZz8ZGumjigbi8hc",
    authDomain: "lynxchatwebapp.firebaseapp.com",
    projectId: "lynxchatwebapp",
    storageBucket: "lynxchatwebapp.firebasestorage.app",
    messagingSenderId: "91141756347",
    appId: "1:91141756347:web:4f0ea048af1412d702e09e",
    measurementId: "G-J50X2H1YM1"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

export { app, auth, db }

