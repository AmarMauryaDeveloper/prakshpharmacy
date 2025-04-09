import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBKOm9sk-gM800uai5yRgOLa7QqQDs1BiQ",
  authDomain: "amoksh-5c507.firebaseapp.com",
  databaseURL: "https://amoksh-5c507-default-rtdb.firebaseio.com",
  projectId: "amoksh-5c507",
  storageBucket: "amoksh-5c507.appspot.com",
  messagingSenderId: "497676175604",
  appId: "1:497676175604:web:42b9a6b164da0aefd4b6a1",
  measurementId: "G-8CCFZFYTNP",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export {
  auth,
  db,
  storage,
  collection,
  getDoc,
  onSnapshot,
  where,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
};
