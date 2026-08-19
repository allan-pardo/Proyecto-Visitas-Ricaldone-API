import { solicitarApi } from "./ApiService.js";

export async function obtenerDetalleSolicitud(idCita) {
  const cita = await solicitarApi(`/citas-reuniones/${idCita}`);
  const relacion = await solicitarApi(
    `/estudiante-encargados/${cita.idEstudianteEncargado}`
  );
  const [estudiante, encargado] = await Promise.all([
    solicitarApi(`/estudiantes/${relacion.idEstudiante}`),
    solicitarApi(`/encargados/${relacion.idEncargado}`)
  ]);
  const usuario = await solicitarApi(`/usuarios/${estudiante.usuarioEstudiante}`);
  const fecha = separarFechaHora(cita.fechaReunion);

  return {
    idCita: cita.idCita,
    solicitante: `${encargado.nombre} ${encargado.apellido}`.trim(),
    estudiante: `${estudiante.estNombre} ${estudiante.estApellido}`.trim(),
    correo: usuario.usuEmail,
    codigo: estudiante.estCodigo,
    motivo: cita.motivo,
    fecha: formatearFechaCompleta(fecha.fecha),
    hora: formatearHora(fecha.hora)
  };
}

export async function aceptarSolicitud(idCita) {
  const cita = await solicitarApi(`/citas-reuniones/${idCita}`);
  const citaActualizada = await solicitarApi(`/citas-reuniones/${idCita}`, {
    method: "PUT",
    body: JSON.stringify({
      ...cita,
      estado: "ACEPTADA"
    })
  });

  return {
    exito: true,
    mensaje: "La solicitud fue aceptada correctamente.",
    cita: citaActualizada
  };
}

function separarFechaHora(fechaReunion) {
  const partes = (fechaReunion || "").split("T");

  return {
    fecha: partes[0] || "",
    hora: (partes[1] || "").slice(0, 5)
  };
}

function formatearFechaCompleta(fecha) {
  if (!fecha) return "No disponible";

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaLocal = new Date(anio, mes - 1, dia);

  return new Intl.DateTimeFormat("es-SV", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(fechaLocal);
}

function formatearHora(hora) {
  if (!hora) return "No disponible";

  const [horasTexto, minutos] = hora.split(":");
  let horas = Number(horasTexto);
  const periodo = horas >= 12 ? "P.M" : "A.M";

  horas = horas % 12 || 12;
  return `${horas}:${minutos} ${periodo}`;
}
