import {
  cerrarSesion,
  obtenerCorreoSesion
} from "../services/PerfilService.js";

document.addEventListener("DOMContentLoaded", function () {
  const correoGuardado = obtenerCorreoSesion();
  const perfilCorreo = document.getElementById("perfilCorreo");
  const btnLogout = document.getElementById("btnLogout");

  if (perfilCorreo) {
    perfilCorreo.textContent = correoGuardado || "Correo no disponible";
  }

  btnLogout?.addEventListener("click", function () {
    cerrarSesion();
  });
});
