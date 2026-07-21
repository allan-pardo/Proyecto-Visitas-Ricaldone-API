import {
    aceptarSolicitud
} from "../services/RevisionSolicitudService.js";

const btnAceptarSolicitud = document.getElementById(
    "btnAceptarSolicitud"
);

const modalSolicitudAceptada = document.getElementById(
    "modalSolicitudAceptada"
);

const btnCerrarModal = document.getElementById(
    "btnCerrarModal"
);

if (btnAceptarSolicitud && modalSolicitudAceptada) {
    btnAceptarSolicitud.addEventListener("click", function(e) {
        e.preventDefault();

        const resultado = aceptarSolicitud();

        if (resultado.exito) {
            modalSolicitudAceptada.classList.add("active");
        }
    });
}

if (btnCerrarModal && modalSolicitudAceptada) {
    btnCerrarModal.addEventListener("click", function() {
        modalSolicitudAceptada.classList.remove("active");
        window.location.href = "solicitudes.html";
    });
}