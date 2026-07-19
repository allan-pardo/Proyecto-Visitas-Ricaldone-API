export function obtenerFechaActual() {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}


//Valida los datos de la propuesta.

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