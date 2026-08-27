import { obtenerDocenteActivo, cerrarSesion as limpiarSesionApi } from "./ApiService.js";

export function obtenerCorreoSesion() {
  return sessionStorage.getItem("userCorreo");
}

export async function obtenerPerfilSesion() {
  const docente = await obtenerDocenteActivo();

  return {
    idDocente: docente.idDocente,
    correo: docente.docCorreo || "",
    nombre: `${docente.docNombre || ""} ${docente.docApellido || ""}`.trim(),
    clave: docente.docClave || "",
    rol: docente.docTipo || docente.docRol || "Docente"
  };
}


export function cerrarSesion() {
  limpiarSesionApi();

  ["userCorreo", "userId", "userNombre", "userRol", "empleadoId", "docenteId"]
    .forEach(clave => sessionStorage.removeItem(clave));
}
