import {
  obtenerCitas, agregarCita, filtrarCitasPorEstado, validarDatosCita, formatearFechaEspanol, formatearHoraAMPM} 
  from "../services/GestionCitasService.js";

const formCita = document.getElementById("formCita");
const mensajeVacio = document.getElementById("mensajeVacio");
const tablaHistorial = document.getElementById("contenedorTablaCitas");
const cuerpoTablaCitas = document.getElementById("cuerpoTablaCitas");
const filtros = document.querySelectorAll('input[name="filtro"]');
const fechaInput = document.getElementById("fechaCita");

const modalCita = document.getElementById("modalCitaAgendada");
const btnCerrarModalCitas = document.getElementById(
  "btn-cerrar-modal-citas"
);
const btnVerCitas = document.getElementById("btn-ver-citas");

//Configuracion inicial
configurarFechaMinima();
mostrarCitas(obtenerCitas());

//Registramos las citas
if (formCita) {
  formCita.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const datosCita = obtenerDatosFormulario();
    const resultadoValidacion = validarDatosCita(datosCita);

    if (!resultadoValidacion.valido) {
      alert(resultadoValidacion.mensaje);
      return;
    }

    agregarCita(datosCita);

    mostrarConfirmacionCita(datosCita);

    formCita.reset();
    contenedorOtroMotivo?.classList.add("d-none");
    configurarFechaMinima();
    mostrarCitas(obtenerCitas());
  });
}

const motivoSelect = document.getElementById("motivoCita");
const contenedorOtroMotivo = document.getElementById("contenedorOtroMotivo");
const otroMotivoInput = document.getElementById("otroMotivo");

motivoSelect?.addEventListener("change", function () {
  if (this.value === "Otro") {
    contenedorOtroMotivo?.classList.remove("d-none");
    otroMotivoInput.setAttribute("required", "required");
  } else {
    contenedorOtroMotivo?.classList.add("d-none");
    otroMotivoInput.removeAttribute("required");
    otroMotivoInput.value = "";
  }
});

//Obtiene los valores ingresados en el formulario
function obtenerDatosFormulario() {
  const motivoSeleccionado = motivoSelect.value;
  const motivoFinal = motivoSeleccionado === "Otro" ? otroMotivoInput.value.trim() : motivoSeleccionado;

  return {
    nombre: document
      .getElementById("nombreEstudiante")
      .value
      .trim(),

    fecha: document.getElementById("fechaCita").value,

    hora: document.getElementById("horaCita").value,

    motivo: motivoFinal,

    observaciones: document
      .getElementById("observaciones")
      .value
      .trim()
  };
}

//Coloca la fecha actual como fecha mínima permitida.

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

//Ayuda a rellenar y abrir el modal de confirmacion
function mostrarConfirmacionCita(datosCita) {
  const modalNombre = document.getElementById(
    "modalNombreEstudiante"
  );

  const modalDetalle = document.getElementById(
    "modalDetalleFechaHora"
  );

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

//Cierra el modal de confirmacion.

if (btnCerrarModalCitas && modalCita) {
  btnCerrarModalCitas.addEventListener("click", function () {
    modalCita.classList.remove("active");
  });
}


//Cierra el modal y abre la pestaña Historial.

if (btnVerCitas && modalCita) {
  btnVerCitas.addEventListener("click", function () {
    modalCita.classList.remove("active");

    const botonHistorial = document.querySelector(
      '[data-bs-target="#historialCitas"]'
    );

    if (botonHistorial) {
      const tabHistorial = new bootstrap.Tab(botonHistorial);
      tabHistorial.show();
    }
  });
}

//nos ayuda a filtrar las citas pos su estado

filtros.forEach(filtro => {
  filtro.addEventListener("change", function () {
    const citasFiltradas = filtrarCitasPorEstado(this.value);
    mostrarCitas(citasFiltradas);
  });
});

//Mostrara las citas en el historial de citas

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
