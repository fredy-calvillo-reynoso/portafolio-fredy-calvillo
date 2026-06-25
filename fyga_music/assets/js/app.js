// assets/js/app.js — FYGA lógica principal
import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, doc, getDoc, getDocs, addDoc, deleteDoc,
  updateDoc, query, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { obtenerCanciones } from '../../api/deezer.js';

// ── Estado global ──────────────────────────────────────────
let currentUser = null;
let currentSong = null;

// ── Auth listener ──────────────────────────────────────────
onAuthStateChanged(auth, user => {
  currentUser = user;
  renderHeader(user);
});

// ── Render header (foto / nombre / botones) ────────────────
function renderHeader(user) {
  const actionsEl = document.getElementById('headerActions');
  if (!actionsEl) return;

  if (user) {
    actionsEl.innerHTML = `
      ${user.photoURL ? `<img src="${user.photoURL}" class="header__user-photo" alt="foto" referrerpolicy="no-referrer" onerror="this.style.display='none'">` : ''}
      <span class="header__user-name">${user.displayName || user.email}</span>
      <button class="btn btn-outline" id="btnPlaylists">
        <i class="bi bi-music-note-list"></i> Mis Playlists
      </button>
      <a href="users.html" class="btn btn-outline" id="btnAdmin" style="display:none">
        <i class="bi bi-speedometer2"></i> Panel
      </a>
      <button class="btn btn-outline" id="btnLogout">
        <i class="bi bi-box-arrow-right"></i> Salir
      </button>`;

    document.getElementById('btnLogout').addEventListener('click', () => {
      auth.signOut().then(() => location.href = 'login.html');
    });
    document.getElementById('btnPlaylists').addEventListener('click', showMyPlaylists);

    // Verificar admin en Firestore
    checkAdmin(user.uid);
  } else {
    actionsEl.innerHTML = `
      <a href="login.html" class="btn btn-accent">
        <i class="bi bi-person-circle"></i> Iniciar sesión
      </a>`;
  }
}

async function checkAdmin(uid) {
  try {
    const snap = await getDocs(query(collection(db,'usuarios'), where('uid','==',uid), where('isAdmin','==',true)));
    if (!snap.empty) {
      const btn = document.getElementById('btnAdmin');
      if (btn) btn.style.display = 'inline-flex';
    }
  } catch {}
}

// ── Guard: exige login ─────────────────────────────────────
function requireLogin(fn) {
  return function(...args) {
    if (!currentUser) { showLoginPopup(); return; }
    return fn.apply(this, args);
  };
}

// ── Cargar canciones ───────────────────────────────────────
async function loadSongs(query = null) {
  const grid = document.getElementById('songsGrid');
  const title = document.getElementById('sectionTitle');
  if (!grid) return;

  grid.innerHTML = `<p style="color:var(--text-secondary);grid-column:1/-1;text-align:center;padding:3rem">
    <i class="bi bi-arrow-repeat" style="font-size:2rem"></i><br>Cargando...</p>`;

  const { titulo, data } = await obtenerCanciones(query);
  if (title) title.innerHTML = titulo;

  if (!data.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <i class="bi bi-music-note-beamed"></i>
      <p>No se encontraron canciones</p></div>`;
    return;
  }

  grid.innerHTML = data.slice(0, 30).map((song, index) => {
    const id      = song.id;
    const titulo2 = escHtml(song.title);
    const artista = escHtml(song.artist.name);
    const album   = escHtml(song.album.title);
    const dur     = fmtDur(song.duration);
    const img     = song.album.cover_medium;
    const preview = song.preview;

    // índices 0-3 → above the fold: prioridad alta, sin lazy (candidatas al LCP)
    // índices 4+  → below the fold: carga diferida para no saturar la red inicial
    const imgAttrs = index < 4
      ? `fetchpriority="high"`
      : `loading="lazy"`;

    return `
      <article class="song-card">
        <div class="song-card__img-box">
          <img src="${img}" alt="Portada del álbum ${album}" ${imgAttrs}>
        </div>
        <div class="song-card__body">
          <div class="song-card__title">${titulo2}</div>
          <div class="song-card__artist">${artista}</div>
          <div class="song-card__meta">${album} · ${dur}</div>
        </div>
        <div class="song-card__controls">
          <button class="play-btn"
            aria-label="Reproducir ${titulo2} de ${artista}"
            data-titulo="${titulo2}" data-artista="${artista}" data-src="${preview}">
            <i class="bi bi-play-fill" aria-hidden="true"></i>
          </button>
          <button class="like-btn"
            aria-label="Añadir ${titulo2} a una playlist"
            data-id="${id}" data-titulo="${titulo2}" data-artista="${artista}"
            data-imagen="${img}" data-preview="${preview}">
            <i class="bi bi-heart" aria-hidden="true"></i>
          </button>
        </div>
      </article>`;
  }).join('');

  // Eventos play
  grid.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', requireLogin(() => {
      playSong(btn.dataset.src, btn.dataset.titulo, btn.dataset.artista);
    }));
  });

  // Eventos like → abrir modal playlist
  grid.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', requireLogin(() => {
      currentSong = {
        id:      btn.dataset.id,
        titulo:  btn.dataset.titulo,
        artista: btn.dataset.artista,
        imagen:  btn.dataset.imagen,
        preview: btn.dataset.preview
      };
      openPlaylistModal();
    }));
  });
}

// ── Reproductor ────────────────────────────────────────────
function playSong(src, titulo, artista) {
  const audio   = document.getElementById('audioPlayer');
  const player  = document.getElementById('reproductor');
  const titleEl = document.getElementById('currentSongTitle');
  const artistEl= document.getElementById('currentSongArtist');
  if (!audio || !player) return;

  titleEl.textContent  = titulo;
  artistEl.textContent = artista;
  player.classList.remove('d-none');
  audio.src = src;
  audio.play().catch(console.error);
}
window.playSong = playSong;

// ── Modal Playlist ─────────────────────────────────────────
async function openPlaylistModal() {
  const modal = document.getElementById('playlistModal');
  if (!modal) return;
  modal.classList.remove('d-none');
  await loadPlaylistOptions();
}
window.openPlaylistModal = openPlaylistModal;

window.closePlaylistModal = function() {
  const modal = document.getElementById('playlistModal');
  if (modal) modal.classList.add('d-none');
  currentSong = null;
};

async function loadPlaylistOptions() {
  const container = document.getElementById('existingPlaylists');
  if (!container || !currentUser) return;

  container.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:1rem">Cargando...</p>`;

  const q    = query(collection(db,'playlists'), where('uid','==',currentUser.uid));
  const snap = await getDocs(q);

  if (snap.empty) {
    container.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:1.5rem">No tienes playlists aún.</p>`;
    return;
  }

  container.innerHTML = snap.docs.map(docSnap => {
    const p = docSnap.data();
    return `<div class="playlist-item" onclick="addToPlaylist('${docSnap.id}','${escHtml(p.nombre)}')">
      <div>
        <div class="playlist-item__name">${escHtml(p.nombre)}</div>
        <div class="playlist-item__count">${p.canciones?.length ?? 0} canciones</div>
      </div>
      <i class="bi bi-plus-circle"></i>
    </div>`;
  }).join('');
}

window.addToPlaylist = async function(playlistId, nombre) {
  if (!currentSong || !currentUser) return;
  try {
    const ref  = doc(db,'playlists', playlistId);
    const snap = await getDocs(query(
      collection(db,'playlist_canciones'),
      where('playlistId','==',playlistId),
      where('songId','==',currentSong.id)
    ));
    if (!snap.empty) { alert('Esta canción ya está en la playlist'); return; }

    await addDoc(collection(db,'playlist_canciones'), {
      playlistId,
      uid:      currentUser.uid,
      songId:   currentSong.id,
      titulo:   currentSong.titulo,
      artista:  currentSong.artista,
      imagen:   currentSong.imagen,
      preview:  currentSong.preview,
      createdAt: serverTimestamp()
    });

    // Si la playlist no tiene portada todavía, usa la imagen de esta canción
    const plistSnap = await getDoc(ref);
    const plistData = plistSnap.data();
    if (!plistData?.imagen || plistData.imagen.includes('via.placeholder.com')) {
      await updateDoc(ref, { imagen: currentSong.imagen });
    }

    alert(`¡Agregada a "${nombre}"!`);
    window.closePlaylistModal();
  } catch(e) { console.error(e); alert('Error al agregar la canción'); }
};

window.createNewPlaylist = async function() {
  if (!currentUser) return showLoginPopup();
  const nameInput = document.getElementById('playlistName');
  const nombre    = nameInput?.value.trim();
  if (!nombre) { alert('Escribe un nombre para la playlist'); return; }

  // La portada se toma de la primera canción agregada (si hay una)
  let imagen = currentSong?.imagen || 'https://via.placeholder.com/300x200/181818/1DB954?text=FYGA';

  try {
    const docRef = await addDoc(collection(db,'playlists'), {
      uid:       currentUser.uid,
      nombre,
      imagen,
      canciones: [],
      createdAt: serverTimestamp()
    });

    // Agregar canción actual si hay una
    if (currentSong) {
      await addDoc(collection(db,'playlist_canciones'), {
        playlistId: docRef.id,
        uid:        currentUser.uid,
        songId:     currentSong.id,
        titulo:     currentSong.titulo,
        artista:    currentSong.artista,
        imagen:     currentSong.imagen,
        preview:    currentSong.preview,
        createdAt:  serverTimestamp()
      });
    }

    nameInput.value = '';
    alert(`Playlist "${nombre}" creada!`);
    window.closePlaylistModal();
  } catch(e) { console.error(e); alert('Error al crear la playlist'); }
};

// ── Mis Playlists ──────────────────────────────────────────
async function showMyPlaylists() {
  if (!currentUser) { showLoginPopup(); return; }
  const view = document.getElementById('playlistsView');
  const grid = document.getElementById('songsSection');
  if (view) view.classList.remove('d-none');
  if (grid) grid.classList.add('d-none');
  await renderPlaylists();
}
window.showMyPlaylists = showMyPlaylists;

window.hideMyPlaylists = function() {
  document.getElementById('playlistsView')?.classList.add('d-none');
  document.getElementById('songsSection')?.classList.remove('d-none');
};

async function renderPlaylists() {
  const c = document.getElementById('playlistsContainer');
  if (!c || !currentUser) return;

  c.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:3rem">Cargando...</p>`;

  const q    = query(collection(db,'playlists'), where('uid','==',currentUser.uid));
  const snap = await getDocs(q);

  if (snap.empty) {
    c.innerHTML = `<div class="empty-state"><i class="bi bi-music-note-beamed"></i><p>No tienes playlists aún.<br>¡Dale like a una canción!</p></div>`;
    return;
  }

  const cards = await Promise.all(snap.docs.map(async docSnap => {
    const p   = docSnap.data();
    const pid = docSnap.id;

    const songsSnap = await getDocs(
      query(collection(db,'playlist_canciones'), where('playlistId','==',pid))
    );

    const songsHtml = songsSnap.empty
      ? `<div class="empty-state" style="padding:1.5rem"><i class="bi bi-emoji-frown"></i><p>Vacía</p></div>`
      : songsSnap.docs.map((s,si) => {
          const song = s.data();
          return `
          <div class="playlist-song">
            <img src="${escHtml(song.imagen)}" class="playlist-song__img" alt="${escHtml(song.titulo)}">
            <div class="playlist-song__info">
              <div class="playlist-song__title">${escHtml(song.titulo)}</div>
              <div class="playlist-song__artist">${escHtml(song.artista)}</div>
            </div>
            <div class="playlist-song__actions">
              <button class="icon-btn" title="Reproducir"
                onclick="playSong('${escHtml(song.preview)}','${escHtml(song.titulo)}','${escHtml(song.artista)}')">
                <i class="bi bi-play-fill"></i>
              </button>
              <button class="icon-btn danger" title="Eliminar"
                onclick="removeSong('${s.id}','${pid}')">
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </div>`;
        }).join('');

    return `
      <div class="playlist-card">
        <div class="playlist-card__header">
          <div>
            <div class="playlist-card__title">${escHtml(p.nombre)}</div>
            <div class="playlist-card__count"><i class="bi bi-music-note"></i> ${songsSnap.size} canciones</div>
          </div>
          <button class="icon-btn danger" title="Eliminar playlist" onclick="deletePlaylist('${pid}')">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </div>
        <div class="playlist-songs-list">${songsHtml}</div>
      </div>`;
  }));

  c.innerHTML = `<div class="playlists-grid">${cards.join('')}</div>`;
}

window.removeSong = async function(songDocId, playlistId) {
  if (!confirm('¿Eliminar esta canción de la playlist?')) return;
  await deleteDoc(doc(db,'playlist_canciones', songDocId));
  renderPlaylists();
};

window.deletePlaylist = async function(pid) {
  if (!confirm('¿Eliminar esta playlist?')) return;
  // Borrar canciones de la playlist
  const snap = await getDocs(query(collection(db,'playlist_canciones'), where('playlistId','==',pid)));
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
  await deleteDoc(doc(db,'playlists', pid));
  renderPlaylists();
};

// ── Tabs del modal ─────────────────────────────────────────
window.showExistingPlaylists = function() {
  document.getElementById('existingPlaylists')?.classList.remove('d-none');
  document.getElementById('newPlaylistForm')?.classList.add('d-none');
  document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', i===0));
};
window.showNewPlaylistForm = function() {
  document.getElementById('existingPlaylists')?.classList.add('d-none');
  document.getElementById('newPlaylistForm')?.classList.remove('d-none');
  document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', i===1));
};

// ── Login popup ────────────────────────────────────────────
window.showLoginPopup = function() {
  const p = document.getElementById('loginPopup');
  if (p) { p.classList.remove('d-none'); p.classList.add('show'); }
};
window.closeLoginPopup = function() {
  const p = document.getElementById('loginPopup');
  if (p) { p.classList.remove('show'); setTimeout(()=>p.classList.add('d-none'),300); }
};

// ── Búsqueda ───────────────────────────────────────────────
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!currentUser) { showLoginPopup(); return; }
    const q = document.getElementById('searchInput')?.value.trim();
    loadSongs(q || null);
  });
}

// ── Helpers ────────────────────────────────────────────────
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
function fmtDur(sec) {
  const m = Math.floor(sec/60), s = sec%60;
  return `${m}:${String(s).padStart(2,'0')}`;
}

// ── Init ───────────────────────────────────────────────────
loadSongs();