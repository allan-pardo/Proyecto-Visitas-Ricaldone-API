import { iniciarSesionPersonal } from "../../AuthApiService.js";
import { validarCorreoInstitucional } from "./validaciones.js";

export { validarCorreoInstitucional };

export async function iniciarSesion(correo, contrasena) {
  if (!validarCorreoInstitucional(correo)) {
    return {
      exito: false,
      mensaje: "El correo debe terminar en @ricaldone.edu.sv."
    };
  }

  const resultado = await iniciarSesionPersonal(correo, contrasena);

  if (!resultado.exito) {
    return resultado;
  }

  const rol = String(resultado.datos?.rol || "").toUpperCase();

  if (rol !== "RECEPCIONISTA") {
    return {
      exito: false,
      mensaje: "Este acceso es exclusivo para recepcionistas."
    };
  }

  return {
    exito: true,
    redireccion: "index.html",
    sesion: {
      idRecepcionista: resultado.datos.idUsuario,
      correo: resultado.datos.email,
      rol
    }
  };
}
