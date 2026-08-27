import { solicitarApi } from "../../Docentes/Service/ApiService.js";

export function obtenerCorreoSesion() {
  return sessionStorage.getItem("userCorreo");
}

export async function obtenerPerfilSesion() {
  const idRecepcionista = Number(sessionStorage.getItem("recepcionistaId"));

  if (!idRecepcionista) {
    throw new Error("No se encontró la sesión de la recepcionista.");
  }

  const recepcionista = await solicitarApi(
    `/recepcionistas/${encodeURIComponent(idRecepcionista)}`
  );

  return {
    idRecepcionista: recepcionista.idRecepcionista,
    correo: recepcionista.recCorreo,
    nombre: `${recepcionista.recNombre} ${recepcionista.recApellido}`.trim(),
    rol: recepcionista.recRol
  };
}

export function cerrarSesion() {
  sessionStorage.removeItem("userCorreo");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("recepcionistaId");
  sessionStorage.removeItem("userNombre");
  sessionStorage.removeItem("userRol");
}
