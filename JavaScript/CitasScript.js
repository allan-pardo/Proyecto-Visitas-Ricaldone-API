
const formCita = document.getElementById("formCita");
const mensajeVacio = document.getElementById("mensajeVacio");
const tablaHistorial = document.getElementById("contenedorTablaCitas");
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

// Configurar fecha mínima (hoy) para evitar fechas pasadas
const fechaInput = document.getElementById("fechaCita");
if (fechaInput) {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  fechaInput.min = `${anio}-${mes}-${dia}`;
}

mostrarCitas(citas);

formCita.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombreEstudiante").value.trim();
  const fecha = document.getElementById("fechaCita").value;
  const hora = document.getElementById("horaCita").value;
  const motivo = document.getElementById("motivoCita").value;
  const observaciones = document.getElementById("observaciones").value.trim();

  // Validar que todos los campos requeridos estén llenos
  if (nombre === "" || fecha === "" || hora === "" || motivo === "") {
    alert("Complete todos los campos obligatorios.");
    return;
  }

  // Validar que la fecha no sea en el pasado
  const selectedDate = new Date(fecha + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    alert("La fecha no puede ser en el pasado.");
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

  // Re-establecer el atributo min después de resetear el formulario
  if (fechaInput) {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    fechaInput.min = `${anio}-${mes}-${dia}`;
  }

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