import { AUTH_BASE_URL } from "./config.js";

// El sitio web solo usa el login de personal (admin, docente,
// recepcionista); el de encargado es exclusivo de la app movil.
export async function iniciarSesionPersonal(correo, contrasena) {
  let respuesta;

  try {
    respuesta = await fetch(`${AUTH_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ email: correo, password: contrasena })
    });
  } catch (error) {
    return {
      exito: false,
      mensaje: "No fue posible conectar con el servicio de autenticación. Verifique que esté ejecutándose en el puerto 8081."
    };
  }

  const contenido = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    return {
      exito: false,
      // La API-AUTH devuelve el detalle del error en "mensaje" (ApiErrorDTO), no en "message".
      mensaje: contenido?.mensaje || contenido?.message || "El correo o la contraseña son incorrectos."
    };
  }

  return { exito: true, datos: contenido?.data };
}
