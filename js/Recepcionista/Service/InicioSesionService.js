import { solicitarApi } from "../../Docentes/Service/ApiService.js";
import { validarCorreoInstitucional } from "./validaciones.js";

export { validarCorreoInstitucional };

export async function iniciarSesion(correo, contrasena) {
  if (!validarCorreoInstitucional(correo)) {
    return {
      exito: false,
      mensaje: "El correo debe terminar en @ricaldone.edu.sv."
    };
  }

  try {
    const recepcionista = await solicitarApi("/recepcionistas/inicio-sesion", {
      method: "POST",
      body: JSON.stringify({
        recCorreo: correo,
        recPassword: contrasena
      })
    });

    if (recepcionista.recRol?.toUpperCase() !== "RECEPCIONISTA") {
      return {
        exito: false,
        mensaje: "Este acceso es exclusivo para recepcionistas."
      };
    }

    return {
      exito: true,
      redireccion: "index.html",
      sesion: {
        idRecepcionista: recepcionista.idRecepcionista,
        correo: recepcionista.recCorreo,
        nombre: `${recepcionista.recNombre} ${recepcionista.recApellido}`.trim(),
        rolRecepcionista: recepcionista.recRol
      }
    };
  } catch (error) {
    return {
      exito: false,
      mensaje: error.message
    };
  }
}
