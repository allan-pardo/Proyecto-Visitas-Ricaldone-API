import { obtenerSolicitudes } from "../Service/SolicitudesService.js";

const tablaSolicitudesBody = document.getElementById("txtTablaSolicitudesBody");
const idEmpleadoSesion = Number(sessionStorage.getItem("empleadoId"));

document.addEventListener("DOMContentLoaded", async () => {
  if (!idEmpleadoSesion) {
    window.location.replace("InicioSesion.html");
    return;
  }

  try {
    const solicitudes = await obtenerSolicitudes(idEmpleadoSesion);
    mostrarSolicitudes(solicitudes);
  } catch (error) {
    mostrarError(error.message);
  }
});

// Renderiza dinámicamente las solicitudes dentro de la tabla HTML.
function mostrarSolicitudes(listaSolicitudes) {
  if (!tablaSolicitudesBody) return;

  tablaSolicitudesBody.innerHTML = "";

  if (listaSolicitudes.length === 0) {
    tablaSolicitudesBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4">No hay solicitudes pendientes.</td>
      </tr>
    `;
    return;
  }

  listaSolicitudes.forEach(solicitud => {
    tablaSolicitudesBody.innerHTML += `
      <tr>
        <td>${solicitud.padre}</td>
        <td>${solicitud.estudiante}</td>
        <td>${solicitud.codigo}</td>
        <td>${solicitud.correo}</td>
        <td><a href="revisionSolicitud.html?id=${solicitud.id}" class="btn btn-warning">Revisar</a></td>
      </tr>
    `;
  });
}

function mostrarError(mensaje) {
  if (!tablaSolicitudesBody) return;

  tablaSolicitudesBody.innerHTML = `
    <tr>
      <td colspan="5" class="text-center text-danger py-4">${mensaje}</td>
    </tr>
  `;
}
