
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

const CORREO_DE_PRUEBA = "ricardo.alvarado@ricaldone.edu.sv";


export async function obtenerDocenteActivo() {
  if (docenteEnMemoria) {
    return docenteEnMemoria;
  }

  const idGuardado = Number(sessionStorage.getItem("docenteId"));

  if (idGuardado) {
    try {
      docenteEnMemoria = await solicitarApi(`${RUTAS.DOCENTES}/${idGuardado}`);
      return docenteEnMemoria;
    } catch (error) {
      // La sesión guardada ya no es válida; se limpia y se continúa.
      sessionStorage.removeItem("docenteId");
    }
  }

  // Sin sesión válida: se busca el docente de prueba.
  const docentes = await solicitarApi(RUTAS.DOCENTES);
  const lista = Array.isArray(docentes) ? docentes : [];

  const docente = lista.find(
    registro => registro.docCorreo?.trim().toLowerCase() === CORREO_DE_PRUEBA
  ) || lista[0];

  if (!docente) {
    throw new Error("No hay docentes registrados en el sistema.");
  }

  sessionStorage.setItem("docenteId", docente.idDocente);
  docenteEnMemoria = docente;

  return docente;
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