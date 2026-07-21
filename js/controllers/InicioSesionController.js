import { iniciarSesion } from "../services/InicioSesionService.js";

const formInicioSesion = document.getElementById("loginForm");
const correoInput = document.getElementById("loginCorreo");
const contrasenaInput = document.getElementById("loginContrasena");

correoInput?.addEventListener("input", () => {
    const correoValido = /^[^@\s]+@ricaldone\.edu\.sv$/i.test(correoInput.value.trim());
    correoInput.setCustomValidity(
        correoInput.value && !correoValido
            ? "El correo debe terminar en @ricaldone.edu.sv"
            : ""
    );
});

contrasenaInput?.addEventListener("input", () => {
    contrasenaInput.setCustomValidity(
        contrasenaInput.value.length !== 8
            ? "La contraseña debe tener exactamente 8 caracteres"
            : ""
    );
});

if (formInicioSesion) {
    formInicioSesion.addEventListener("submit", function(e) {
        e.preventDefault();

        if (!formInicioSesion.checkValidity()) {
            formInicioSesion.reportValidity();
            return;
        }

        const resultado = iniciarSesion();

        if (resultado.exito) {
            alert(resultado.mensaje);
            window.location.href = resultado.redireccion;
        }
    });
}
