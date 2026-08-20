import { solicitarApi } from "../../Docentes/Service/ApiService.js";

const ROLES_PERMITIDOS = [
  "ADMINISTRADOR",
  "COORDINADOR ACADÉMICO",
  "COORDINADOR TÉCNICO",
  "DOCENTE TÉCNICO",
  "DOCENTE ACADÉMICO",
  "RECEPCIONISTA"
];

function convertirEmpleado(empleado) {
  return {
    id: String(empleado.idEmpleado),
    nombre: empleado.empNombre,
    apellido: empleado.empApellido,
    clave: empleado.empClave,
    correo: empleado.empCorreo,
    rol: empleado.empRol,
    usuarioId: empleado.usuarioEmpleado
  };
}

function prepararDatos(datosEmpleado) {
  return {
    id: datosEmpleado.id ? Number(datosEmpleado.id) : null,
    nombre: datosEmpleado.nombre.trim(),
    apellido: datosEmpleado.apellido.trim(),
    clave: datosEmpleado.clave.trim(),
    correo: datosEmpleado.correo.trim().toLowerCase(),
    rol: datosEmpleado.rol.trim().toUpperCase()
  };
}

function crearDatosUsuario(datosEmpleado) {
  return {
    usuEmail: datosEmpleado.correo,
    usuPassword: datosEmpleado.clave,
    usuRol: "COLABORADOR"
  };
}

function crearDatosEmpleado(datosEmpleado, usuarioId) {
  return {
    empNombre: datosEmpleado.nombre,
    empApellido: datosEmpleado.apellido,
    empClave: datosEmpleado.clave,
    empCorreo: datosEmpleado.correo,
    empRol: datosEmpleado.rol,
    usuarioEmpleado: Number(usuarioId)
  };
}

async function validarCorreoDisponible(correo, idActual) {
  const empleados = await solicitarApi("/empleados");

  return !empleados.some(empleado =>
    empleado.empCorreo?.trim().toLowerCase() === correo &&
    Number(empleado.idEmpleado) !== Number(idActual)
  );
}

export async function obtenerEmpleados() {
  const empleados = await solicitarApi("/empleados");
  return empleados.map(convertirEmpleado);
}

export async function obtenerEmpleadoPorId(id) {
  const empleado = await solicitarApi(`/empleados/${id}`);
  return convertirEmpleado(empleado);
}

export async function guardarEmpleado(datosFormulario) {
  const datosEmpleado = prepararDatos(datosFormulario);

  if (!ROLES_PERMITIDOS.includes(datosEmpleado.rol)) {
    return {
      exito: false,
      mensaje: "Seleccione un rol permitido por el sistema."
    };
  }

  try {
    const correoDisponible = await validarCorreoDisponible(datosEmpleado.correo, datosEmpleado.id);

    if (!correoDisponible) {
      return {
        exito: false,
        mensaje: "Ya existe un empleado registrado con ese correo."
      };
    }

    if (datosEmpleado.id) {
      const empleadoAnterior = await solicitarApi(`/empleados/${datosEmpleado.id}`);
      const usuarioAnterior = await solicitarApi(`/usuarios/${empleadoAnterior.usuarioEmpleado}`);

      await solicitarApi(`/usuarios/${empleadoAnterior.usuarioEmpleado}`, {
        method: "PUT",
        body: JSON.stringify(crearDatosUsuario(datosEmpleado))
      });

      try {
        await solicitarApi(`/empleados/${datosEmpleado.id}`, {
          method: "PUT",
          body: JSON.stringify(crearDatosEmpleado(datosEmpleado, empleadoAnterior.usuarioEmpleado))
        });
      } catch (error) {
        try {
          await solicitarApi(`/usuarios/${empleadoAnterior.usuarioEmpleado}`, {
            method: "PUT",
            body: JSON.stringify({
              usuEmail: usuarioAnterior.usuEmail,
              usuPassword: usuarioAnterior.usuPassword,
              usuRol: usuarioAnterior.usuRol
            })
          });
        } catch (errorRestauracion) {
          console.error("No se pudo restaurar el usuario asociado.", errorRestauracion);
        }

        throw error;
      }

      return {
        exito: true,
        mensaje: "Empleado actualizado correctamente."
      };
    }

    const usuarioCreado = await solicitarApi("/usuarios", {
      method: "POST",
      body: JSON.stringify(crearDatosUsuario(datosEmpleado))
    });

    try {
      await solicitarApi("/empleados", {
        method: "POST",
        body: JSON.stringify(crearDatosEmpleado(datosEmpleado, usuarioCreado.idUsuario))
      });
    } catch (error) {
      try {
        await solicitarApi(`/usuarios/${usuarioCreado.idUsuario}`, {
          method: "DELETE"
        });
      } catch (errorLimpieza) {
        console.error("No se pudo eliminar el usuario creado durante la operación fallida.", errorLimpieza);
      }

      throw error;
    }

    return {
      exito: true,
      mensaje: "Empleado registrado correctamente."
    };
  } catch (error) {
    return {
      exito: false,
      mensaje: error.message
    };
  }
}

export async function eliminarEmpleado(id) {
  try {
    const empleado = await solicitarApi(`/empleados/${id}`);

    await solicitarApi(`/empleados/${id}`, {
      method: "DELETE"
    });

    try {
      await solicitarApi(`/usuarios/${empleado.usuarioEmpleado}`, {
        method: "DELETE"
      });
    } catch (error) {
      return {
        exito: true,
        tipo: "warning",
        mensaje: "El empleado fue eliminado, pero no se pudo eliminar su usuario asociado."
      };
    }

    return {
      exito: true,
      tipo: "success",
      mensaje: "Empleado eliminado correctamente."
    };
  } catch (error) {
    return {
      exito: false,
      tipo: "danger",
      mensaje: error.message
    };
  }
}
