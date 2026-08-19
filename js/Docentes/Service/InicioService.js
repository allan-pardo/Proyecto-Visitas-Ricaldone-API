import { solicitarApi } from "./ApiService.js";

export async function obtenerResumenCitas(idEmpleado) {
    const citas = await solicitarApi("/citas-reuniones");
    const hoy = obtenerFechaLocal(new Date());
    const citasEmpleado = citas.filter(
        cita => Number(cita.idEmpleado) === Number(idEmpleado)
    );

    return {
        citasHoy: citasEmpleado.filter(
            cita => cita.fechaReunion?.slice(0, 10) === hoy
        ).length,
        pendientes: citasEmpleado.filter(
            cita => cita.estado === "PENDIENTE"
        ).length
    };
}

function obtenerFechaLocal(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}
