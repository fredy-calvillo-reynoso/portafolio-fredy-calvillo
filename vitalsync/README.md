# VitalSync

VitalSync es una aplicación web orientada a la gestión de información médica de pacientes. Permite registrar los datos clínicos y de contacto de un paciente, ubicarlo en un mapa y visualizar un panel de monitoreo de signos vitales preparado para conectarse a un dispositivo wearable (reloj inteligente).

## Demo en vivo

🔗 [https://vital-sync-d6b45.web.app](https://vital-sync-d6b45.web.app)

## Capturas de pantalla

### Vista de escritorio

| Inicio | Iniciar sesión | Registro de paciente |
|---|---|---|
| ![inicio](docs/screenshots/pc-01-inicio.jpeg) | ![login](docs/screenshots/pc-02-login.jpeg) | ![registro](docs/screenshots/pc-03-registro-1.jpeg) |

| Datos médicos | Antecedentes | Monitoreo |
|---|---|---|
| ![registro2](docs/screenshots/pc-04-registro-2.jpeg) | ![registro3](docs/screenshots/pc-05-registro-3.jpeg) | ![monitoreo1](docs/screenshots/pc-06-monitoreo-1.jpeg) |

| Datos del paciente | Signos vitales | Ubicación |
|---|---|---|
| ![monitoreo2](docs/screenshots/pc-07-monitoreo-2.jpeg) | ![monitoreo3](docs/screenshots/pc-08-monitoreo-3.jpeg) | ![mapa](docs/screenshots/pc-09-monitoreo-mapa.jpeg) |

### Vista móvil (iPhone)

| Inicio | Iniciar sesión | Registro |
|---|---|---|
| <img src="docs/screenshots/iphone-01-inicio.jpeg" width="200"> | <img src="docs/screenshots/iphone-02-login.jpeg" width="200"> | <img src="docs/screenshots/iphone-03-registro-1.jpeg" width="200"> |

| Ubicación | Datos médicos | Registro completo |
|---|---|---|
| <img src="docs/screenshots/iphone-04-registro-ubicacion.jpeg" width="200"> | <img src="docs/screenshots/iphone-05-registro-medico.jpeg" width="200"> | <img src="docs/screenshots/iphone-08-registro-completo.jpeg" width="200"> |

| Monitoreo - datos del paciente | Signos vitales | Ubicación en el mapa |
|---|---|---|
| <img src="docs/screenshots/iphone-09-monitoreo-datos-1.jpeg" width="200"> | <img src="docs/screenshots/iphone-12-monitoreo-signos.jpeg" width="200"> | <img src="docs/screenshots/iphone-13-monitoreo-mapa.jpeg" width="200"> |

## Características

- **Autenticación de usuarios** con Firebase Authentication (correo y contraseña), una cuenta por paciente.
- **Registro de pacientes**: formulario validado con datos personales, de contacto, médicos y de emergencia.
- **Persistencia en la nube** con Cloud Firestore, protegida con reglas de seguridad que garantizan que cada usuario solo pueda leer y escribir su propio expediente.
- **Geolocalización**: captura y muestra la ubicación del paciente en un mapa interactivo (Leaflet + OpenStreetMap).
- **Panel de monitoreo**: visualización de señal ECG, pletismografía, frecuencia cardiaca, temperatura y oxigenación, listo para integrarse con datos en tiempo real de un dispositivo wearable.
- **Sesión segura**: la sesión se cierra automáticamente al cerrar el navegador, evitando que distintos pacientes compartan una sesión activa en un mismo dispositivo.

## Tecnologías

- HTML5, CSS3, Bootstrap 5
- JavaScript (ES Modules)
- Firebase Authentication
- Cloud Firestore
- Chart.js
- Leaflet.js
- Firebase Hosting

## Estructura del proyecto

```
public/
├── index.html                 # Página principal
├── login.html                  # Acceso al sistema
├── registro-paciente.html      # Formulario de registro de paciente
├── monitoreo.html               # Vista de monitoreo y datos del paciente
├── gracias.html                 # Confirmación de registro
└── assets/
    ├── css/
    │   ├── styles.css
    │   ├── registro.css
    │   └── monitoreo.css
    └── js/
        ├── guardado-config.js    # Configuración e inicialización de Firebase
        ├── auth.js               # Inicio/cierre de sesión
        ├── route-guard.js        # Protección de rutas privadas
        ├── login.js               # Lógica de la pantalla de acceso
        ├── registro-paciente.js   # Validación y envío del formulario
        ├── pacientes-service.js   # Lectura/escritura de pacientes en Firestore
        ├── ubicacion.js           # Geolocalización y mapa de registro
        └── monitoreo.js           # Gráficas y panel de monitoreo
```

## Modelo de datos (Firestore)

Cada paciente se almacena como un documento en la colección `pacientes`, usando como ID el `uid` de su cuenta de Firebase Authentication:

```
pacientes/{uid}
├── nombre, apellidos, edad, fechaNacimiento, genero
├── direccion, telefonoEmergencias, telefonoFamiliar
├── tipoSangre, enfermedades, alergias, medicamentos
├── latitud, longitud
└── fechaActualizacion
```

### Reglas de seguridad

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /pacientes/{userId} {
      allow read, write: if request.auth != null
                          && request.auth.uid == userId;
    }
  }
}
```

## Ejecución local

1. Clona el repositorio.
2. Instala el [Firebase CLI](https://firebase.google.com/docs/cli) si no lo tienes:
   ```bash
   npm install -g firebase-tools
   ```
3. Inicia sesión y emula el proyecto:
   ```bash
   firebase login
   firebase emulators:start
   ```
   o sirve la carpeta `public/` con cualquier servidor estático.

## Despliegue

```bash
firebase login
firebase deploy --only hosting
```

## Próximos pasos

- Integración con un reloj inteligente (wearable) para mostrar signos vitales en tiempo real.
- Historial de mediciones por paciente.
- Notificaciones ante valores fuera de rango.

---

Proyecto desarrollado por Fredy Calvillo Reynoso como parte de su portafolio de evidencias.
