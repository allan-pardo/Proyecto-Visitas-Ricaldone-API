import {
  obtenerCitas,
  obtenerEstudiantesEncargados,
  agregarCita,
  filtrarCitasPorEstado,
  validarDatosCita,
  formatearFechaEspanol,
  formatearHoraAMPM
} from "../Service/GestionCitasService.js";

const formCita = document.getElementById("formCita");
const mensajeVacio = document.getElementById("mensajeVacio");
const tablaHistorial = document.getElementById("contenedorTablaCitas");
const cuerpoTablaCitas = document.getElementById("cuerpoTablaCitas");
const filtros = document.querySelectorAll('input[name="filtro"]');
const fechaInput = document.getElementById("fechaCita");
const estudianteEncargadoSelect = document.getElementById("idEstudianteEncargado");
const asuntoInput = document.getElementById("asuntoCita");
const descripcionInput = document.getElementById("descripcionCita");

const modalCita = document.getElementById("modalCitaAgendada");
const btnCerrarModalCitas = document.getElementById("btn-cerrar-modal-citas");
const btnVerCitas = document.getElementById("btn-ver-citas");
const idEmpleadoSesion = Number(sessionStorage.getItem("empleadoId"));
const INTERVALO_ACTUALIZACION = 15000;
let actualizacionEnCurso = false;

// Configuración inicial.
configurarFechaMinima();
cargarDatosIniciales();

async function cargarDatosIniciales() {
  if (!idEmpleadoSesion) {
    window.location.replace("InicioSesion.html");
    return;
  }

  try {
    const [relaciones, listaCitas] = await Promise.all([
      obtenerEstudiantesEncargados(),
      obtenerCitas(idEmpleadoSesion)
    ]);

    cargarOpcionesEstudiantes(relaciones);
    mostrarCitas(listaCitas);
    configurarActualizacionAutomatica();
  } catch (error) {
    alert(error.message);
    mostrarCitas([]);
  }
}

function cargarOpcionesEstudiantes(relaciones) {
  if (!estudianteEncargadoSelect) {
    return;
  }

  estudianteEncargadoSelect.innerHTML = '<option value="">Seleccione estudiante</option>';

  relaciones.forEach(relacion => {
    const opcion = document.createElement("option");
    opcion.value = relacion.idEstudianteEncargado;
    opcion.textContent = relacion.nombreEstudiante;
    opcion.dataset.nombreEstudiante = relacion.nombreEstudiante;
    opcion.dataset.idEstudiante = relacion.idEstudiante;
    estudianteEncargadoSelect.appendChild(opcion);
  });
}

// Registramos las citas.
if (formCita) {
  formCita.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const datosCita = obtenerDatosFormulario();
    const resultadoValidacion = validarDatosCita(datosCita);

    if (!resultadoValidacion.valido) {
      alert(resultadoValidacion.mensaje);
      return;
    }

    const botonRegistrar = formCita.querySelector('button[type="submit"]');
    botonRegistrar.disabled = true;

    try {
      await agregarCita(datosCita, idEmpleadoSesion);
      mostrarConfirmacionCita(datosCita);

      formCita.reset();
      configurarFechaMinima();
      await actualizarHistorial();
    } catch (error) {
      alert(error.message);
    } finally {
      botonRegistrar.disabled = false;
    }
  });
}

// Obtiene los valores ingresados en el formulario.
function obtenerDatosFormulario() {
  const opcionEstudiante = estudianteEncargadoSelect.options[estudianteEncargadoSelect.selectedIndex];

  return {
    idEstudianteEncargado: estudianteEncargadoSelect.value,
    nombre: opcionEstudiante?.dataset.nombreEstudiante || "",
    fecha: document.getElementById("fechaCita").value,
    hora: document.getElementById("horaCita").value,
    asunto: asuntoInput.value.trim(),
    descripcion: descripcionInput.value.trim()
  };
}

// Coloca la fecha actual como fecha mínima permitida.
function configurarFechaMinima() {
  if (!fechaInput) {
    return;
  }

  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  fechaInput.min = `${anio}-${mes}-${dia}`;
}

// Ayuda a rellenar y abrir el modal de confirmación.
function mostrarConfirmacionCita(datosCita) {
  const modalNombre = document.getElementById("modalNombreEstudiante");
  const modalDetalle = document.getElementById("modalDetalleFechaHora");
  const fechaFormateada = formatearFechaEspanol(datosCita.fecha);
  const horaFormateada = formatearHoraAMPM(datosCita.hora);

  if (modalNombre) {
    modalNombre.textContent = datosCita.nombre;
  }

  if (modalDetalle) {
    modalDetalle.textContent =
      `Sobre la convocatoria, el día ${fechaFormateada} ` +
      `a las ${horaFormateada}.`;
  }

  if (modalCita) {
    modalCita.classList.add("active");
  }
}

// Cierra el modal de confirmación.
if (btnCerrarModalCitas && modalCita) {
  btnCerrarModalCitas.addEventListener("click", function () {
    modalCita.classList.remove("active");
  });
}

// Cierra el modal y abre la pestaña Historial.
if (btnVerCitas && modalCita) {
  btnVerCitas.addEventListener("click", function () {
    modalCita.classList.remove("active");

    const botonHistorial = document.querySelector('[data-bs-target="#historialCitas"]');

    if (botonHistorial) {
      const tabHistorial = new bootstrap.Tab(botonHistorial);
      tabHistorial.show();
    }
  });
}

// Nos ayuda a filtrar las citas por su estado.
filtros.forEach(filtro => {
  filtro.addEventListener("change", function () {
    const citasFiltradas = filtrarCitasPorEstado(this.value);
    mostrarCitas(citasFiltradas);
  });
});

// Mantiene el historial sincronizado cuando el encargado responde desde mobile.
async function actualizarHistorial(mostrarError = true) {
  if (actualizacionEnCurso || !idEmpleadoSesion) {
    return;
  }

  actualizacionEnCurso = true;

  try {
    await obtenerCitas(idEmpleadoSesion);
    const filtroActivo = document.querySelector('input[name="filtro"]:checked')?.value || "Todos";
    mostrarCitas(filtrarCitasPorEstado(filtroActivo));
  } catch (error) {
    if (mostrarError) {
      alert(error.message);
    } else {
      console.error("No fue posible actualizar el historial de citas.", error);
    }
  } finally {
    actualizacionEnCurso = false;
  }
}

function configurarActualizacionAutomatica() {
  window.addEventListener("focus", () => actualizarHistorial(false));

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      actualizarHistorial(false);
    }
  });

  window.setInterval(() => {
    if (!document.hidden) {
      actualizarHistorial(false);
    }
  }, INTERVALO_ACTUALIZACION);
}

// Mostrará las citas en el historial de citas.
function mostrarCitas(listaCitas) {
  cuerpoTablaCitas.innerHTML = "";

  if (listaCitas.length === 0) {
    mensajeVacio.style.display = "block";
    tablaHistorial.style.display = "none";
    return;
  }

  mensajeVacio.style.display = "none";
  tablaHistorial.style.display = "block";

  listaCitas.forEach(cita => {
    cuerpoTablaCitas.innerHTML += `
      <tr>
        <td>${escaparHtml(cita.fecha)}</td>
        <td>${escaparHtml(cita.hora)}</td>
        <td>${escaparHtml(cita.estudiante)}</td>
        <td>${escaparHtml(cita.asunto)}</td>
        <td>
          <span class="estado-cita estado-${escaparHtml(cita.estado.toLowerCase())}">
            ${escaparHtml(cita.estado)}
          </span>
        </td>
      </tr>
    `;
  });
}

function escaparHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
