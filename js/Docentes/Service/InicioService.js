import { solicitarApi } from "./ApiService.js";
import { RUTAS } from "../../config.js";

export async function obtenerResumenCitas(idDocente) {
  if (!idDocente) {
    throw new Error("No se encontró el docente de la sesión.");
  }

  const citas = await solicitarApi(
    `${RUTAS.CITAS}/por-docente/${encodeURIComponent(idDocente)}`
  );

  const lista = Array.isArray(citas) ? citas : [];
  const hoy = obtenerFechaLocal(new Date());

  return {

    citasHoy: lista.filter(
      cita => cita.citFechaReunion?.slice(0, 10) === hoy
    ).length,


    pendientes: contarPorEstado(lista, "PENDIENTE"),


    aprobadas: contarPorEstado(lista, "ACEPTADA"),

    pospuestas: contarPorEstado(lista, "POSPUESTA"),
    rechazadas: contarPorEstado(lista, "RECHAZADA"),
    total: lista.length
  };
}

function contarPorEstado(citas, estado) {
  return citas.filter(cita => cita.citEstado === estado).length;
}

function obtenerFechaLocal(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}