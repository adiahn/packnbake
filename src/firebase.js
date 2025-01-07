import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAQA2AOmZi7B0Hr9Whz_uK9zt9_oG9v5Uw",
  authDomain: "packnbaketools.firebaseapp.com",
  projectId: "packnbaketools",
  storageBucket: "packnbaketools.firebasestorage.app",
  messagingSenderId: "571723889252",
  appId: "1:571723889252:web:a84133091da9af9672bd71",
  measurementId: "G-C4HH398FC6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }; 