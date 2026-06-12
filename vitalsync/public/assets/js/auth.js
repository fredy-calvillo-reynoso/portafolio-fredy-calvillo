import {
  auth,
  authReady,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "./guardado-config.js";

export { authReady };

export async function iniciarSesion(correo, password) {
  await authReady;
  const credencial = await signInWithEmailAndPassword(auth, correo, password);
  return credencial.user;
}

export async function crearCuenta(correo, password) {
  await authReady;
  const credencial = await createUserWithEmailAndPassword(auth, correo, password);
  return credencial.user;
}

export async function cerrarSesion() {
  await signOut(auth);
}

export function observarSesion(callback) {
  return onAuthStateChanged(auth, callback);
}