 import { obtenerResumenCitas } from "../Service/InicioService.js";
import { obtenerIdDocenteActivo } from "../Service/ApiService.js";

const cantidadCitasHoy = document.getElementById("cantidadCitasHoy");
const cantidadCitasAprobadas = document.getElementById("cantidadCitasAprobadas");
const cantidadCitasPendientes = document.getElementById("cantidadCitasPendientes");

let idDocenteSesion = 0;

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {
  await cargarResumen();

  window.addEventListener("focus", cargarResumen);

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      cargarResumen();
    }
  });
}

async function cargarResumen() {
  try {
    if (!idDocenteSesion) {
      idDocenteSesion = await obtenerIdDocenteActivo();
    }

    const resumen = await obtenerResumenCitas(idDocenteSesion);

    escribir(cantidadCitasHoy, resumen.citasHoy);
    escribir(cantidadCitasAprobadas, resumen.aprobadas);
    escribir(cantidadCitasPendientes, resumen.pendientes);
  } catch (error) {
    console.error("No fue posible cargar el resumen de citas.", error);


    escribir(cantidadCitasHoy, "—");
    escribir(cantidadCitasAprobadas, "—");
    escribir(cantidadCitasPendientes, "—");
  }
}

function escribir(elemento, valor) {
  if (elemento) {
    elemento.textContent = valor;
  }
}