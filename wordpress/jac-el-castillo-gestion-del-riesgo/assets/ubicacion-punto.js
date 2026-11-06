(function () {
  var MAX_ACCURACY_M = 30;
  var boton = document.getElementById('gr_agregar_ubicacion');
  var estado = document.getElementById('gr_ubicacion_estado');
  var coordenadas = document.getElementById('gr_coordenadas');
  var tipo = document.getElementById('gr_tipo');
  if (!boton || !estado || !coordenadas || !tipo) {
    return;
  }

  var ETIQUETA = boton.textContent;
  var ETIQUETA_REINTENTAR = 'Intentar de nuevo';
  var pendiente = null;

  function mostrar(texto) {
    estado.textContent = texto;
  }

  function restaurar() {
    boton.disabled = false;
    boton.textContent = pendiente ? ETIQUETA_REINTENTAR : ETIQUETA;
  }

  function escribir(linea) {
    var actual = coordenadas.value.replace(/\s+$/, '');
    coordenadas.value = tipo.value === 'ruta' && actual !== '' ? actual + '\n' + linea : linea;
    coordenadas.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function agregar(lectura) {
    escribir(lectura.lat.toFixed(6) + ',' + lectura.lng.toFixed(6));
    pendiente = null;
    mostrar((lectura.precision > MAX_ACCURACY_M ? 'Ubicación agregada con precisión baja (±' : 'Ubicación agregada (±') + lectura.precision + ' m)');
  }

  function alExito(posicion) {
    var lectura = {
      lat: posicion.coords.latitude,
      lng: posicion.coords.longitude,
      precision: Math.round(posicion.coords.accuracy)
    };
    if (lectura.precision <= MAX_ACCURACY_M) {
      agregar(lectura);
    } else if (pendiente) {
      agregar(pendiente.precision <= lectura.precision ? pendiente : lectura);
    } else {
      pendiente = lectura;
      mostrar('La precisión es baja (±' + lectura.precision + ' m). Espera un momento o sal a cielo abierto y toca otra vez. Si sigue baja, se guarda la mejor de las dos lecturas.');
    }
    restaurar();
  }

  function alError(error) {
    pendiente = null;
    mostrar(
      error && error.code === 1
        ? 'Permite la ubicación en el navegador para usar este botón.'
        : 'No pudimos obtener tu ubicación. Intenta de nuevo al aire libre.'
    );
    restaurar();
  }

  if (!('geolocation' in navigator)) {
    boton.disabled = true;
    mostrar('Este navegador no puede obtener la ubicación. Escribe las coordenadas a mano.');
    return;
  }
  if (!window.isSecureContext) {
    boton.disabled = true;
    mostrar('La ubicación solo funciona con una conexión segura (https). Escribe las coordenadas a mano.');
    return;
  }

  boton.addEventListener('click', function () {
    boton.disabled = true;
    mostrar('Buscando tu ubicación…');
    navigator.geolocation.getCurrentPosition(alExito, alError, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    });
  });
})();
