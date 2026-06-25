// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircleIcon, ArrowLeftIcon, LockIcon } from "../components/Icons";
import "./Login.css";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_NOMBRE = /^[a-zA-ZÀ-ÿ\s]+$/;

function validarRegistro({ nombre, email, password, confirmarPassword }) {
  const errores = {};

  if (!nombre.trim()) {
    errores.nombre = "El nombre completo es obligatorio.";
  } else if (nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 caracteres.";
  } else if (!REGEX_NOMBRE.test(nombre.trim())) {
    errores.nombre = "El nombre solo puede contener letras y espacios.";
  }

  if (!email.trim()) {
    errores.email = "El correo electrónico es obligatorio.";
  } else if (!REGEX_EMAIL.test(email.trim())) {
    errores.email = "Ingresa un correo electrónico válido (ejemplo: usuario@correo.com).";
  }

  if (!password) {
    errores.password = "La contraseña es obligatoria.";
  } else if (password.length < 8) {
    errores.password = "La contraseña debe tener al menos 8 caracteres.";
  } else if (!/[A-Z]/.test(password)) {
    errores.password = "La contraseña debe incluir al menos una letra mayúscula.";
  } else if (!/[a-z]/.test(password)) {
    errores.password = "La contraseña debe incluir al menos una letra minúscula.";
  } else if (!/[0-9]/.test(password)) {
    errores.password = "La contraseña debe incluir al menos un número.";
  }

  if (!confirmarPassword) {
    errores.confirmarPassword = "Confirma tu contraseña.";
  } else if (password !== confirmarPassword) {
    errores.confirmarPassword = "Las contraseñas no coinciden.";
  }

  return errores;
}

function validarLogin({ email, password }) {
  const errores = {};

  if (!email.trim()) {
    errores.email = "El correo electrónico es obligatorio.";
  } else if (!REGEX_EMAIL.test(email.trim())) {
    errores.email = "Ingresa un correo electrónico válido.";
  }

  if (!password) {
    errores.password = "La contraseña es obligatoria.";
  } else if (password.length < 6) {
    errores.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  return errores;
}

function mensajeError(codigo) {
  const mensajes = {
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/user-not-found": "No existe una cuenta con este correo.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/email-already-in-use": "Ya existe una cuenta con este correo electrónico.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/popup-closed-by-user": "Se cerró la ventana de Google antes de finalizar.",
    "auth/too-many-requests": "Demasiados intentos fallidos. Intenta más tarde.",
  };
  return mensajes[codigo] || "Ocurrió un error. Inténtalo de nuevo.";
}

function FuerzaPassword({ password }) {
  if (!password) return null;
  const checks = [
    { label: "8+ caracteres", ok: password.length >= 8 },
    { label: "Mayúscula", ok: /[A-Z]/.test(password) },
    { label: "Minúscula", ok: /[a-z]/.test(password) },
    { label: "Número", ok: /[0-9]/.test(password) },
  ];
  const nivel = checks.filter((c) => c.ok).length;
  const colores = ["", "#e63946", "#ffb703", "#ffb703", "#2ec4b6"];
  const etiquetas = ["", "Débil", "Regular", "Buena", "Segura"];

  return (
    <div className="sv-password-fuerza">
      <div className="sv-fuerza-barra">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className="sv-fuerza-seg"
            style={{ backgroundColor: n <= nivel ? colores[nivel] : "var(--color-border)" }}
          />
        ))}
        <span className="sv-fuerza-label" style={{ color: colores[nivel] }}>
          {etiquetas[nivel]}
        </span>
      </div>
      <div className="sv-fuerza-checks">
        {checks.map((c) => (
          <span key={c.label} className={c.ok ? "sv-check-ok" : "sv-check-no"}>
            {c.ok ? "✓" : "○"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Login() {
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [errorServidor, setErrorServidor] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  function getFormData() {
    return { nombre, email, password, confirmarPassword };
  }

  function handleFieldBlur(campo) {
    setTocados((prev) => ({ ...prev, [campo]: true }));
    const e = modoRegistro ? validarRegistro(getFormData()) : validarLogin(getFormData());
    setErrores(e);
  }

  function handleFieldChange(setter, campo) {
    return (e) => {
      setter(e.target.value);
      if (tocados[campo] || intentoEnvio) {
        const data = { ...getFormData(), [campo]: e.target.value };
        const nuevoErr = modoRegistro ? validarRegistro(data) : validarLogin(data);
        setErrores(nuevoErr);
      }
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorServidor("");
    setIntentoEnvio(true);

    const data = getFormData();
    const nuevosErrores = modoRegistro ? validarRegistro(data) : validarLogin(data);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setCargando(true);
    try {
      if (modoRegistro) {
        await register(nombre.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate("/");
    } catch (err) {
      setErrorServidor(mensajeError(err.code));
    } finally {
      setCargando(false);
    }
  }

  async function handleGoogle() {
    setErrorServidor("");
    setCargando(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setErrorServidor(mensajeError(err.code));
    } finally {
      setCargando(false);
    }
  }

  function cambiarModo() {
    setModoRegistro((m) => !m);
    setErrores({});
    setTocados({});
    setIntentoEnvio(false);
    setErrorServidor("");
    setNombre("");
    setEmail("");
    setPassword("");
    setConfirmarPassword("");
  }

  const mostrarError = (campo) => errores[campo] && (tocados[campo] || intentoEnvio);
  const mostrarOk = (campo, val) => !errores[campo] && (tocados[campo] || intentoEnvio) && val?.trim?.();

  return (
    <div className="sv-login-page">
      <div className="sv-login-card card">
        <div className="sv-login-icon-header">
          <LockIcon size={28} />
        </div>
        <h1 className="sv-login-title">
          {modoRegistro ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        <p className="sv-login-subtitle">
          {modoRegistro
            ? "Regístrate para gestionar tus pedidos en Sense Vision"
            : "Bienvenido de nuevo a Sense Vision"}
        </p>

        {errorServidor && (
          <div className="sv-login-error">
            <AlertCircleIcon size={15} />
            {errorServidor}
          </div>
        )}

        <button
          type="button"
          className="sv-google-btn"
          onClick={handleGoogle}
          disabled={cargando}
        >
          <GoogleIcon />
          Continuar con Google
        </button>

        <div className="sv-divider">
          <span>o continúa con correo</span>
        </div>

        <form onSubmit={handleSubmit} className="sv-login-form" noValidate>
          {modoRegistro && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo <span className="campo-req">*</span></label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={handleFieldChange(setNombre, "nombre")}
                onBlur={() => handleFieldBlur("nombre")}
                className={mostrarError("nombre") ? "input-error" : mostrarOk("nombre", nombre) ? "input-ok" : ""}
                placeholder="Ej. Juan Pérez Martínez"
                maxLength={80}
              />
              {mostrarError("nombre") && (
                <span className="form-error-msg">
                  <AlertCircleIcon size={13} /> {errores.nombre}
                </span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo electrónico <span className="campo-req">*</span></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleFieldChange(setEmail, "email")}
              onBlur={() => handleFieldBlur("email")}
              className={mostrarError("email") ? "input-error" : mostrarOk("email", email) ? "input-ok" : ""}
              placeholder="Ej. juan@correo.com"
            />
            {mostrarError("email") && (
              <span className="form-error-msg">
                <AlertCircleIcon size={13} /> {errores.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña <span className="campo-req">*</span>
              {modoRegistro && <span className="sv-hint-label">(mín. 8 caracteres)</span>}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleFieldChange(setPassword, "password")}
              onBlur={() => handleFieldBlur("password")}
              className={mostrarError("password") ? "input-error" : mostrarOk("password", password) ? "input-ok" : ""}
              placeholder={modoRegistro ? "Crea una contraseña segura" : "Tu contraseña"}
            />
            {mostrarError("password") && (
              <span className="form-error-msg">
                <AlertCircleIcon size={13} /> {errores.password}
              </span>
            )}
            {modoRegistro && <FuerzaPassword password={password} />}
          </div>

          {modoRegistro && (
            <div className="form-group">
              <label htmlFor="confirmarPassword">Confirmar contraseña <span className="campo-req">*</span></label>
              <input
                type="password"
                id="confirmarPassword"
                value={confirmarPassword}
                onChange={handleFieldChange(setConfirmarPassword, "confirmarPassword")}
                onBlur={() => handleFieldBlur("confirmarPassword")}
                className={mostrarError("confirmarPassword") ? "input-error" : mostrarOk("confirmarPassword", confirmarPassword) ? "input-ok" : ""}
                placeholder="Repite tu contraseña"
              />
              {mostrarError("confirmarPassword") && (
                <span className="form-error-msg">
                  <AlertCircleIcon size={13} /> {errores.confirmarPassword}
                </span>
              )}
            </div>
          )}

          {modoRegistro && (
            <p className="sv-campo-req-nota">
              <span className="campo-req">*</span> Campos obligatorios
            </p>
          )}

          <button type="submit" className="btn btn-primary sv-login-submit" disabled={cargando}>
            {cargando ? "Procesando..." : modoRegistro ? "Crear mi cuenta" : "Iniciar sesión"}
          </button>
        </form>

        <p className="sv-login-toggle">
          {modoRegistro ? "¿Ya tienes una cuenta?" : "¿Aún no tienes cuenta?"}{" "}
          <button type="button" onClick={cambiarModo}>
            {modoRegistro ? "Inicia sesión" : "Regístrate gratis"}
          </button>
        </p>

        <Link to="/" className="sv-login-back">
          <ArrowLeftIcon size={14} /> Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}
