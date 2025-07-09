// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

if (typeof navigator === 'undefined') {
    global.navigator = {
        userAgent: 'lynx-app/1.0.0'
    };
}

// Mock window object if needed
if (typeof window === 'undefined') {
    global.window = {
        navigator: {
            userAgent: 'lynx-app/1.0.0'
        }
    };
}

// Your web app's Firebase configuration
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
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export { app, auth, db }

