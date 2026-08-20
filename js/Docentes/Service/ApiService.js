const hostApi = ["", "localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "localhost"
  : window.location.hostname;

export const API_BASE_URL = `http://${hostApi}:8080/api/v1`;

export async function solicitarApi(ruta, opciones = {}) {
  const configuracion = {
    ...opciones,
    headers: {
      Accept: "application/json",
      ...(opciones.body ? { "Content-Type": "application/json" } : {}),
      ...opciones.headers
    }
  };

  let respuesta;

  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, configuracion);
  } catch (error) {
    throw new Error(
      "No se pudo conectar con la API. Compruebe que esté ejecutándose en el puerto 8080."
    );
  }

  const tipoContenido = respuesta.headers.get("content-type") || "";
  const contenido = tipoContenido.includes("json")
    ? await respuesta.json()
    : null;

  if (!respuesta.ok) {
    throw new Error(
      contenido?.message ||
      contenido?.detail ||
      contenido?.error ||
      `La API respondió con el estado ${respuesta.status}.`
    );
  }

  if (contenido && Object.prototype.hasOwnProperty.call(contenido, "data")) {
    return contenido.data;
  }

  return contenido;
}

// Permite utilizar el frontend durante las pruebas sin pasar por el inicio de sesión.
// Si existe una sesión conserva su empleado; de lo contrario usa el primer docente de la API.
export async function obtenerEmpleadoActivo() {
  const idEmpleadoSesion = Number(sessionStorage.getItem("empleadoId"));

  if (idEmpleadoSesion) {
    try {
      return await solicitarApi(`/empleados/${idEmpleadoSesion}`);
    } catch (error) {
      // Si la sesión guardada ya no existe, continúa con un empleado disponible.
    }
  }

  const empleados = await solicitarApi("/empleados");
  const listaEmpleados = Array.isArray(empleados) ? empleados : [];
  const empleado = listaEmpleados.find(registro =>
    registro.empRol?.trim().toUpperCase().includes("DOCENTE")
  ) || listaEmpleados[0];

  if (!empleado) {
    throw new Error("La API no tiene empleados disponibles para ejecutar el modo de prueba.");
  }

  return empleado;
}

export async function obtenerIdEmpleadoActivo() {
  const empleado = await obtenerEmpleadoActivo();
  return Number(empleado.idEmpleado);
}
