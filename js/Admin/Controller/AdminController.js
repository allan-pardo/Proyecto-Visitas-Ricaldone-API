import {
  eliminarEmpleado,
  guardarEmpleado,
  obtenerEmpleadoPorId,
  obtenerEmpleados
} from "../Service/AdminService.js";

const formEmpleado = document.getElementById("formEmpleado");
const empleadoIdInput = document.getElementById("empleadoId");
const nombreEmpleadoInput = document.getElementById("nombreEmpleado");
const apellidoEmpleadoInput = document.getElementById("apellidoEmpleado");
const claveEmpleadoInput = document.getElementById("claveEmpleado");
const correoEmpleadoInput = document.getElementById("correoEmpleado");
const rolEmpleadoInput = document.getElementById("rolEmpleado");
const tablaEmpleadosBody = document.getElementById("tablaEmpleadosBody");
const tituloFormularioEmpleado = document.getElementById("tituloFormularioEmpleado");
const btnGuardarEmpleado = document.getElementById("btnGuardarEmpleado");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
const btnRecargarEmpleados = document.getElementById("btnRecargarEmpleados");
const mensajeEmpleado = document.getElementById("mensajeEmpleado");

function mostrarMensaje(mensaje, tipo) {
  mensajeEmpleado.textContent = mensaje;
  mensajeEmpleado.className = `alert alert-${tipo}`;
}

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function crearBotonAccion(texto, icono, clase, accion, id) {
  const boton = document.createElement("button");
  const iconoBoton = document.createElement("i");

  boton.type = "button";
  boton.className = `btn btn-sm ${clase}`;
  boton.dataset.accion = accion;
  boton.dataset.id = id;

  iconoBoton.className = `bi ${icono}`;
  iconoBoton.setAttribute("aria-hidden", "true");

  boton.append(iconoBoton, document.createTextNode(` ${texto}`));
  return boton;
}

function mostrarEmpleados() {
  const empleados = obtenerEmpleados();
  tablaEmpleadosBody.innerHTML = "";

  if (empleados.length === 0) {
    const filaVacia = document.createElement("tr");
    const celdaVacia = document.createElement("td");

    celdaVacia.colSpan = 6;
    celdaVacia.className = "text-center text-secondary py-4";
    celdaVacia.textContent = "No hay empleados registrados.";
    filaVacia.appendChild(celdaVacia);
    tablaEmpleadosBody.appendChild(filaVacia);
    return;
  }

  empleados.forEach(empleado => {
    const fila = document.createElement("tr");
    const celdaAcciones = document.createElement("td");
    const contenedorAcciones = document.createElement("div");

    contenedorAcciones.className = "admin-acciones";
    contenedorAcciones.append(
      crearBotonAccion("Editar", "bi-pencil-fill", "btn-warning", "editar", empleado.id),
      crearBotonAccion("Eliminar", "bi-trash-fill", "btn-danger", "eliminar", empleado.id)
    );

    celdaAcciones.appendChild(contenedorAcciones);
    fila.append(
      crearCelda(empleado.nombre),
      crearCelda(empleado.apellido),
      crearCelda(empleado.clave),
      crearCelda(empleado.correo),
      crearCelda(empleado.rol),
      celdaAcciones
    );

    tablaEmpleadosBody.appendChild(fila);
  });
}

function limpiarFormulario() {
  formEmpleado.reset();
  formEmpleado.classList.remove("was-validated");
  empleadoIdInput.value = "";
  tituloFormularioEmpleado.textContent = "Agregar o editar empleado";
  btnGuardarEmpleado.textContent = "Guardar empleado";
  btnCancelarEdicion.classList.add("d-none");
}

function editarEmpleado(id) {
  const empleado = obtenerEmpleadoPorId(id);

  if (!empleado) {
    mostrarMensaje("No se encontró el empleado seleccionado.", "danger");
    return;
  }

  empleadoIdInput.value = empleado.id;
  nombreEmpleadoInput.value = empleado.nombre;
  apellidoEmpleadoInput.value = empleado.apellido;
  claveEmpleadoInput.value = empleado.clave;
  correoEmpleadoInput.value = empleado.correo;
  rolEmpleadoInput.value = empleado.rol;

  tituloFormularioEmpleado.textContent = "Editar empleado";
  btnGuardarEmpleado.textContent = "Actualizar empleado";
  btnCancelarEdicion.classList.remove("d-none");
  formEmpleado.scrollIntoView({ behavior: "smooth", block: "start" });
}

formEmpleado.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!formEmpleado.checkValidity()) {
    formEmpleado.classList.add("was-validated");
    return;
  }

  const resultado = guardarEmpleado({
    id: empleadoIdInput.value,
    nombre: nombreEmpleadoInput.value,
    apellido: apellidoEmpleadoInput.value,
    clave: claveEmpleadoInput.value,
    correo: correoEmpleadoInput.value,
    rol: rolEmpleadoInput.value
  });

  mostrarMensaje(resultado.mensaje, resultado.exito ? "success" : "danger");

  if (resultado.exito) {
    limpiarFormulario();
    mostrarEmpleados();
  }
});

tablaEmpleadosBody.addEventListener("click", function (e) {
  const botonAccion = e.target.closest("[data-accion]");

  if (!botonAccion) return;

  const id = botonAccion.dataset.id;

  if (botonAccion.dataset.accion === "editar") {
    editarEmpleado(id);
    return;
  }

  if (botonAccion.dataset.accion === "eliminar") {
    const confirmarEliminacion = window.confirm("¿Desea eliminar este empleado?");

    if (!confirmarEliminacion) return;

    const resultado = eliminarEmpleado(id);
    mostrarMensaje(resultado.mensaje, resultado.exito ? "success" : "danger");

    if (resultado.exito) {
      if (empleadoIdInput.value === id) limpiarFormulario();
      mostrarEmpleados();
    }
  }
});

btnCancelarEdicion.addEventListener("click", limpiarFormulario);

btnRecargarEmpleados.addEventListener("click", function () {
  mostrarEmpleados();
  mostrarMensaje("Lista actualizada.", "info");
});

mostrarEmpleados();
