const CLAVE_ALMACENAMIENTO = "empleadosAdministrados";

const empleadosIniciales = [
  {
    id: "1",
    nombre: "Carlos",
    apellido: "García López",
    clave: "cgarcia",
    correo: "carlos.garcia@ricaldone.edu.sv",
    rol: "Administrador"
  },
  {
    id: "2",
    nombre: "María",
    apellido: "Fernández Ruiz",
    clave: "mfernandez",
    correo: "maria.fernandez@ricaldone.edu.sv",
    rol: "Secretaría"
  },
  {
    id: "3",
    nombre: "José",
    apellido: "Martínez Pérez",
    clave: "jmartinez",
    correo: "jose.martinez@ricaldone.edu.sv",
    rol: "Docente"
  }
];

function guardarEmpleados(empleados) {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(empleados));
}

export function obtenerEmpleados() {
  const empleadosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);

  if (!empleadosGuardados) {
    guardarEmpleados(empleadosIniciales);
    return [...empleadosIniciales];
  }

  try {
    return JSON.parse(empleadosGuardados);
  } catch (error) {
    guardarEmpleados(empleadosIniciales);
    return [...empleadosIniciales];
  }
}

export function obtenerEmpleadoPorId(id) {
  return obtenerEmpleados().find(empleado => empleado.id === id);
}

export function guardarEmpleado(datosEmpleado) {
  const empleados = obtenerEmpleados();
  const idActual = datosEmpleado.id;
  const correoNormalizado = datosEmpleado.correo.trim().toLowerCase();
  const claveNormalizada = datosEmpleado.clave.trim().toLowerCase();

  const correoRepetido = empleados.some(empleado =>
    empleado.correo.toLowerCase() === correoNormalizado && empleado.id !== idActual
  );

  if (correoRepetido) {
    return {
      exito: false,
      mensaje: "Ya existe un empleado registrado con ese correo."
    };
  }

  const claveRepetida = empleados.some(empleado =>
    empleado.clave.toLowerCase() === claveNormalizada && empleado.id !== idActual
  );

  if (claveRepetida) {
    return {
      exito: false,
      mensaje: "Ya existe un empleado registrado con esa clave."
    };
  }

  const empleado = {
    id: idActual || Date.now().toString(),
    nombre: datosEmpleado.nombre.trim(),
    apellido: datosEmpleado.apellido.trim(),
    clave: datosEmpleado.clave.trim(),
    correo: correoNormalizado,
    rol: datosEmpleado.rol
  };

  if (idActual) {
    const indiceEmpleado = empleados.findIndex(item => item.id === idActual);

    if (indiceEmpleado === -1) {
      return {
        exito: false,
        mensaje: "No se encontró el empleado que desea actualizar."
      };
    }

    empleados[indiceEmpleado] = empleado;
  } else {
    empleados.push(empleado);
  }

  guardarEmpleados(empleados);

  return {
    exito: true,
    mensaje: idActual
      ? "Empleado actualizado correctamente."
      : "Empleado registrado correctamente."
  };
}

export function eliminarEmpleado(id) {
  const empleados = obtenerEmpleados();
  const empleadosActualizados = empleados.filter(empleado => empleado.id !== id);

  if (empleadosActualizados.length === empleados.length) {
    return {
      exito: false,
      mensaje: "No se encontró el empleado que desea eliminar."
    };
  }

  guardarEmpleados(empleadosActualizados);

  return {
    exito: true,
    mensaje: "Empleado eliminado correctamente."
  };
}
