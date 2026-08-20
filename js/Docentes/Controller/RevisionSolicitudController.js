import {
  aceptarSolicitud,
  obtenerDetalleSolicitud
} from "../Service/RevisionSolicitudService.js";

const parametros = new URLSearchParams(window.location.search);
const idCita = Number(parametros.get("id"));
const btnAceptarSolicitud = document.getElementById("btnAceptarSolicitud");
const btnPosponerSolicitud = document.getElementById("btnPosponerSolicitud");
const modalSolicitudAceptada = document.getElementById("modalSolicitudAceptada");
const btnCerrarModal = document.getElementById("btnCerrarModal");
let detalleSolicitud = null;

btnAceptarSolicitud?.classList.add("disabled");

document.addEventListener("DOMContentLoaded", cargarSolicitud);

async function cargarSolicitud() {
  if (!idCita) {
    alert("No se recibió el ID de la solicitud.");
    window.location.replace("solicitudes.html");
    return;
  }

  try {
    detalleSolicitud = await obtenerDetalleSolicitud(idCita);
    mostrarDetalle(detalleSolicitud);
    btnPosponerSolicitud.href = `posponer.html?id=${idCita}`;
    btnAceptarSolicitud?.classList.remove("disabled");
  } catch (error) {
    console.error("No fue posible cargar el detalle de la solicitud.", error);
  }
}

function mostrarDetalle(detalle) {
  document.getElementById("tituloRevisionSolicitud").textContent =
    `Revisión de Detalles de Solicitud: ${detalle.solicitante}`;
  document.getElementById("detalleNombreEstudiante").textContent = detalle.estudiante;
  document.getElementById("detalleCorreoEstudiante").textContent = detalle.correo;
  document.getElementById("detalleCodigoEstudiante").textContent = detalle.codigo;
  document.getElementById("detalleFechaOriginal").textContent = detalle.fecha;
  document.getElementById("detalleMotivoSolicitud").textContent = detalle.motivo;
  document.getElementById("detalleHoraSolicitada").textContent = detalle.hora;
}

if (btnAceptarSolicitud && modalSolicitudAceptada) {
  btnAceptarSolicitud.addEventListener("click", async function(e) {
    e.preventDefault();
    btnAceptarSolicitud.classList.add("disabled");

    try {
      const resultado = await aceptarSolicitud(idCita);

      if (resultado.exito) {
        document.getElementById("modalSolicitudPersonas").textContent =
          `${detalleSolicitud.estudiante} y su encargado ${detalleSolicitud.solicitante} serán notificados`;
        document.getElementById("modalSolicitudFecha").textContent =
          `Reunión programada para el ${detalleSolicitud.fecha} a las ${detalleSolicitud.hora}`;
        modalSolicitudAceptada.classList.add("active");
      }
    } catch (error) {
      alert(error.message);
      btnAceptarSolicitud.classList.remove("disabled");
    }
  });
}

if (btnCerrarModal && modalSolicitudAceptada) {
  btnCerrarModal.addEventListener("click", function() {
    modalSolicitudAceptada.classList.remove("active");
    window.location.href = "solicitudes.html";
  });
}
