import {
    obtenerFechaActual,
    validarPropuesta,
    crearPropuesta,
    guardarPropuesta
} from "../Service/PosponerService.js";

const fechaSugeridaInput = document.getElementById("fechaSugerida");
const formPosponer = document.getElementById("formPosponer");
const modalPropuestaEnviada = document.getElementById("modalPropuestaEnviada");
const btnCerrarModalPropuesta = document.getElementById("btn-cerrar-modal-propuesta");
const modalPropuestaFecha = document.getElementById("modalPropuestaFecha");
const modalPropuestaHora = document.getElementById("modalPropuestaHora");
const justificacionInput = document.getElementById("justificacionPosponer");
const parametros = new URLSearchParams(window.location.search);
const idCita = Number(parametros.get("id"));

//Impide seleccionar una fecha anterior al día actual.

if (fechaSugeridaInput) {
    fechaSugeridaInput.min = obtenerFechaActual();
}


//Procesa el formulario para posponer la solicitud.

if (formPosponer && modalPropuestaEnviada) {
    formPosponer.addEventListener("submit", async function(e) {
        e.preventDefault();

        if (!idCita) {
            alert("No se recibió el ID de la cita que desea posponer.");
            return;
        }

        const fecha = document.getElementById("fechaSugerida").value;
        const hora = document.getElementById("horaSugerida").value;
        const justificacion = justificacionInput.value.trim();
        const resultadoValidacion = validarPropuesta(fecha,hora);

        if (!resultadoValidacion.valido) {
            alert(resultadoValidacion.mensaje);
            return;
        }

        const propuesta = crearPropuesta(fecha, hora);

        try {
            await guardarPropuesta(idCita, fecha, hora, justificacion);
        } catch (error) {
            alert(error.message);
            return;
        }

        if (modalPropuestaFecha) {
            modalPropuestaFecha.textContent = propuesta.fecha;
        }

        if (modalPropuestaHora) {
            modalPropuestaHora.textContent = propuesta.hora;
        }

        modalPropuestaEnviada.classList.add("active");
    });
}


//Cierra el modal y regresa a las solicitudes.

if (btnCerrarModalPropuesta && modalPropuestaEnviada) {
    btnCerrarModalPropuesta.addEventListener(
        "click",
        function() {
            modalPropuestaEnviada.classList.remove("active");
            window.location.href = "solicitudes.html";
        }
    );
}
