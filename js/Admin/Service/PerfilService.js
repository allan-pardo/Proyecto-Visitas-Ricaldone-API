export function obtenerPerfilAdministrador() {
  const sesionActiva = sessionStorage.getItem("adminSesionActiva") === "true";

  if (!sesionActiva) return null;

  return {
    nombre: sessionStorage.getItem("adminNombre"),
    correo: sessionStorage.getItem("adminCorreo"),
    rol: sessionStorage.getItem("adminRol")
  };
}

export function cerrarSesionAdministrador() {
  sessionStorage.removeItem("adminSesionActiva");
  sessionStorage.removeItem("adminCorreo");
  sessionStorage.removeItem("adminNombre");
  sessionStorage.removeItem("adminRol");
}
