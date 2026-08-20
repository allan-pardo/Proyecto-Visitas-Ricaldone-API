import { solicitarApi } from "./ApiService.js";

const MARCADOR_SOLICITUD_PADRE = "[SOLICITUD_PADRE]";

// Obtiene las solicitudes pendientes y aceptadas del empleado que inició sesión.
export async function obtenerSolicitudes(idEmpleado) {
  const [citas, relaciones, estudiantes, usuarios] = await Promise.all([
    solicitarApi("/citas-reuniones"),
    solicitarApi("/estudiante-encargados"),
    solicitarApi("/estudiantes"),
    solicitarApi("/usuarios")
  ]);

  return citas
    .filter(cita =>
      ["PENDIENTE", "ACEPTADA"].includes(cita.estado) &&
      cita.observaciones?.startsWith(MARCADOR_SOLICITUD_PADRE) &&
      (!idEmpleado || Number(cita.idEmpleado) === Number(idEmpleado))
    )
    .map(cita => {
      const relacion = relaciones.find(
        registro => Number(registro.idEstudianteEncargado) === Number(cita.idEstudianteEncargado)
      );
      const estudiante = estudiantes.find(
        registro => Number(registro.idEstudiante) === Number(relacion?.idEstudiante)
      );
      const usuario = usuarios.find(
        registro => Number(registro.idUsuario) === Number(estudiante?.usuarioEstudiante)
      );

      return {
        id: cita.idCita,
        idEstudianteEncargado: cita.idEstudianteEncargado,
        padre: relacion?.nombreEncargado || "Encargado no disponible",
        estudiante: relacion?.nombreEstudiante || "Estudiante no disponible",
        codigo: estudiante?.estCodigo || "No disponible",
        correo: usuario?.usuEmail || "No disponible",
        motivo: cita.motivo,
        descripcion: cita.observaciones
          ?.slice(MARCADOR_SOLICITUD_PADRE.length)
          .trim() || cita.motivo,
        fechaReunion: cita.fechaReunion,
        estado: cita.estado
      };
    });
}
