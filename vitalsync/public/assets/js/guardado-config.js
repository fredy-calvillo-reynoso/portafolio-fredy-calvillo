import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmmhy0dcUUxNP82seQb2mm7vfsDiY6hPE",
  authDomain: "vital-sync-d6b45.firebaseapp.com",
  projectId: "vital-sync-d6b45",
  storageBucket: "vital-sync-d6b45.firebasestorage.app",
  messagingSenderId: "172673208440",
  appId: "1:172673208440:web:7d337a9bbbd7799be35d8d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// IMPORTANTE: persistencia de sesión por pestaña/navegador.
// Esto evita que, en un dispositivo compartido, la sesión de un
// paciente quede "activa" y otro paciente entre sin querer a la
// cuenta anterior. La sesión se cierra automáticamente al cerrar
// la pestaña o el navegador.
const authReady = setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("No se pudo configurar la persistencia de sesión:", error);
});

export {
  db,
  auth,
  authReady,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};