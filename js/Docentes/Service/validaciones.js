// Validar datos al agendar una cita
export function validarDatosCita(datosCita) {
    if (!datosCita.idEstudianteEncargado) {
        return { valido: false, mensaje: "Debe seleccionar al estudiante y su encargado." };
    }
    if (!datosCita.fecha) {
        return { valido: false, mensaje: "Debe seleccionar una fecha para la cita." };
    }
    if (!datosCita.hora) {
        return { valido: false, mensaje: "Debe seleccionar una hora para la cita." };
    }
    if (!datosCita.motivo) {
        return { valido: false, mensaje: "Debe seleccionar o ingresar un motivo." };
    }
    return { valido: true, mensaje: "" };
}

// Validar correo institucional
export function validarCorreoInstitucional(correo) {
    return /^[a-záéíóúñ._-]+@ricaldone\.edu\.sv$/i.test(correo.trim());
}

// Validar propuesta al posponer una cita
export function validarPropuesta(fecha, hora) {
    if (fecha === "" || hora === "") {
        return {
            valido: false,
            mensaje: "Complete la fecha y la hora sugeridas."
        };
    }

    const fechaSeleccionada = new Date(`${fecha}T00:00:00`);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
        return {
            valido: false,
            mensaje: "La fecha sugerida no puede estar en el pasado."
        };
    }

    return {
        valido: true,
        mensaje: ""
    };
}
