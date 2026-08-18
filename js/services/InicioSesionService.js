import { validarCorreoInstitucional } from "../validaciones/validaciones.js";

export { validarCorreoInstitucional };

export function iniciarSesion(correo) {
    if (!validarCorreoInstitucional(correo)) {
        return {
            exito: false,
            mensaje: "El correo debe terminar en @ricaldone.edu.sv"
        };
    }

    return {
        exito: true,
        mensaje: "Iniciando sesión...",
        redireccion: "index.html"
    };
}
