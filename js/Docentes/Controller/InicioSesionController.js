import {
    iniciarSesion,
    validarCorreoInstitucional
} from "../Service/InicioSesionService.js";

const formInicioSesion = document.getElementById("loginForm");
const correoInput = document.getElementById("loginCorreo");
const contrasenaInput = document.getElementById("loginContrasena");

correoInput?.addEventListener("input", () => {
    const correoValido = validarCorreoInstitucional(correoInput.value);
    correoInput.setCustomValidity(
        correoInput.value && !correoValido
            ? "Ingrese un correo institucional de colaborador sin números."
            : ""
    );
});

contrasenaInput?.addEventListener("input", () => {
    contrasenaInput.setCustomValidity("");
});

if (formInicioSesion) {
    formInicioSesion.addEventListener("submit", async function(e) {
        e.preventDefault();

        correoInput.setCustomValidity("");
        contrasenaInput.setCustomValidity("");

        if (!formInicioSesion.checkValidity()) {
            formInicioSesion.reportValidity();
            return;
        }

        const correo = correoInput.value.trim().toLowerCase();
        const contrasena = contrasenaInput.value;
        const botonIngresar = formInicioSesion.querySelector('button[type="submit"]');

        botonIngresar.disabled = true;
        const resultado = await iniciarSesion(correo, contrasena);
        botonIngresar.disabled = false;

        if (resultado.exito) {
            sessionStorage.setItem("userCorreo", resultado.sesion.correo);
            sessionStorage.setItem("userId", resultado.sesion.idUsuario);
            sessionStorage.setItem("empleadoId", resultado.sesion.idEmpleado);
            sessionStorage.setItem("userNombre", resultado.sesion.nombre);
            sessionStorage.setItem("userRol", resultado.sesion.rolEmpleado);
            window.location.href = resultado.redireccion;
        } else {
            contrasenaInput.setCustomValidity(resultado.mensaje);
            contrasenaInput.reportValidity();
        }
    });
}
