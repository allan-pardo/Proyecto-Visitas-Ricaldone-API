import {
    iniciarSesion,
    validarCorreoInstitucional
} from "../services/InicioSesionService.js";

const formInicioSesion = document.getElementById("loginForm");
const correoInput = document.getElementById("loginCorreo");
const contrasenaInput = document.getElementById("loginContrasena");

correoInput?.addEventListener("input", () => {
    const correoValido = validarCorreoInstitucional(correoInput.value);
    correoInput.setCustomValidity(
        correoInput.value && !correoValido
            ? "El correo debe terminar en @ricaldone.edu.sv"
            : ""
    );
});

contrasenaInput?.addEventListener("input", () => {
    contrasenaInput.setCustomValidity("");
});

if (formInicioSesion) {
    formInicioSesion.addEventListener("submit", function(e) {
        e.preventDefault();

        if (!formInicioSesion.checkValidity()) {
            formInicioSesion.reportValidity();
            return;
        }

        const correo = correoInput.value.trim().toLowerCase();
        const resultado = iniciarSesion(correo);

        if (resultado.exito) {
            sessionStorage.setItem("userCorreo", correo);
            window.location.href = resultado.redireccion;
        } else {
            correoInput.setCustomValidity(resultado.mensaje);
            correoInput.reportValidity();
        }
    });
}
