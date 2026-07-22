export function obtenerCorreoSesion() {
  return sessionStorage.getItem("userCorreo");
}

export function cerrarSesion() {
  sessionStorage.removeItem("userCorreo");
}
