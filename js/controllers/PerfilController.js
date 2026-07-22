document.addEventListener("DOMContentLoaded", function () {
  const correoGuardado = sessionStorage.getItem("userCorreo");
  const perfilCorreo = document.getElementById("perfilCorreo");
  const btnLogout = document.getElementById("btnLogout");

  if (perfilCorreo) {
    perfilCorreo.textContent = correoGuardado || "Correo no disponible";
  }

  btnLogout?.addEventListener("click", function () {
    sessionStorage.removeItem("userCorreo");
  });
});
