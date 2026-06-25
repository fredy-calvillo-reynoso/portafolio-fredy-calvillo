# Fyga Music

Aplicación web de música construida con HTML, CSS y JavaScript vanilla, que consume la API de Deezer a través de un proxy en Vercel. Permite buscar canciones, reproducir previews y organizar tu música en playlists personalizadas con autenticación de Firebase.

**Demo en vivo:** [fyga-e313e.web.app](https://fyga-e313e.web.app)

---

## Características

- **Búsqueda de canciones y artistas** en tiempo real vía Deezer API
- **Reproducción de previews** de 30 segundos directamente en el navegador
- **Playlists personalizadas** — crea, nombra y administra tus listas
- **Autenticación** con Google y correo/contraseña (Firebase Auth)
- **Diseño responsivo** — funciona en escritorio y móvil
- **Sin frameworks** — Vanilla JS puro, carga rápida

---

## Capturas de pantalla

### Pantalla principal

| PC | Móvil |
|:--:|:-----:|
| ![Principal sin sesión PC](Docs/principal-sin-iniciar-sesi%C3%B3n-pc.jpeg) | ![Principal sin sesión Móvil](Docs/principal-sin-iniciar-sesion-movil.jpeg) |

### Autenticación

| Inicio de sesión PC | Inicio de sesión Móvil |
|:-------------------:|:----------------------:|
| ![Login PC](Docs/login-pc.png) | ![Login Móvil](Docs/login-movil.jpeg) |

| Crear cuenta PC | Crear cuenta Móvil |
|:---------------:|:-----------------:|
| ![Crear cuenta PC](Docs/crear-cuenta-pc.png) | ![Crear cuenta Móvil](Docs/crear-cuenta-movil.jpeg) |

| Sesión iniciada con Google PC | Sesión iniciada Móvil |
|:-----------------------------:|:---------------------:|
| ![Sesión Google PC](Docs/sesion-iniciada-google-pc.png) | ![Sesión Móvil](Docs/sesion-iniciada-movil.jpeg) |

### Búsqueda

| Búsqueda PC | Búsqueda Móvil |
|:-----------:|:--------------:|
| ![Búsqueda PC](Docs/busqueda%20de%20artista-pc.png) | ![Búsqueda Móvil](Docs/busqueda-de-artista-movil.jpeg) |

### Playlists

| Playlists vacías PC | Playlists vacías Móvil |
|:-------------------:|:----------------------:|
| ![Playlists vacías PC](Docs/playlists-vacias-pc.png) | ![Playlists vacías Móvil](Docs/playlist-vacias-movil.jpeg) |

| Crear playlist PC | Crear playlist Móvil |
|:-----------------:|:--------------------:|
| ![Crear playlist PC](Docs/creaci%C3%B3n-de-playlist-pc.png) | ![Crear playlist Móvil](Docs/creaci%C3%B3n-de-playlist-movil.jpeg) |

| Notificación playlist creada PC | Notificación playlist creada Móvil |
|:-------------------------------:|:----------------------------------:|
| ![Notif playlist PC](Docs/notificaci%C3%B3n-de-confirmaci%C3%B3n-de-playlist-creada-pc.png) | ![Notif playlist Móvil](Docs/notificaci%C3%B3n-de-creaci%C3%B3n-de-playlist-creada-movil.jpeg) |

| 2 Playlists creadas PC | |
|:----------------------:|:-:|
| ![2 playlists PC](Docs/muestra-2-playlists-creadas-pc.png) | |

### Agregar canciones a playlists

| Agregar canción PC | Agregar canción Móvil |
|:------------------:|:---------------------:|
| ![Agregar canción PC](Docs/confirmaci%C3%B3n-de-canci%C3%B3n-gregada-pc.png) | ![Agregar canción Móvil](Docs/confirmaci%C3%B3n-de-canci%C3%B3n-gregada-movil.jpeg) |

| Canciones agregadas PC | Canciones agregadas Móvil |
|:----------------------:|:-------------------------:|
| ![Canciones en playlist PC](Docs/muestra-canciones-agregadas-pc.png) | ![Canciones en playlist Móvil](Docs/muestra-canciones-agregadas-movil.jpeg) |

| Canción agregada Móvil |
|:----------------------:|
| ![Se agregó canción Móvil](Docs/se-agrego-cancion-a-playlist-movil.jpeg) |

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript (ES Modules) |
| Autenticación | Firebase Auth (Google + Email/Password) |
| Base de datos | Cloud Firestore |
| API de música | Deezer API (via proxy Vercel) |
| Hosting | Firebase Hosting |
| Proxy | Vercel Serverless Functions |

---

## Instalación local

### Prerrequisitos

- Cuenta en [Firebase](https://firebase.google.com)
- Cuenta en [Vercel](https://vercel.com) (para el proxy de Deezer)
- Navegador moderno con soporte para ES Modules

### Pasos

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/fyga-music.git
   cd fyga-music
   ```

2. **Configura Firebase**

   Renombra el archivo de ejemplo y coloca tus credenciales:
   ```bash
   cp assets/js/firebase-config.example.js assets/js/firebase-config.js
   ```
   Luego edita `assets/js/firebase-config.js` con los datos de tu proyecto Firebase (los encuentras en **Configuración del proyecto → Tus apps** en la consola de Firebase).

3. **Configura el proxy de Deezer**

   El archivo `api/deezer.js` apunta a un proxy en Vercel para evitar problemas de CORS con la API de Deezer. Despliega tu propio proxy o actualiza la constante `PROXY` con tu URL:
   ```js
   const PROXY = 'https://tu-proxy.vercel.app/api/deezer';
   ```

4. **Sirve el proyecto localmente**

   Como usa ES Modules, necesitas un servidor HTTP (no abrir el HTML directamente):
   ```bash
   npx serve .
   # o con Python
   python -m http.server 8080
   ```

5. **Abre** `http://localhost:8080` en tu navegador.

---

## Estructura del proyecto

```
fyga_music/
├── index.html                  # Página principal
├── login.html                  # Inicio de sesión
├── register.html               # Registro de cuenta
├── users.html                  # Panel de usuario
├── firebase.json               # Configuración Firebase Hosting
├── api/
│   └── deezer.js               # Cliente del proxy de Deezer
├── assets/
│   ├── css/
│   │   └── styles.css          # Estilos globales
│   └── js/
│       ├── app.js              # Lógica principal
│       ├── auth.js             # Manejo de autenticación
│       ├── admin.js            # Funciones de administración
│       └── firebase-config.example.js  # Plantilla de configuración
└── Docs/                       # Capturas de pantalla
```

---

## Seguridad

- El archivo `assets/js/firebase-config.js` con tus credenciales reales está en `.gitignore` — **nunca lo subas a un repositorio público**.
- Usa las [reglas de seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started) para proteger tu base de datos.
- Configura los dominios autorizados en Firebase Auth → **Configuración → Dominios autorizados**.

---

## Licencia

MIT — libre para uso personal y educativo.
