import { validarCorreoInstitucional } from "./validaciones.js";
import { solicitarApi } from "./ApiService.js";

export { validarCorreoInstitucional };

export async function iniciarSesion(correo, contrasena) {
    if (!validarCorreoInstitucional(correo)) {
        return {
            exito: false,
            mensaje: "El correo debe terminar en @ricaldone.edu.sv."
        };
    }

    try {
        const [usuarios, empleados] = await Promise.all([
            solicitarApi("/usuarios"),
            solicitarApi("/empleados")
        ]);
        const usuarioPorCorreo = usuarios.find(
            registro => registro.usuEmail?.trim().toLowerCase() === correo
        );

        if (usuarioPorCorreo?.usuRol?.toUpperCase() === "ESTUDIANTE") {
            return {
                exito: false,
                mensaje: "No está permitido un estudiante en este sistema, retírese."
            };
        }

        const empleado = empleados.find(
            registro => registro.empCorreo?.trim().toLowerCase() === correo
        );

        if (!empleado || empleado.empClave !== contrasena) {
            return {
                exito: false,
                mensaje: "El correo o la clave del empleado son incorrectos."
            };
        }

        const usuario = usuarios.find(
            registro => Number(registro.idUsuario) === Number(empleado.usuarioEmpleado)
        );

        if (!usuario) {
            return {
                exito: false,
                mensaje: "El empleado no tiene un usuario asociado."
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
