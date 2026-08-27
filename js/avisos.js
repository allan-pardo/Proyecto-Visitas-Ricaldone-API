export function avisoExito(mensaje, titulo = "Listo") {
  if (window.Swal) {
    Swal.fire({
      icon: "success",
      title: titulo,
      text: mensaje,
      timer: 1800,
      showConfirmButton: false
    });
  } else {
    alert(mensaje);
  }
}

export function avisoError(mensaje, titulo = "Ocurrió un problema") {
  if (window.Swal) {
    Swal.fire({ icon: "error", title: titulo, text: mensaje });
  } else {
    alert(mensaje);
  }
}

export function avisoInfo(mensaje, titulo = "Información") {
  if (window.Swal) {
    Swal.fire({ icon: "info", title: titulo, text: mensaje });
  } else {
    alert(mensaje);
  }
}

export async function confirmarAccion(titulo, mensaje, textoBoton = "Sí, continuar") {
  if (!window.Swal) {
    return window.confirm(`${titulo}\n\n${mensaje}`);
  }

  const resultado = await Swal.fire({
    icon: "warning",
    title: titulo,
    text: mensaje,
    showCancelButton: true,
    confirmButtonText: textoBoton,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    reverseButtons: true
  });

  return resultado.isConfirmed;
}