document.getElementById('form-posponer').addEventListener('submit', function(event) {
    event.preventDefault();

    const fechaIngresada = document.getElementById('input-fecha').value;
    const horaIngresada = document.getElementById('input-hora').value;

    if (fechaIngresada && horaIngresada) {
        const [anio, mes, dia] = fechaIngresada.split('-');
        const fechaFormateada = `${parseInt(dia)}/${parseInt(mes)}/${anio}`;

        const [horas, minutos] = horaIngresada.split(':');
        let horaNum = parseInt(horas);
        const ampm = horaNum >= 12 ? 'P.M' : 'A.M';
        horaNum = horaNum % 12;
        horaNum = horaNum ? horaNum : 12; 
        const horaFormateada = `${horaNum}:${minutos} ${ampm}`;

        document.getElementById('txt-fecha-exito').innerText = fechaFormateada;
        document.getElementById('txt-hora-exito').innerText = horaFormateada;

        document.getElementById('vista-formulario').classList.add('d-none');
        document.getElementById('vista-exito').classList.remove('d-none');
    }
});

document.getElementById('btn-regresar').addEventListener('click', function() {
    document.getElementById('form-posponer').reset();
    document.getElementById('vista-exito').classList.add('d-none');
    document.getElementById('vista-formulario').classList.remove('d-none');
});