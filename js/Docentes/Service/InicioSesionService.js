import { validarCorreoInstitucional } from "./validaciones.js";
import { solicitarApi } from "./ApiService.js";

export { validarCorreoInstitucional };

export async function iniciarSesion(correo, contrasena) {
    if (!validarCorreoInstitucional(correo)) {
        return {
            exito: false,
            mensaje: "Ingrese un correo institucional de colaborador sin números."
        };
    }

    try {
        const usuarios = await solicitarApi("/usuarios");
        const usuario = usuarios.find(
            registro => registro.usuEmail?.trim().toLowerCase() === correo
        );

        if (!usuario || usuario.usuPassword !== contrasena) {
            return {
                exito: false,
                mensaje: "El correo o la contraseña son incorrectos."
            };
        }

        if (usuario.usuRol?.toUpperCase() === "ESTUDIANTE") {
            return {
                exito: false,
                mensaje: "No está permitido un estudiante en este sistema, retírese."
            };
        }

        const empleados = await solicitarApi("/empleados");
        const empleado = empleados.find(registro =>
            Number(registro.usuarioEmpleado) === Number(usuario.idUsuario) ||
            registro.empCorreo?.trim().toLowerCase() === correo
        );

        if (!empleado) {
            return {
                exito: false,
                mensaje: "El usuario no tiene un empleado asociado."
            };
        }

        const esAdministrador = empleado.empRol?.toUpperCase() === "ADMINISTRADOR";

        return {
            exito: true,
            redireccion: esAdministrador ? "../Admin/index.html" : "index.html",
            sesion: {
                idUsuario: usuario.idUsuario,
                idEmpleado: empleado.idEmpleado,
                correo: empleado.empCorreo,
                nombre: `${empleado.empNombre} ${empleado.empApellido}`.trim(),
                rolUsuario: usuario.usuRol,
                rolEmpleado: empleado.empRol
            }
        };
    } catch (error) {
        return {
            exito: false,
            mensaje: error.message
        };
    }

}
