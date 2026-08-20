import {
  cerrarSesion,
  obtenerCorreoSesion,
  obtenerPerfilSesion
} from "../Service/PerfilService.js";

document.addEventListener("DOMContentLoaded", async function () {
  const correoGuardado = obtenerCorreoSesion();
  const perfilCorreo = document.getElementById("perfilCorreo");
  const btnLogout = document.getElementById("btnLogout");

  try {
    const perfil = await obtenerPerfilSesion();
    perfilCorreo.textContent = perfil?.correo || correoGuardado || "Correo no disponible";
  } catch (error) {
    perfilCorreo.textContent = correoGuardado || "Correo no disponible";
  }

  btnLogout?.addEventListener("click", function () {
    cerrarSesion();
  });
});
