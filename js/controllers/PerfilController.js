document.addEventListener('DOMContentLoaded', function () {
      const correo = localStorage.getItem('userCorreo') || "JosePerez123@gmail.com";
      document.getElementById('perfilCorreo').textContent = correo;
    });