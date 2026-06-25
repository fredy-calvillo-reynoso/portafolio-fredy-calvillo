# Sense Vision

Sitio web e-commerce desarrollado con React, Vite y Firebase para la venta de un baston inteligente con tecnologia de asistencia para personas con discapacidad visual.

Desarrollado como proyecto de residencia profesional en el Instituto Tecnologico Superior de Huetamo, Michoacan.

Demo: https://sense-vision-a8451.web.app

## Tecnologias

- React 19 + Vite
- Firebase Auth (Google y correo/contrasena)
- Firestore (gestion de pedidos y usuarios)
- Firebase Hosting
- React Router v7
- CSS modular (sin frameworks externos)

## Funcionalidades principales

- Catalogo de productos con carrito de compras
- Sistema de autenticacion con dos proveedores (Google y correo/contrasena)
- Roles de usuario: cliente y administrador
- Panel de administracion para gestion de pedidos
- Pagina de soporte con FAQ, manuales y canales de contacto
- Pagina legal: aviso de privacidad y terminos de servicio
- Diseno responsivo adaptado a movil y escritorio
- Carga diferida de los SDK de Firebase (lazy loading) para mejor rendimiento

## Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/sense-vision.git
cd sense-vision

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de tu proyecto Firebase

# Iniciar en desarrollo
npm run dev

# Compilar para produccion
npm run build
```

## Variables de entorno

Copia `.env.example` como `.env` y rellena los valores con los datos de tu proyecto en Firebase Console (Configuracion del proyecto > General > SDK de Firebase).

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Estructura del proyecto

```
src/
├── components/
│   ├── Auth/          # Rutas protegidas por sesion y rol
│   ├── Layout/        # Navbar, Footer y estructura general
│   ├── Tienda/        # Tarjetas de producto, opciones y carrito
│   └── WhatsApp/      # Boton flotante de contacto
├── context/
│   ├── AuthContext.jsx  # Estado global de autenticacion y roles
│   └── CartContext.jsx  # Estado global del carrito
├── firebase/
│   └── config.js        # Inicializacion diferida de Firebase
├── pages/               # Vistas principales de la aplicacion
└── styles/
    └── variables.css    # Paleta de colores y variables globales
```

## Roles de usuario

Al iniciar sesion por primera vez se crea un documento en la coleccion `usuarios` con el rol `"user"`. Para asignar el rol `"admin"` edita manualmente el campo `rol` en Firestore o agrega el correo a la lista `ADMIN_EMAILS` en `src/context/AuthContext.jsx`.
