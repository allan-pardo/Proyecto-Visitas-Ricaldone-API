import { iniciarSesion } from "../services/InicioSesionService.js";

const formInicioSesion = document.getElementById("loginForm");

if (formInicioSesion) {
    formInicioSesion.addEventListener("submit", function(e) {
        e.preventDefault();

        const resultado = iniciarSesion();

        if (resultado.exito) {
            alert(resultado.mensaje);
            window.location.href = resultado.redireccion;
        }
    });
}