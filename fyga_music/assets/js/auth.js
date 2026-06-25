// assets/js/auth.js — FYGA autenticación
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Guardar usuario en Firestore ───────────────────────────
async function saveUser(user, extra = {}) {
  const ref  = doc(db, 'usuarios', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:       user.uid,
      nombre:    user.displayName ?? extra.nombre ?? 'Usuario',
      correo:    user.email,
      foto:      user.photoURL ?? null,
      isAdmin:   false,
      createdAt: serverTimestamp(),
      ...extra
    });
  }
}

// ── Mostrar error ──────────────────────────────────────────
function showError(msg) {
  let box = document.getElementById('authError');
  if (!box) return;
  box.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${msg}`;
  box.style.display = 'flex';
}
function hideError() {
  const box = document.getElementById('authError');
  if (box) box.style.display = 'none';
}

// ── REGISTRO ───────────────────────────────────────────────
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    hideError();
    const nombre    = document.getElementById('nombre').value.trim();
    const correo    = document.getElementById('correo').value.trim();
    const contrasena= document.getElementById('contrasena').value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, correo, contrasena);
      await updateProfile(cred.user, { displayName: nombre });
      await saveUser(cred.user, { nombre });
      location.href = 'index.html';
    } catch(err) {
      const msgs = {
        'auth/email-already-in-use':   'Ese correo ya está registrado.',
        'auth/weak-password':           'La contraseña debe tener al menos 6 caracteres.',
        'auth/invalid-email':           'Correo inválido.'
      };
      showError(msgs[err.code] ?? 'Error al registrar. Intenta de nuevo.');
    }
  });
}

// ── LOGIN ──────────────────────────────────────────────────
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    hideError();
    const correo    = document.getElementById('correo').value.trim();
    const contrasena= document.getElementById('contrasena').value;

    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
      location.href = 'index.html';
    } catch(err) {
      const msgs = {
        'auth/user-not-found':         'No existe una cuenta con ese correo.',
        'auth/wrong-password':         'Contraseña incorrecta.',
        'auth/invalid-credential':     'Correo o contraseña incorrectos.',
        'auth/too-many-requests':      'Demasiados intentos. Espera un momento.'
      };
      showError(msgs[err.code] ?? 'Error al iniciar sesión.');
    }
  });
}

// ── GOOGLE ─────────────────────────────────────────────────
const btnGoogle = document.getElementById('btnGoogle');
if (btnGoogle) {
  btnGoogle.addEventListener('click', async () => {
    hideError();
    const provider = new GoogleAuthProvider();
    try {
      const cred = await signInWithPopup(auth, provider);
      await saveUser(cred.user);
      location.href = 'index.html';
    } catch(err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        showError('Error con Google. Intenta de nuevo.');
      }
    }
  });
}
