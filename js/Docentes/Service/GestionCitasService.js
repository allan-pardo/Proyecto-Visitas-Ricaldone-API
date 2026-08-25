
import { solicitarApi } from "./ApiService.js";
import { validarDatosCita } from "./validaciones.js";


let citas = [];
let estudiantesEncargados = [];
const MARCADOR_SOLICITUD_PADRE = "[SOLICITUD_PADRE]";

const nombresEstado = {
  PENDIENTE: "Pendiente",
  ACEPTADA: "Aprobado",
  POSPUESTA: "Pospuesta",
  RECHAZADA: "Rechazado",
  CANCELADA: "Cancelado",
  FINALIZADA: "Finalizado"
};

export { validarDatosCita };

// Obtendrá desde la API las citas asociadas al empleado que inició sesión.
export async function obtenerCitas(idEmpleado) {
  if (!idEmpleado) {
    throw new Error("No se encontró el empleado de la sesión.");
  }

  const citasApi = await solicitarApi(
    `/citas-reuniones/por-empleado/${encodeURIComponent(idEmpleado)}`
  );

  citas = (Array.isArray(citasApi) ? citasApi : [])
    .filter(cita => !cita.observaciones?.startsWith(MARCADOR_SOLICITUD_PADRE))
    .map(convertirCitaParaVista);

  return citas;
}

export async function obtenerEstudiantesEncargados() {
  if (estudiantesEncargados.length === 0) {
    const relacionesApi = await solicitarApi("/estudiante-encargados");
    estudiantesEncargados = Array.isArray(relacionesApi) ? relacionesApi : [];
  }

  return estudiantesEncargados;
}

// Nos permite agregar una nueva cita mediante la API.
export async function agregarCita(datosCita, idEmpleado) {
  const citaGuardada = await solicitarApi("/citas-reuniones", {
    method: "POST",
    body: JSON.stringify({
      idEmpleado: Number(idEmpleado),
      idEstudianteEncargado: Number(datosCita.idEstudianteEncargado),
      motivo: datosCita.asunto,
      estado: "PENDIENTE",
      observaciones: datosCita.descripcion,
      fechaReunion: `${datosCita.fecha}T${datosCita.hora}:00`
    })
  });

  const nuevaCita = convertirCitaParaVista(citaGuardada);
  citas.push(nuevaCita);

  return nuevaCita;
}

// Filtrará las citas según su estado mostrado en pantalla.
export function filtrarCitasPorEstado(estado) {
  if (estado === "Todos") {
    return citas;
  }

  return citas.filter(cita => cita.estado === estado);
}

function convertirCitaParaVista(cita) {
  const relacion = estudiantesEncargados.find(
    registro => Number(registro.idEstudianteEncargado) === Number(cita.idEstudianteEncargado)
  );
  const fechaHora = separarFechaHora(cita.fechaReunion);

  return {
    idCita: cita.idCita,
    idEmpleado: cita.idEmpleado,
    idEstudianteEncargado: cita.idEstudianteEncargado,
    fechaReunion: cita.fechaReunion,
    fecha: formatearFechaEspanol(fechaHora.fecha),
    hora: formatearHoraAMPM(fechaHora.hora),
    fechaHora: `${formatearFechaEspanol(fechaHora.fecha)}, ${formatearHoraAMPM(fechaHora.hora)}`,
    estudiante: cita.nombreEstudiante || relacion?.nombreEstudiante || "Estudiante no disponible",
    encargado: cita.nombreEncargado || relacion?.nombreEncargado || "Encargado no disponible",
    asunto: cita.motivo,
    descripcion: cita.observaciones || "",
    estado: nombresEstado[cita.estado] || cita.estado
  };
}

function separarFechaHora(fechaReunion) {
  if (!fechaReunion) {
    return { fecha: "", hora: "" };
  }

  const partes = fechaReunion.split("T");

  return {
    fecha: partes[0] || "",
    hora: (partes[1] || "").slice(0, 5)
  };
}

// Se comprobará si la fecha es anterior al día actual.
function fechaEsPasada(fecha) {
  const fechaSeleccionada = new Date(`${fecha}T00:00:00`);

  const fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0);

  return fechaSeleccionada < fechaActual;
}

// Convierte 2026-07-23 en 23 de julio de 2026.
export function formatearFechaEspanol(fecha) {
  if (!fecha) {
    return "";
  }

  const partes = fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  const anio = partes[0];
  const indiceMes = parseInt(partes[1], 10) - 1;
  const dia = parseInt(partes[2], 10);

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  return `${dia} de ${meses[indiceMes]} de ${anio}`;
}

export function formatearHoraAMPM(hora) {
  if (!hora) {
    return "";
  }

  const partes = hora.split(":");

  if (partes.length < 2) {
    return hora;
  }

  let horas = parseInt(partes[0], 10);
  const minutos = partes[1];
  const periodo = horas >= 12 ? "P.M" : "A.M";

  horas = horas % 12;
  horas = horas === 0 ? 12 : horas;

  return `${horas}:${minutos} ${periodo}`;
}
