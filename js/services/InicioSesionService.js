export function validarCorreoInstitucional(correo) {
    return /^[^@\s]+@ricaldone\.edu\.sv$/i.test(correo.trim());
}

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
