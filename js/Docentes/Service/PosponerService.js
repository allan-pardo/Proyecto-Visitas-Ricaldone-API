import { solicitarApi } from "./ApiService.js";
import { RUTAS } from "../../config.js";
import { validarPropuesta } from "./validaciones.js";

const MARCADOR_SOLICITUD_PADRE = "[SOLICITUD_PADRE]";


const LIMITE_OBSERVACIONES = 300;

export { validarPropuesta };

export function obtenerFechaActual() {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

export function formatearFecha(fecha) {
    if (!fecha) {
        return "";
    }

    const partes = fecha.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    const anio = partes[0];
    const mes = parseInt(partes[1], 10);
    const dia = parseInt(partes[2], 10);

    return `${dia}/${mes}/${anio}`;
}

export function formatearHora(hora) {
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

export function crearPropuesta(fecha, hora) {
    return {
        fecha: formatearFecha(fecha),
        hora: formatearHora(hora)
    };
}

export async function obtenerCita(idCita) {
    const cita = await solicitarApi(`${RUTAS.CITAS}/${idCita}`);
    const partes = String(cita.citFechaReunion || "").split("T");

    return {
        idCita: cita.idCita,
        estudiante: cita.nombreEstudiante || "Estudiante no disponible",
        encargado: cita.nombreEncargado || "Encargado no disponible",
        motivo: cita.citMotivo || "",
        estado: cita.citEstado,
        fecha: partes[0] || "",
        hora: (partes[1] || "").slice(0, 5)
    };
}

export async function guardarPropuesta(idCita, fecha, hora, justificacion) {
    const validacion = validarPropuesta(fecha, hora);

    if (!validacion.valido) {
        throw new Error(validacion.mensaje);
    }

    const cita = await solicitarApi(`${RUTAS.CITAS}/${idCita}`);

    return solicitarApi(`${RUTAS.CITAS}/${idCita}`, {
        method: "PATCH",
        body: JSON.stringify({
            citEstado: "POSPUESTA",
            citObservaciones: construirObservaciones(cita.citObservaciones, justificacion),
            citFechaReunion: `${fecha}T${hora}:00`
        })
    });
}

function construirObservaciones(observacionActual, justificacion) {
    const original = observacionActual || "";
    const llevaMarcador = original.startsWith(MARCADOR_SOLICITUD_PADRE);

    const cuerpo = llevaMarcador
        ? original.slice(MARCADOR_SOLICITUD_PADRE.length).trim()
        : original;

    const texto = [
        cuerpo,
        justificacion ? `Reprogramación: ${justificacion.trim()}` : ""
    ].filter(Boolean).join(" | ");

    const completo = llevaMarcador
        ? `${MARCADOR_SOLICITUD_PADRE} ${texto}`
        : texto;

    return completo.slice(0, LIMITE_OBSERVACIONES);
}

export { MARCADOR_SOLICITUD_PADRE };