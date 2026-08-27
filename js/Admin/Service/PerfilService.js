
import { solicitarApi } from "../../Docentes/Service/ApiService.js";
import { RUTAS } from "../../config.js";

let administradorEnMemoria = null;

const CORREO_DE_PRUEBA = "admin.principal@ricaldone.edu.sv";

export async function obtenerAdministradorActivo() {
  if (administradorEnMemoria) {
    return administradorEnMemoria;
  }

  const idGuardado = Number(sessionStorage.getItem("adminId"));

  if (idGuardado) {
    try {
      administradorEnMemoria = await solicitarApi(`${RUTAS.ADMINISTRADORES}/${idGuardado}`);
      return administradorEnMemoria;
    } catch (error) {
      // La sesión guardada ya no es válida; se limpia y se continúa.
      sessionStorage.removeItem("adminId");
    }
  }

  const administradores = await solicitarApi(RUTAS.ADMINISTRADORES);
  const lista = Array.isArray(administradores) ? administradores : [];

  const administrador = lista.find(
    registro => registro.admCorreo?.trim().toLowerCase() === CORREO_DE_PRUEBA
  ) || lista[0];

  if (!administrador) {
    throw new Error("No hay administradores registrados en el sistema.");
  }

  sessionStorage.setItem("adminId", administrador.idAdministrador);
  administradorEnMemoria = administrador;

  return administrador;
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