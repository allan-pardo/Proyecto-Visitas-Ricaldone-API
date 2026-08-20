import { obtenerResumenCitas } from "../Service/InicioService.js";
import { obtenerIdEmpleadoActivo } from "../Service/ApiService.js";

document.addEventListener("DOMContentLoaded", cargarResumen);

async function cargarResumen() {
    try {
        const idEmpleadoSesion = await obtenerIdEmpleadoActivo();
        const resumen = await obtenerResumenCitas(idEmpleadoSesion);
        document.getElementById("cantidadCitasHoy").textContent = resumen.citasHoy;
        document.getElementById("cantidadCitasPendientes").textContent = resumen.pendientes;
    } catch (error) {
        document.getElementById("cantidadCitasHoy").textContent = "—";
        document.getElementById("cantidadCitasPendientes").textContent = "—";
    }
}
