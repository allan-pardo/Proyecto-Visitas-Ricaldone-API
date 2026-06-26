/*

Chicos esto lo dejare asi porque me falta terminarlo bien

*/

const mensajeVacio = document.getElementById("mensajeVacio");
const tablaHistorial = document.getElementById("tablaHistorial");
const cuerpoTablaCitas = document.getElementById("cuerpoTablaCitas");
const filtros = document.querySelectorAll('input[name="filtro"]');

const citas = [
  {
    fechaHora: "14/5/2026, 11:25 A.M",
    estudiante: "David Ramírez",
    motivo: "Bajo rendimiento académico",
    estado: "Pendiente"
  },
  {
    fechaHora: "15/5/2026, 9:00 A.M",
    estudiante: "María López",
    motivo: "Reunión con docente",
    estado: "Aprobado"
  },
  {
    fechaHora: "16/5/2026, 10:30 A.M",
    estudiante: "Carlos Hernández",
    motivo: "Permiso de salida",
    estado: "Rechazado"
  }
];

mostrarCitas(citas);

filtros.forEach(filtro => {
  filtro.addEventListener("change", function () {
    const estadoSeleccionado = this.value;

    if (estadoSeleccionado === "Todos") {
      mostrarCitas(citas);
    } else {
      const citasFiltradas = citas.filter(cita => cita.estado === estadoSeleccionado);
      mostrarCitas(citasFiltradas);
    }
  });
});

function mostrarCitas(lista) {
  cuerpoTablaCitas.innerHTML = "";

  if (lista.length === 0) {
    mensajeVacio.style.display = "block";
    tablaHistorial.style.display = "none";
    return;
  }

  mensajeVacio.style.display = "none";
  tablaHistorial.style.display = "block";

  lista.forEach(cita => {
    cuerpoTablaCitas.innerHTML += `
      <tr>
        <td>${cita.fechaHora}</td>
        <td>${cita.estudiante}</td>
        <td>${cita.motivo}</td>
        <td>
          <span class="estado-cita estado-${cita.estado.toLowerCase()}">
            ${cita.estado}
          </span>
        </td>
      </tr>
    `;
  });
}