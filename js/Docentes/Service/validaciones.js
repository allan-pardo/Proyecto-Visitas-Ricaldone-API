// Validar datos al agendar una cita
export function validarDatosCita(datosCita) {
    if (!datosCita.asunto) {
        return { valido: false, mensaje: "Debe ingresar el asunto de la convocatoria." };
    }
    if (!datosCita.fecha) {
        return { valido: false, mensaje: "Debe seleccionar una fecha para la cita." };
    }

    const fechaSeleccionada = new Date(`${datosCita.fecha}T00:00:00`);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
        return { valido: false, mensaje: "La fecha de la cita no puede ser anterior al día de hoy." };
    }

    if (!datosCita.hora) {
        return { valido: false, mensaje: "Debe seleccionar una hora para la cita." };
    }
    if (!datosCita.descripcion) {
        return { valido: false, mensaje: "Debe ingresar la descripción de la convocatoria." };
    }
    if (!datosCita.idEstudianteEncargado) {
        return { valido: false, mensaje: "Debe seleccionar un estudiante." };
    }
    return { valido: true, mensaje: "" };
}

// Validar correo institucional
export function validarCorreoInstitucional(correo) {
    return /^[^@\s]+@ricaldone\.edu\.sv$/i.test(correo.trim());
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
