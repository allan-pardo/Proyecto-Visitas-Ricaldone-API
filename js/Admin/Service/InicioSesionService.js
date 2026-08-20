export function validarCorreoAdministrador(correo) {
  return /^[^@\s]+@ricaldone\.edu\.sv$/i.test(correo.trim());
}

function obtenerNombreDesdeCorreo(correo) {
  const nombreCorreo = correo.split("@")[0];

  return nombreCorreo
    .split(/[._-]+/)
    .filter(Boolean)
    .map(parte => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase())
    .join(" ");
}

export function iniciarSesionAdministrador(correo, contrasena) {
  const correoNormalizado = correo.trim().toLowerCase();

  if (!validarCorreoAdministrador(correoNormalizado)) {
    return {
      exito: false,
      mensaje: "El correo debe terminar en @ricaldone.edu.sv."
    };
  }

  if (contrasena.length === 0) {
    return {
      exito: false,
      mensaje: "Ingrese una contraseña."
    };
  }

  return {
    exito: true,
    sesion: {
      correo: correoNormalizado,
      nombre: obtenerNombreDesdeCorreo(correoNormalizado),
      rol: "ADMINISTRADOR"
    }
  };
}

export function guardarSesionAdministrador(sesion) {
  sessionStorage.setItem("adminSesionActiva", "true");
  sessionStorage.setItem("adminCorreo", sesion.correo);
  sessionStorage.setItem("adminNombre", sesion.nombre);
  sessionStorage.setItem("adminRol", sesion.rol);
}
