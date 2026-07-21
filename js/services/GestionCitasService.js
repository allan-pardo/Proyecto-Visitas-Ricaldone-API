const citas = [
  {
    fechaHora: "14 de mayo de 2026, 11:25 A.M",
    estudiante: "David Ramírez",
    motivo: "Bajo rendimiento académico",
    observaciones: "",
    estado: "Pendiente"
  },
  {
    fechaHora: "15 de mayo de 2026, 9:00 A.M",
    estudiante: "María López",
    motivo: "Reunión con docente",
    observaciones: "",
    estado: "Aprobado"
  },
  {
    fechaHora: "16 de mayo de 2026, 10:30 A.M",
    estudiante: "Carlos Hernández",
    motivo: "Permiso de salida",
    observaciones: "",
    estado: "Rechazado"
  }
];

// Obtendra todas las citas
export function obtenerCitas() {
  return citas;
}

//Nios permite agragar nuevas citas
export function agregarCita(datosCita) {
  const fechaFormateada = formatearFechaEspanol(datosCita.fecha);
  const horaFormateada = formatearHoraAMPM(datosCita.hora);

  const nuevaCita = {
    fechaHora: `${fechaFormateada}, ${horaFormateada}`,
    estudiante: datosCita.nombre,
    motivo: datosCita.motivo,
    observaciones: datosCita.observaciones,
    estado: "Pendiente"
  };

  citas.push(nuevaCita);

  return nuevaCita;
}

//Filtrara las citas segun su estado

export function filtrarCitasPorEstado(estado) {
  if (estado === "Todos") {
    return obtenerCitas();
  }

  return citas.filter(cita => cita.estado === estado);
}


// Valida los datos enviados desde el formulario.

export function validarDatosCita(datosCita) {
  const { nombre, fecha, hora, motivo } = datosCita;

  if (
    nombre === "" ||
    fecha === "" ||
    hora === "" ||
    motivo === ""
  ) {
    return {
      valido: false,
      mensaje: "Complete todos los campos obligatorios."
    };
  }

  if (fechaEsPasada(fecha)) {
    return {
      valido: false,
      mensaje: "La fecha no puede ser en el pasado."
    };
  }

  return {
    valido: true,
    mensaje: ""
  };
}

//Se comprobara si la fecha es una anterior al ahora
function fechaEsPasada(fecha) {
  const fechaSeleccionada = new Date(`${fecha}T00:00:00`);

  const fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0);

  return fechaSeleccionada < fechaActual;
}

//Nos permitira convertir la fechas abreviadas 2026-07-23 en la fecha completa 23 de julio del 2026

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
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"
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