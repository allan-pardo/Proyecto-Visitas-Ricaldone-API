import {
  filtrarCitas,
  obtenerCitasRecepcionista
} from "../Service/InicioService.js";

const INTERVALO_ACTUALIZACION = 60_000;
const vistas = {
  pendientes: crearVista({
    seccionId: "CitasPendientes",
    tablaId: "tablaCitasPendientes",
    cuerpoId: "cuerpoTablaCitasPendientes",
    mensajeId: "mensajeVacioPendientes",
    nombreFiltro: "filtroPendientes",
    mensajeVacio: "No hay citas pendientes desde este momento en adelante."
  }),
  concluidas: crearVista({
    seccionId: "CitasConcluidas",
    tablaId: "tablaCitas",
    cuerpoId: "cuerpoTablaCitas",
    mensajeId: "mensajeVacio",
    nombreFiltro: "filtro",
    mensajeVacio: "No hay citas concluidas dentro de las últimas dos semanas."
  })
};

let citasPendientes = [];
let citasConcluidas = [];
let cargaEnCurso = false;

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {
  configurarEventos(vistas.pendientes, () => actualizarVistaPendientes());
  configurarEventos(vistas.concluidas, () => actualizarVistaConcluidas());
  cargarCitas();

  window.addEventListener("focus", () => cargarCitas({ silencioso: true }));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      cargarCitas({ silencioso: true });
    }
  });
  window.setInterval(() => {
    if (!document.hidden) {
      cargarCitas({ silencioso: true });
    }
  }, INTERVALO_ACTUALIZACION);
}

async function cargarCitas({ silencioso = false } = {}) {
  if (cargaEnCurso) {
    return;
  }

  cargaEnCurso = true;

  try {
    const resultado = await obtenerCitasRecepcionista();
    citasPendientes = resultado.pendientes;
    citasConcluidas = resultado.concluidas;
    actualizarVistaPendientes();
    actualizarVistaConcluidas();

    if (resultado.invalidas > 0) {
      console.warn(
        `${resultado.invalidas} cita(s) no se mostraron porque su fecha u hora no es válida.`
      );
    }

    if (resultado.limpieza.errores.length > 0) {
      console.warn(
        "No se pudieron eliminar algunas citas que superaron las dos semanas.",
        resultado.limpieza.errores
      );
    }
  } catch (error) {
    console.error("No fue posible cargar las citas de recepción.", error);

    if (!silencioso) {
      mostrarError(vistas.pendientes, error.message);
      mostrarError(vistas.concluidas, error.message);
    }
  } finally {
    cargaEnCurso = false;
  }
}

function crearVista({
  seccionId,
  tablaId,
  cuerpoId,
  mensajeId,
  nombreFiltro,
  mensajeVacio
}) {
  const seccion = document.getElementById(seccionId);

  return {
    seccion,
    tabla: document.getElementById(tablaId),
    cuerpo: document.getElementById(cuerpoId),
    mensaje: document.getElementById(mensajeId),
    buscador: seccion?.querySelector('input[type="search"]'),
    filtros: seccion?.querySelectorAll(`input[name="${nombreFiltro}"]`) || [],
    mensajeVacio
  };
}

function configurarEventos(vista, actualizar) {
  vista.buscador?.addEventListener("input", actualizar);
  vista.filtros.forEach(filtro => filtro.addEventListener("change", actualizar));
}

function actualizarVistaPendientes() {
  mostrarCitas(
    vistas.pendientes,
    aplicarFiltros(vistas.pendientes, citasPendientes)
  );
}

function actualizarVistaConcluidas() {
  mostrarCitas(
    vistas.concluidas,
    aplicarFiltros(vistas.concluidas, citasConcluidas)
  );
}

function aplicarFiltros(vista, citas) {
  const estado = [...vista.filtros].find(filtro => filtro.checked)?.value || "Todos";

  return filtrarCitas(citas, {
    texto: vista.buscador?.value || "",
    estado
  });
}

function mostrarCitas(vista, citas) {
  if (!vista.tabla || !vista.cuerpo || !vista.mensaje) {
    return;
  }

  vista.cuerpo.replaceChildren();

  if (citas.length === 0) {
    vista.tabla.style.display = "none";
    vista.mensaje.style.display = "block";
    vista.mensaje.querySelector("p").textContent = vista.mensajeVacio;
    return;
  }

  const fragmento = document.createDocumentFragment();

  citas.forEach(cita => {
    const fila = document.createElement("tr");
    fila.dataset.estado = cita.estado;
    fila.title = `Estado: ${cita.estado}`;

    [cita.docente, cita.estudiante, cita.motivo, cita.fecha, cita.hora]
      .forEach(valor => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.appendChild(celda);
      });

    fragmento.appendChild(fila);
  });

  vista.cuerpo.appendChild(fragmento);
  vista.mensaje.style.display = "none";
  vista.tabla.style.display = "table";
}

function mostrarError(vista, mensaje) {
  if (!vista.tabla || !vista.mensaje) {
    return;
  }

  vista.tabla.style.display = "none";
  vista.mensaje.style.display = "block";
  vista.mensaje.querySelector("p").textContent =
    mensaje || "No fue posible cargar las citas.";
}
