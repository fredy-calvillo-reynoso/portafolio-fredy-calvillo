import { observarSesion, cerrarSesion } from "./auth.js";

document.documentElement.style.visibility = "hidden";

document.addEventListener("DOMContentLoaded", () => {
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  observarSesion((usuario) => {
    if (!usuario) {
      window.location.href = "login.html";
      return;
    }

    document.documentElement.style.visibility = "visible";
  });

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", async () => {
      try {
        await cerrarSesion();
        window.location.href = "login.html";
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    });
  }
});