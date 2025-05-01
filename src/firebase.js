// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1HGuzeRXVyPCGqPa24VD22ujrexk3Faw",
  authDomain: "finance-tracking-13b6d.firebaseapp.com",
  projectId: "finance-tracking-13b6d",
  storageBucket: "finance-tracking-13b6d.appspot.com", // Fixed storageBucket
  messagingSenderId: "1038912056760",
  appId: "1:1038912056760:web:cca0f7ebb9f33c32e8734d",
  measurementId: "G-9FD5TLV7DV",
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export initialized Firebase services
export { db, auth, provider, doc, setDoc, analytics };
