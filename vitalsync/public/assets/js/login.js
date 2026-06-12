import { iniciarSesion, crearCuenta, observarSesion } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const correoInput = document.getElementById("correo");
  const passwordInput = document.getElementById("password");
  const btnLogin = document.getElementById("btnLogin");
  const btnCrearCuenta = document.getElementById("btnCrearCuenta");
  const btnVerPassword = document.getElementById("verPassword");
  const alerta = document.getElementById("alerta");

  function mostrarAlerta(tipo, icono, mensaje) {
    alerta.className = `alert alert-${tipo}`;
    alerta.innerHTML = `<i class="${icono} me-2"></i>${mensaje}`;
    alerta.classList.remove("d-none");
  }

  function validarCampos() {
    const correo = correoInput.value.trim();
    const password = passwordInput.value.trim();

    if (!correo) {
      mostrarAlerta("warning", "fas fa-triangle-exclamation", "Ingrese su correo electrónico.");
      correoInput.focus();
      return false;
    }

    if (!password) {
      mostrarAlerta("warning", "fas fa-triangle-exclamation", "Ingrese su contraseña.");
      passwordInput.focus();
      return false;
    }

    if (password.length < 6) {
      mostrarAlerta("warning", "fas fa-triangle-exclamation", "La contraseña debe tener al menos 6 caracteres.");
      passwordInput.focus();
      return false;
    }

    return true;
  }

  function obtenerDatos() {
    return {
      correo: correoInput.value.trim(),
      password: passwordInput.value.trim()
    };
  }

  function bloquearBotones(bloquear) {
    btnLogin.disabled = bloquear;
    btnCrearCuenta.disabled = bloquear;
  }

  observarSesion((usuario) => {
    if (usuario) {
      window.location.href = "registro-paciente.html";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validarCampos()) return;

    const { correo, password } = obtenerDatos();

    try {
      bloquearBotones(true);
      btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Entrando';

      await iniciarSesion(correo, password);

      mostrarAlerta("success", "fas fa-circle-check", "Inicio de sesión correcto.");

      window.location.href = "registro-paciente.html";
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      let mensaje = "No se pudo iniciar sesión. Verifique el correo y la contraseña.";

      if (error.code === "auth/invalid-email") {
        mensaje = "El correo electrónico no es válido.";
      }

      if (error.code === "auth/invalid-credential") {
        mensaje = "Correo o contraseña incorrectos.";
      }

      if (error.code === "auth/user-not-found") {
        mensaje = "No existe una cuenta registrada con este correo.";
      }

      if (error.code === "auth/wrong-password") {
        mensaje = "La contraseña es incorrecta.";
      }

      mostrarAlerta("danger", "fas fa-circle-xmark", mensaje);
    } finally {
      bloquearBotones(false);
      btnLogin.innerHTML = '<i class="fas fa-right-to-bracket me-2"></i>Entrar';
    }
  });

  btnCrearCuenta.addEventListener("click", async () => {
    if (!validarCampos()) return;

    const { correo, password } = obtenerDatos();

    try {
      bloquearBotones(true);
      btnCrearCuenta.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creando cuenta';

      await crearCuenta(correo, password);

      mostrarAlerta("success", "fas fa-circle-check", "Cuenta creada correctamente.");

      window.location.href = "registro-paciente.html";
    } catch (error) {
      console.error("Error al crear cuenta:", error);

      let mensaje = "No se pudo crear la cuenta.";

      if (error.code === "auth/email-already-in-use") {
        mensaje = "Este correo ya está registrado.";
      }

      if (error.code === "auth/invalid-email") {
        mensaje = "El correo electrónico no es válido.";
      }

      if (error.code === "auth/weak-password") {
        mensaje = "La contraseña es muy débil. Use mínimo 6 caracteres.";
      }

      mostrarAlerta("danger", "fas fa-circle-xmark", mensaje);
    } finally {
      bloquearBotones(false);
      btnCrearCuenta.innerHTML = '<i class="fas fa-user-plus me-2"></i>Crear cuenta';
    }
  });

  btnVerPassword.addEventListener("click", () => {
    const esPassword = passwordInput.type === "password";

    passwordInput.type = esPassword ? "text" : "password";

    btnVerPassword.innerHTML = esPassword
      ? '<i class="fas fa-eye-slash"></i>'
      : '<i class="fas fa-eye"></i>';
  });
});