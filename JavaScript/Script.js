const form = document.getElementById('loginForm');
form.addEventListener('submit', function(e) {
    e.preventDefault(); 
    alert("Iniciando sesión...");
    window.location.href = 'inicio.html'; 
});
