const form = document.getElementById('loginForm');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        alert("Iniciando sesión...");
        window.location.href = 'index.html'; 
    });
}

// Configurar fecha mínima (hoy) para evitar fechas pasadas en posponer
const fechaSugeridaInput = document.getElementById("fechaSugerida");
if (fechaSugeridaInput) {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    fechaSugeridaInput.min = `${anio}-${mes}-${dia}`;
}
