import {
  guardarSesionAdministrador,
  iniciarSesionAdministrador,
  validarCorreoAdministrador
} from "../Service/InicioSesionService.js";

const formInicioSesionAdmin = document.getElementById("loginAdminForm");
const correoAdminInput = document.getElementById("loginAdminCorreo");
const contrasenaAdminInput = document.getElementById("loginAdminContrasena");

correoAdminInput?.addEventListener("input", function () {
  const correoValido = validarCorreoAdministrador(correoAdminInput.value);

  correoAdminInput.setCustomValidity(
    correoAdminInput.value && !correoValido
      ? "El correo debe terminar en @ricaldone.edu.sv."
      : ""
  );
});

contrasenaAdminInput?.addEventListener("input", function () {
  contrasenaAdminInput.setCustomValidity("");
});

formInicioSesionAdmin?.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  correoAdminInput.setCustomValidity("");
  contrasenaAdminInput.setCustomValidity("");

  if (!validarCorreoAdministrador(correoAdminInput.value)) {
    correoAdminInput.setCustomValidity("El correo debe terminar en @ricaldone.edu.sv.");
  }

  if (!formInicioSesionAdmin.checkValidity()) {
    formInicioSesionAdmin.reportValidity();
    return;
  }

  const botonIngresar = formInicioSesionAdmin.querySelector('button[type="submit"]');

  botonIngresar.disabled = true;
  const resultado = await iniciarSesionAdministrador(
    correoAdminInput.value,
    contrasenaAdminInput.value
  );
  botonIngresar.disabled = false;

  if (!resultado.exito) {
    contrasenaAdminInput.setCustomValidity(resultado.mensaje);
    contrasenaAdminInput.reportValidity();
    return;
  }

  guardarSesionAdministrador(resultado.sesion);
  window.location.href = "index.html";
});
