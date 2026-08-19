import { solicitarApi } from "./ApiService.js";

// Obtiene las solicitudes pendientes del empleado que inició sesión.
export async function obtenerSolicitudes(idEmpleado) {
  const [citas, relaciones, estudiantes, usuarios] = await Promise.all([
    solicitarApi("/citas-reuniones"),
    solicitarApi("/estudiante-encargados"),
    solicitarApi("/estudiantes"),
    solicitarApi("/usuarios")
  ]);

  return citas
    .filter(cita =>
      cita.estado === "PENDIENTE" &&
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
        fechaReunion: cita.fechaReunion
      };
    });
}
