const resultado = document.getElementById('resultado');
const formulario = document.getElementById('obtenerClima');
const inputCiudad = document.getElementById('ciudad');

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    if (inputCiudad.value === '') {
        mostrarError('El campo de la ciudad es obligatorio...');
        return;
    }

    realizarLlamadaAPI(inputCiudad.value);
});

function realizarLlamadaAPI(ciudad) {
    const claveAPI = '41d1d7f5c2475b3a16167b30bc4f265c';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${claveAPI}`;

    fetch(url)
        .then(respuesta => {
            return respuesta.json();
        })
        .then(datosJSON => {
            if (datosJSON.cod === '404') {
                mostrarError('Ciudad no encontrada...');
            } else {
                limpiarHTML();
                mostrarClima(datosJSON);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_min, temp_max }, weather: [arr] } = datos;

    const grados = kelvinACentigrados(temp);
    const min = kelvinACentigrados(temp_min);
    const max = kelvinACentigrados(temp_max);

    const contenido = document.createElement('div');
    contenido.innerHTML = `
        <h5>Clima en ${name}</h5>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icono">
        <h2>${grados}°C</h2>
        <p>Máx: ${max}°C</p>
        <p>Mín: ${min}°C</p>
    `;

    resultado.appendChild(contenido);
}

function mostrarError(mensaje) {
    const alerta = document.createElement('p');
    alerta.classList.add('alert-message');
    alerta.innerHTML = mensaje;

    formulario.appendChild(alerta);
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function kelvinACentigrados(temp) {
    return parseInt(temp - 273.15);
}

function limpiarHTML() {
    resultado.innerHTML = '';
}
