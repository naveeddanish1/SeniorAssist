import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMRJdsCVtbW8YK4LD0442vGFtpQwVrlHQ",
  authDomain: "seniorassist-749cb.firebaseapp.com",
  projectId: "seniorassist-749cb",
  storageBucket: "seniorassist-749cb.firebasestorage.app",
  messagingSenderId: "327171911716",
  appId: "1:327171911716:web:f83a9688f4a47a8f8ce8b1",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

