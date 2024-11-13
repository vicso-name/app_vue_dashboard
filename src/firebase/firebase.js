import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCPxfa3awSnGsbQp5GTA8EGMf_G4GjyPVw",
    authDomain: "learnhebrew-413810.firebaseapp.com",
    databaseURL: "https://learnhebrew-413810-default-rtdb.firebaseio.com",
    projectId: "learnhebrew-413810",
    storageBucket: "learnhebrew-413810.appspot.com",
    messagingSenderId: "97059227127",
    appId: "1:97059227127:web:706c2f36ab77d48decdaf2",
    measurementId: "G-2TFK0Y3W2W"
};

// Check if the default app has already been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore database
const db = getFirestore(app);

export { db };

