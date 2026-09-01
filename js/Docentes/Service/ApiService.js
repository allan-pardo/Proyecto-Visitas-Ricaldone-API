
import { API_BASE_URL, RUTAS } from "../../config.js";

export { API_BASE_URL };

export async function solicitarApi(ruta, opciones = {}) {
  const configuracion = {
    ...opciones,
    headers: {
      Accept: "application/json",
      ...(opciones.body ? { "Content-Type": "application/json" } : {}),
      ...opciones.headers
    }
  };

  let respuesta;

  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, configuracion);
  } catch (error) {
    console.error("No fue posible realizar la solicitud.", error);
    throw new Error("No fue posible conectar con el servidor. Verifique que la API esté encendida.");
  }

  const tipoContenido = respuesta.headers.get("content-type") || "";
  const contenido = tipoContenido.includes("json")
    ? await respuesta.json()
    : null;

  if (!respuesta.ok) {
    console.error(`La solicitud a ${ruta} respondió con el estado ${respuesta.status}.`);
    throw new Error(
      contenido?.message ||
      contenido?.detail ||
      contenido?.error ||
      "No fue posible completar la solicitud. Intente nuevamente."
    );
  }

  if (contenido && Object.prototype.hasOwnProperty.call(contenido, "data")) {
    return contenido.data;
  }

  return contenido;
}


let docenteEnMemoria = null;

export async function obtenerDocenteActivo() {
  if (docenteEnMemoria) {
    return docenteEnMemoria;
  }

  const idGuardado = Number(sessionStorage.getItem("docenteId"));

  if (!idGuardado) {
    throw new Error("No hay una sesión de docente activa. Inicie sesión nuevamente.");
  }

  try {
    docenteEnMemoria = await solicitarApi(`${RUTAS.DOCENTES}/${idGuardado}`);
    return docenteEnMemoria;
  } catch (error) {
    // La sesión guardada ya no es válida; se exige iniciar sesión de nuevo.
    sessionStorage.removeItem("docenteId");
    throw new Error("No hay una sesión de docente activa. Inicie sesión nuevamente.");
  }
}

export async function obtenerIdDocenteActivo() {
  const docente = await obtenerDocenteActivo();
  return Number(docente.idDocente);
}

export function cerrarSesion() {
  sessionStorage.removeItem("docenteId");
  docenteEnMemoria = null;
}

export const obtenerEmpleadoActivo = obtenerDocenteActivo;
export const obtenerIdEmpleadoActivo = obtenerIdDocenteActivo;