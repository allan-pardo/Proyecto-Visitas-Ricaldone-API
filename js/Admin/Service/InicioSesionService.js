import { iniciarSesionPersonal } from "../../AuthApiService.js";

export function validarCorreoAdministrador(correo) {
  return /^[^@\s]+@ricaldone\.edu\.sv$/i.test(correo.trim());
}

export async function iniciarSesionAdministrador(correo, contrasena) {
  const correoNormalizado = correo.trim().toLowerCase();

  if (!validarCorreoAdministrador(correoNormalizado)) {
    return {
      exito: false,
      mensaje: "El correo debe terminar en @ricaldone.edu.sv."
    };
  }

  const resultado = await iniciarSesionPersonal(correoNormalizado, contrasena);

  if (!resultado.exito) {
    return resultado;
  }

  const rol = String(resultado.datos?.rol || "").toUpperCase();

  if (rol !== "ADMINISTRADOR") {
    return {
      exito: false,
      mensaje: "Este acceso es exclusivo para administradores."
    };
  }

  return {
    exito: true,
    sesion: {
      idAdministrador: resultado.datos.idUsuario,
      correo: resultado.datos.email,
      rol
    }
  };
}

export function guardarSesionAdministrador(sesion) {
  sessionStorage.setItem("adminId", sesion.idAdministrador);
  sessionStorage.setItem("adminCorreo", sesion.correo);
  sessionStorage.setItem("adminRol", sesion.rol);
  sessionStorage.setItem("adminSesionActiva", "true");
}
