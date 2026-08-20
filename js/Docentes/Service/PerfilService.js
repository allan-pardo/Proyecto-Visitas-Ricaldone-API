import { obtenerEmpleadoActivo } from "./ApiService.js";

export function obtenerCorreoSesion() {
  return sessionStorage.getItem("userCorreo");
}

export async function obtenerPerfilSesion() {
  const empleado = await obtenerEmpleadoActivo();

  return {
    idEmpleado: empleado.idEmpleado,
    correo: empleado.empCorreo,
    nombre: `${empleado.empNombre} ${empleado.empApellido}`.trim(),
    rol: empleado.empRol
  };
}

export function cerrarSesion() {
  sessionStorage.removeItem("userCorreo");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("empleadoId");
  sessionStorage.removeItem("userNombre");
  sessionStorage.removeItem("userRol");
}
