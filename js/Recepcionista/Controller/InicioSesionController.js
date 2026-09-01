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
      ? "El correo debe terminar en @ricaldone.edu.sv."
      : ""
  );
});

contrasenaInput?.addEventListener("input", () => {
  contrasenaInput.setCustomValidity("");
});

if (formInicioSesion) {
  formInicioSesion.addEventListener("submit", async function (evento) {
    evento.preventDefault();

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
      sessionStorage.setItem("userRol", resultado.sesion.rol);
      sessionStorage.setItem("recepcionistaId", resultado.sesion.idRecepcionista);
      window.location.href = resultado.redireccion;
    } else {
      contrasenaInput.setCustomValidity(resultado.mensaje);
      contrasenaInput.reportValidity();
    }
  });
}
