(function () {
  var elegir = document.getElementById('gr_elegir_archivo');
  var quitar = document.getElementById('gr_quitar_archivo');
  var campo = document.getElementById('gr_archivo_id');
  var estado = document.getElementById('gr_archivo_estado');
  if (!elegir || !quitar || !campo || !estado || !window.wp || !wp.media) {
    return;
  }

  var mimes = JSON.parse(elegir.getAttribute('data-mimes') || '[]');
  var formatos = JSON.parse(elegir.getAttribute('data-formatos') || '{}');
  var marco = null;

  function tamano(bytes) {
    return bytes < 1048576 ? Math.max(1, Math.round(bytes / 1024)) + ' KB' : (bytes / 1048576).toFixed(1) + ' MB';
  }

  function elegido() {
    var adjunto = marco.state().get('selection').first().toJSON();
    if (mimes.indexOf(adjunto.mime) === -1) {
      estado.textContent = 'Ese formato no está permitido. Elige un PDF, Word, Excel, PowerPoint o una imagen JPG, PNG o WebP.';
      return;
    }
    campo.value = adjunto.id;
    estado.textContent = adjunto.filename + ' (' + formatos[adjunto.mime] + ', ' + tamano(adjunto.filesizeInBytes || 0) + ')';
    quitar.hidden = false;
  }

  elegir.addEventListener('click', function () {
    if (!marco) {
      marco = wp.media({
        title: 'Elegir o subir archivo',
        button: { text: 'Usar este archivo' },
        library: { type: mimes },
        multiple: false
      });
      marco.on('select', elegido);
    }
    marco.open();
  });

  quitar.addEventListener('click', function () {
    campo.value = '';
    estado.textContent = 'Sin archivo. Guarda el recurso para aplicar el cambio.';
    quitar.hidden = true;
  });
})();
