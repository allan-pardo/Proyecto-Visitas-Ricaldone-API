import {
  cerrarSesionAdministrador,
  obtenerPerfilAdministrador
} from "../Service/PerfilService.js";

document.addEventListener("DOMContentLoaded", function () {
  const perfil = obtenerPerfilAdministrador() || {
    nombre: "Administrador",
    correo: "Acceso de prueba sin inicio de sesión"
  };

  const perfilAdminNombre = document.getElementById("perfilAdminNombre");
  const perfilAdminCorreo = document.getElementById("perfilAdminCorreo");
  const btnCerrarSesionAdmin = document.getElementById("btnCerrarSesionAdmin");

  perfilAdminNombre.textContent = perfil.nombre || "Nombre no disponible";
  perfilAdminCorreo.textContent = perfil.correo || "Correo no disponible";

  btnCerrarSesionAdmin?.addEventListener("click", function () {
    cerrarSesionAdministrador();
  });
});
