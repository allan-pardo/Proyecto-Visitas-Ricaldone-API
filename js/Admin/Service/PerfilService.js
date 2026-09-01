
import { solicitarApi } from "../../Docentes/Service/ApiService.js";
import { RUTAS } from "../../config.js";

let administradorEnMemoria = null;

export async function obtenerAdministradorActivo() {
  if (administradorEnMemoria) {
    return administradorEnMemoria;
  }

  const idGuardado = Number(sessionStorage.getItem("adminId"));

  if (!idGuardado) {
    throw new Error("No hay una sesión de administrador activa. Inicie sesión nuevamente.");
  }

  try {
    administradorEnMemoria = await solicitarApi(`${RUTAS.ADMINISTRADORES}/${idGuardado}`);
    return administradorEnMemoria;
  } catch (error) {
    // La sesión guardada ya no es válida; se exige iniciar sesión de nuevo.
    sessionStorage.removeItem("adminId");
    throw new Error("No hay una sesión de administrador activa. Inicie sesión nuevamente.");
  }
}

export async function obtenerPerfilAdministrador() {
  const administrador = await obtenerAdministradorActivo();

  return {
    idAdministrador: administrador.idAdministrador,
    nombre: `${administrador.admNombre || ""} ${administrador.admApellido || ""}`.trim(),
    correo: administrador.admCorreo || "",
    rol: administrador.admRol || "ADMINISTRADOR"
  };
}

export function cerrarSesionAdministrador() {
  administradorEnMemoria = null;

  ["adminId", "adminSesionActiva", "adminCorreo", "adminNombre", "adminRol"]
    .forEach(clave => sessionStorage.removeItem(clave));
}