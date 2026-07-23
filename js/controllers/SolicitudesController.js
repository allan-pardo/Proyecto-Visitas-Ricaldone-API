import { obtenerSolicitudes } from "../services/SolicitudesService.js";

const tablaSolicitudesBody = document.getElementById("txtTablaSolicitudesBody");

document.addEventListener("DOMContentLoaded", () => {
  const solicitudes = obtenerSolicitudes();
  mostrarSolicitudes(solicitudes);
});

// Renderiza dinámicamente las solicitudes dentro de la tabla HTML
function mostrarSolicitudes(listaSolicitudes) {
  if (!tablaSolicitudesBody) return;

  tablaSolicitudesBody.innerHTML = "";

  listaSolicitudes.forEach(solicitud => {
    tablaSolicitudesBody.innerHTML += `
      <tr>
        <td>${solicitud.padre}</td>
        <td>${solicitud.estudiante}</td>
        <td>${solicitud.codigo}</td>
        <td>${solicitud.correo}</td>
        <td><a href="revisionSolicitud.html" class="btn btn-warning">Revisar</a></td>
      </tr>
    `;
  });
}
