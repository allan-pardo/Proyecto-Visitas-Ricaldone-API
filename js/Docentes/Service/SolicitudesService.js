import { solicitarApi } from "./ApiService.js";
import { RUTAS } from "../../config.js";

const MARCADOR_SOLICITUD_PADRE = "[SOLICITUD_PADRE]";

let estudiantesEnMemoria = null;

export async function obtenerSolicitudes(idDocente) {
  if (!idDocente) {
    throw new Error("No se encontró el docente de la sesión.");
  }

  const [citas, relaciones, estudiantes] = await Promise.all([
    solicitarApi(`${RUTAS.CITAS}/por-docente/${encodeURIComponent(idDocente)}`),
    solicitarApi(RUTAS.ESTUDIANTES_ENCARGADOS),
    obtenerEstudiantes()
  ]);

  const listaCitas = Array.isArray(citas) ? citas : [];
  const listaRelaciones = Array.isArray(relaciones) ? relaciones : [];

  return listaCitas
    .filter(esSolicitudDePadre)
    .map(cita => convertirSolicitud(cita, listaRelaciones, estudiantes));
}

function esSolicitudDePadre(cita) {
  return ["PENDIENTE", "ACEPTADA"].includes(cita.citEstado) &&
         cita.citObservaciones?.startsWith(MARCADOR_SOLICITUD_PADRE);
}

async function obtenerEstudiantes() {
  if (estudiantesEnMemoria === null) {
    const respuesta = await solicitarApi(RUTAS.ESTUDIANTES);
    estudiantesEnMemoria = Array.isArray(respuesta) ? respuesta : [];
  }

  return estudiantesEnMemoria;
}

function convertirSolicitud(cita, relaciones, estudiantes) {
  const relacion = relaciones.find(
    registro => Number(registro.idEstudianteEncargado) === Number(cita.idEstudianteEncargado)
  );

  const estudiante = estudiantes.find(
    registro => Number(registro.idEstudiante) === Number(relacion?.idEstudiante)
  );

  return {
    id: cita.idCita,
    idEstudianteEncargado: cita.idEstudianteEncargado,

    padre: cita.nombreEncargado || relacion?.nombreEncargado || "Encargado no disponible",
    estudiante: cita.nombreEstudiante || relacion?.nombreEstudiante || "Estudiante no disponible",

    codigo: estudiante?.estCodigo || "No disponible",
    correo: estudiante?.estCorreo || "No disponible",

    motivo: cita.citMotivo || "",

    descripcion: cita.citObservaciones
      ?.slice(MARCADOR_SOLICITUD_PADRE.length)
      .trim() || cita.citMotivo || "",

    fechaReunion: cita.citFechaReunion,
    estado: cita.citEstado
  };
}

export async function aceptarSolicitud(idCita) {
  return solicitarApi(`${RUTAS.CITAS}/${idCita}`, {
    method: "PATCH",
    body: JSON.stringify({ citEstado: "ACEPTADA" })
  });
}

/**
 * Rechaza una solicitud y deja constancia del motivo.
 * El marcador se conserva para no perder el origen de la cita.
 */
export async function rechazarSolicitud(idCita, motivo) {
  const cuerpo = { citEstado: "RECHAZADA" };

  if (motivo && motivo.trim()) {
    cuerpo.citObservaciones =
      `${MARCADOR_SOLICITUD_PADRE} ${motivo.trim()}`.slice(0, 300);
  }

  return solicitarApi(`${RUTAS.CITAS}/${idCita}`, {
    method: "PATCH",
    body: JSON.stringify(cuerpo)
  });
}

export { MARCADOR_SOLICITUD_PADRE };