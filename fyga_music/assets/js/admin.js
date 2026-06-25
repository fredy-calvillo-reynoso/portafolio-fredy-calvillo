// assets/js/admin.js — FYGA panel admin
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, getDocs, doc, updateDoc, deleteDoc, query, where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Guard admin ────────────────────────────────────────────
onAuthStateChanged(auth, async user => {
  if (!user) { location.href = 'login.html'; return; }

  const ref  = doc(db,'usuarios', user.uid);
  const snap = await (await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js")).getDoc(ref);
  if (!snap.exists() || !snap.data().isAdmin) {
    location.href = 'index.html';
    return;
  }

  // Nombre del admin en header
  const nameEl = document.getElementById('adminName');
  if (nameEl) nameEl.textContent = user.displayName || user.email;
  const photoEl = document.getElementById('adminPhoto');
  if (photoEl && user.photoURL) { photoEl.src = user.photoURL; photoEl.style.display = 'block'; }

  // Logout
  document.getElementById('btnLogout')?.addEventListener('click', () => {
    auth.signOut().then(() => location.href = 'login.html');
  });

  loadUsers();
});

// ── Cargar usuarios ────────────────────────────────────────
async function loadUsers() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  const snap = await getDocs(collection(db,'usuarios'));
  tbody.innerHTML = snap.docs.map(d => {
    const u = d.data();
    return `
      <tr>
        <td>${d.id.slice(0,8)}…</td>
        <td>${esc(u.nombre)}</td>
        <td>${esc(u.correo)}</td>
        <td><span class="badge">${u.isAdmin ? 'Admin':'Usuario'}</span></td>
        <td>${u.createdAt?.toDate().toLocaleDateString('es-MX') ?? '—'}</td>
        <td>
          <button class="icon-btn" onclick="openEditModal('${d.id}','${esc(u.nombre)}','${esc(u.correo)}')" title="Editar">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="icon-btn danger" onclick="deleteUser('${d.id}','${esc(u.nombre)}')" title="Eliminar">
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      </tr>`;
  }).join('');
}

// ── Editar ─────────────────────────────────────────────────
window.openEditModal = function(uid, nombre, correo) {
  document.getElementById('editUid').value    = uid;
  document.getElementById('editNombre').value = nombre;
  document.getElementById('editCorreo').value = correo;
  document.getElementById('editModal').classList.remove('d-none');
};
window.closeEditModal = function() {
  document.getElementById('editModal').classList.add('d-none');
};

document.getElementById('editForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const uid    = document.getElementById('editUid').value;
  const nombre = document.getElementById('editNombre').value.trim();
  const correo = document.getElementById('editCorreo').value.trim();
  await updateDoc(doc(db,'usuarios', uid), { nombre, correo });
  window.closeEditModal();
  loadUsers();
});

// ── Eliminar ───────────────────────────────────────────────
window.deleteUser = async function(uid, nombre) {
  if (!confirm(`¿Eliminar al usuario "${nombre}"?`)) return;
  await deleteDoc(doc(db,'usuarios', uid));
  loadUsers();
};

function esc(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
