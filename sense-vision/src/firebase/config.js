// src/firebase/config.js
// Configuracion de Firebase para SENSE VISION
//
// Las credenciales se leen desde variables de entorno definidas en un archivo .env
// (nunca subas el .env a GitHub). Copia .env.example como .env y rellena tus valores.
//
// CARGA DIFERIDA (Lazy Loading):
// Firebase no se inicializa al importar este modulo. Los SDKs de auth y firestore
// se cargan mediante import() dinamico solo cuando alguna pantalla los necesita
// (login, pedidos, perfil de usuario o panel de administrador).

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let appPromise = null;
let authPromise = null;
let dbPromise = null;

function getFirebaseApp() {
  if (!appPromise) {
    appPromise = import("firebase/app").then(({ initializeApp, getApps, getApp }) =>
      getApps().length ? getApp() : initializeApp(firebaseConfig)
    );
  }
  return appPromise;
}

export function getFirebaseAuth() {
  if (!authPromise) {
    authPromise = Promise.all([import("firebase/auth"), getFirebaseApp()]).then(
      ([{ getAuth }, app]) => getAuth(app)
    );
  }
  return authPromise;
}

export function getFirebaseDb() {
  if (!dbPromise) {
    dbPromise = Promise.all([import("firebase/firestore"), getFirebaseApp()]).then(
      ([{ getFirestore }, app]) => getFirestore(app)
    );
  }
  return dbPromise;
}

export async function getGoogleProvider() {
  const { GoogleAuthProvider } = await import("firebase/auth");
  return new GoogleAuthProvider();
}
