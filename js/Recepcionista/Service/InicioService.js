import { solicitarApi } from "../../Docentes/Service/ApiService.js";

const MILISEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;
const PLAZO_HISTORIAL_DIAS = 14;

const NOMBRES_ESTADO = {
  PENDIENTE: "Pendiente",
  ACEPTADA: "Aprobado",
  ACEPTADO: "Aprobado",
  POSPUESTA: "Pospuesta",
  POSPUESTO: "Pospuesta",
  RECHAZADA: "Rechazado",
  RECHAZADO: "Rechazado",
  CANCELADA: "Cancelado",
  CANCELADO: "Cancelado",
  FINALIZADA: "Finalizado",
  FINALIZADO: "Finalizado"
};

export async function obtenerCitasRecepcionista({
  fechaReferencia = new Date(),
  limpiarExpiradas = true
} = {}) {
  const ahora = validarFechaReferencia(fechaReferencia);
  const [respuestaCitas, respuestaEmpleados, respuestaRelaciones] = await Promise.all([
    solicitarApi("/citas-reuniones"),
    solicitarApi("/empleados"),
    solicitarApi("/estudiante-encargados")
  ]);

  const citasApi = Array.isArray(respuestaCitas) ? respuestaCitas : [];
  const empleados = Array.isArray(respuestaEmpleados) ? respuestaEmpleados : [];
  const relaciones = Array.isArray(respuestaRelaciones) ? respuestaRelaciones : [];
  const citasPreparadas = citasApi
    .map(cita => convertirCitaParaVista(cita, empleados, relaciones))
    .filter(cita => cita && cita.estado !== "Rechazado");
  const citasExpiradas = citasPreparadas.filter(cita =>
    citaConcluidaHaExpirado(cita, ahora)
  );

  const limpieza = limpiarExpiradas
    ? await eliminarCitasExpiradas(citasExpiradas)
    : { eliminadas: [], errores: [] };

  const idsExpirados = new Set(citasExpiradas.map(cita => String(cita.idCita)));
  const citasDentroDelPlazo = citasPreparadas.filter(
    cita => !idsExpirados.has(String(cita.idCita))
  );
  const { pendientes, concluidas } = clasificarCitasPorFecha(
    citasDentroDelPlazo,
    ahora
  );

  return {
    pendientes,
    concluidas,
    limpieza,
    invalidas: citasApi.length - citasPreparadas.length
  };
}

export function clasificarCitasPorFecha(citas, fechaReferencia = new Date()) {
  const ahora = validarFechaReferencia(fechaReferencia);

  const pendientes = citas
    .filter(cita => cita.fechaHora instanceof Date && cita.fechaHora >= ahora)
    .sort((a, b) => a.fechaHora - b.fechaHora);
  const concluidas = citas
    .filter(cita => cita.fechaHora instanceof Date && cita.fechaHora < ahora)
    .sort((a, b) => b.fechaHora - a.fechaHora);

  return { pendientes, concluidas };
}

export function filtrarCitas(citas, { texto = "", estado = "Todos" } = {}) {
  const busqueda = normalizarTexto(texto);
  const estadoNormalizado = normalizarTexto(estado);

  return citas.filter(cita => {
    const coincideEstado = !estadoNormalizado || estadoNormalizado === "todos" ||
      normalizarTexto(cita.estado) === estadoNormalizado;
    const contenido = normalizarTexto(
      `${cita.docente} ${cita.estudiante} ${cita.motivo} ${cita.fecha} ${cita.hora}`
    );

    return coincideEstado && (!busqueda || contenido.includes(busqueda));
  });
}

export function citaConcluidaHaExpirado(cita, fechaReferencia = new Date()) {
  const ahora = validarFechaReferencia(fechaReferencia);
  const fechaHora = cita?.fechaHora instanceof Date
    ? cita.fechaHora
    : convertirFechaReunion(cita?.fechaReunion);

  if (!fechaHora || fechaHora >= obtenerInicioDelDia(ahora)) {
    return false;
  }

  const limite = ahora.getTime() - PLAZO_HISTORIAL_DIAS * MILISEGUNDOS_POR_DIA;
  return fechaHora.getTime() <= limite;
}

async function eliminarCitasExpiradas(citasExpiradas) {
  const resultados = await Promise.allSettled(
    citasExpiradas.map(async cita => {
      if (cita.idCita === null || cita.idCita === undefined || cita.idCita === "") {
        throw new Error("La cita no tiene un identificador válido.");
      }

      await solicitarApi(`/citas-reuniones/${encodeURIComponent(cita.idCita)}`, {
        method: "DELETE"
      });

      return cita.idCita;
    })
  );

  return resultados.reduce((resumen, resultado, indice) => {
    if (resultado.status === "fulfilled") {
      resumen.eliminadas.push(resultado.value);
    } else {
      resumen.errores.push({
        idCita: citasExpiradas[indice]?.idCita ?? null,
        mensaje: resultado.reason?.message || "No se pudo eliminar la cita expirada."
      });
    }

    return resumen;
  }, { eliminadas: [], errores: [] });
}

function convertirCitaParaVista(cita, empleados, relaciones) {
  const fechaHora = convertirFechaReunion(cita?.fechaReunion);

  if (!fechaHora) {
    return null;
  }

  const empleado = empleados.find(
    registro => Number(registro.idEmpleado) === Number(cita.idEmpleado)
  );
  const relacion = relaciones.find(
    registro => Number(registro.idEstudianteEncargado) ===
      Number(cita.idEstudianteEncargado)
  );

  return {
    idCita: cita.idCita,
    fechaReunion: cita.fechaReunion,
    fechaHora,
    docente: obtenerNombreDocente(cita, empleado),
    estudiante: cita.nombreEstudiante?.trim() ||
      relacion?.nombreEstudiante?.trim() ||
      "Estudiante no disponible",
    motivo: cita.motivo?.trim() || "Sin motivo",
    fecha: new Intl.DateTimeFormat("es-SV", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(fechaHora),
    hora: new Intl.DateTimeFormat("es-SV", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(fechaHora),
    estado: obtenerNombreEstado(cita.estado)
  };
}

function obtenerNombreDocente(cita, empleado) {
  const nombreIncluido = cita.nombreDocente?.trim() || cita.nombreEmpleado?.trim();

  if (nombreIncluido) {
    return nombreIncluido;
  }

  const nombre = empleado?.empNombre?.trim() || "";
  const apellido = empleado?.empApellido?.trim() || "";
  return `${nombre} ${apellido}`.trim() || "Docente no disponible";
}

function obtenerNombreEstado(estado) {
  const clave = String(estado || "").trim().toUpperCase();
  return NOMBRES_ESTADO[clave] || String(estado || "Sin estado").trim();
}

function convertirFechaReunion(valor) {
  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? null : new Date(valor);
  }

  const texto = String(valor || "").trim();
  const coincidenciaLocal = texto.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/
  );

  let fecha;

  if (coincidenciaLocal) {
    const [, anio, mes, dia, hora, minuto, segundo = "0"] = coincidenciaLocal;
    fecha = new Date(
      Number(anio),
      Number(mes) - 1,
      Number(dia),
      Number(hora),
      Number(minuto),
      Number(segundo)
    );
  } else {
    fecha = new Date(texto);
  }

  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

function validarFechaReferencia(fechaReferencia) {
  const fecha = fechaReferencia instanceof Date
    ? new Date(fechaReferencia)
    : new Date(fechaReferencia);

  if (Number.isNaN(fecha.getTime())) {
    throw new Error("La fecha de referencia no es válida.");
  }

  return fecha;
}

function obtenerInicioDelDia(fecha) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}
