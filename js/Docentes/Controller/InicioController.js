import { obtenerResumenCitas } from "../Service/InicioService.js";

const idEmpleadoSesion = Number(sessionStorage.getItem("empleadoId"));

if (!sessionStorage.getItem("userCorreo") || !idEmpleadoSesion) {
    window.location.replace("InicioSesion.html");
} else {
    document.addEventListener("DOMContentLoaded", cargarResumen);
}

async function cargarResumen() {
    try {
        const resumen = await obtenerResumenCitas(idEmpleadoSesion);
        document.getElementById("cantidadCitasHoy").textContent = resumen.citasHoy;
        document.getElementById("cantidadCitasPendientes").textContent = resumen.pendientes;
    } catch (error) {
        document.getElementById("cantidadCitasHoy").textContent = "—";
        document.getElementById("cantidadCitasPendientes").textContent = "—";
    }
}
