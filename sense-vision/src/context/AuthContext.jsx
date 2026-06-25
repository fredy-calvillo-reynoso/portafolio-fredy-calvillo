// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getFirebaseAuth, getFirebaseDb, getGoogleProvider } from "../firebase/config";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// Lista de correos que se asignan automáticamente como administradores.
// Agrega aquí los correos del equipo administrador.
const ADMIN_EMAILS = ["admin@sensevision.com"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "admin" | "user"
  const [loading, setLoading] = useState(true);

  // Promesa que resuelve cuando los módulos de Firebase (auth/firestore)
  // ya fueron cargados de forma diferida y están listos para usarse.
  const readyRef = useRef(null);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    readyRef.current = (async () => {
      // Carga diferida: firebase/auth y firebase/firestore solo se
      // descargan cuando el AuthProvider se monta (es decir, cuando la
      // app ya está interactiva), no como parte del bundle inicial.
      const [authMod, firestoreMod, auth, db] = await Promise.all([
        import("firebase/auth"),
        import("firebase/firestore"),
        getFirebaseAuth(),
        getFirebaseDb(),
      ]);

      if (!active) return { authMod, firestoreMod, auth, db };

      // Crea o lee el documento de perfil del usuario en Firestore
      async function ensureUserProfile(firebaseUser) {
        const { doc, getDoc, setDoc, serverTimestamp } = firestoreMod;
        const userRef = doc(db, "usuarios", firebaseUser.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
          const assignedRole = ADMIN_EMAILS.includes(firebaseUser.email)
            ? "admin"
            : "user";

          const profile = {
            uid: firebaseUser.uid,
            nombre: firebaseUser.displayName || "",
            correo: firebaseUser.email,
            rol: assignedRole,
            creadoEn: serverTimestamp(),
          };

          await setDoc(userRef, profile);
          return profile;
        }

        return snapshot.data();
      }

      unsubscribe = authMod.onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            const profile = await ensureUserProfile(firebaseUser);
            setRole(profile.rol || "user");
          } catch (error) {
            console.error("Error obteniendo el perfil del usuario:", error);
            setRole("user");
          }
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      });

      return { authMod, firestoreMod, auth, db, ensureUserProfile };
    })();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Registro con correo y contraseña
  async function register(nombre, email, password) {
    const { authMod, auth, ensureUserProfile } = await readyRef.current;
    const credentials = await authMod.createUserWithEmailAndPassword(auth, email, password);
    if (nombre) {
      await authMod.updateProfile(credentials.user, { displayName: nombre });
    }
    await ensureUserProfile({ ...credentials.user, displayName: nombre });
    return credentials.user;
  }

  // Inicio de sesión con correo y contraseña
  async function login(email, password) {
    const { authMod, auth } = await readyRef.current;
    return authMod.signInWithEmailAndPassword(auth, email, password);
  }

  // Inicio de sesión con Google
  async function loginWithGoogle() {
    const { authMod, auth } = await readyRef.current;
    const provider = await getGoogleProvider();
    return authMod.signInWithPopup(auth, provider);
  }

  // Cerrar sesión
  async function logout() {
    const { authMod, auth } = await readyRef.current;
    return authMod.signOut(auth);
  }

  const value = {
    user,
    role,
    isAdmin: role === "admin",
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}