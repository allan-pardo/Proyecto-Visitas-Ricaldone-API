export function validarCorreoInstitucional(correo) {
  return /^[^@\s]+@ricaldone\.edu\.sv$/i.test(correo.trim());
}
