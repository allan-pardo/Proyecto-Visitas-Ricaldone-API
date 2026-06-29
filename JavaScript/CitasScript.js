/*

Chicos esto lo dejare asi porque me falta terminarlo bien

*/

const formCita = document.getElementById("formCita");
/*Esta declaracion nos permitira que cuando no tenga datos de alguna cita, salga un mensaje*/
const mensajeVacio = document.getElementById("mensajeVacio");
const tablaHistorial = document.getElementById("tablaHistorial");
const cuerpoTablaCitas = document.getElementById("cuerpoTablaCitas");
const filtros = document.querySelectorAll('input[name="filtro"]');

let citas = [];

formCita.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreEstudiante").value.trim();
  const fecha = document.getElementById("fechaCita").value;
  const hora = document.getElementById("horaCita").value;
  const motivo = document.getElementById("motivoCita").value;
  const observaciones = document.getElementById("observaciones").value.trim();

  if (nombre === "" || fecha === "" || motivo === "") {
    alert("Complete los campos obligatorios.");
    return;
  }

  const nuevaCita = {
    fechaHora: `${fecha}, ${hora}`,
    estudiante: nombre,
    motivo: motivo,
    observaciones: observaciones,
    estado: "Pendiente"
  };

  citas.push(nuevaCita);

  formCita.reset();

  mostrarCitas(citas);
});

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