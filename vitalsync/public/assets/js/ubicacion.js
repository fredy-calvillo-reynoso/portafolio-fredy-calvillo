export function configurarUbicacion() {
  const obtenerUbicacionBtn = document.getElementById("obtenerUbicacion");
  const detenerUbicacionBtn = document.getElementById("detenerUbicacion");
  const latitudInput = document.getElementById("latitud");
  const longitudInput = document.getElementById("longitud");
  const accuracyInput = document.getElementById("geoAccuracy");
  const tsInput = document.getElementById("geoTimestamp");
  const ubicacionStatus = document.getElementById("ubicacionStatus");
  const mapaContainer = document.getElementById("mapa");
  const btnSubmit = document.getElementById("btnSubmit");

  if (!obtenerUbicacionBtn || !mapaContainer) {
    return;
  }

  let map = null;
  let marker = null;
  let circle = null;
  let watchId = null;

  function asegurarBotonGuardarActivo() {
    if (btnSubmit) {
      btnSubmit.disabled = false;
    }
  }

  function actualizarStatus(clase, texto) {
    if (!ubicacionStatus) return;

    ubicacionStatus.classList.remove(
      "text-muted",
      "text-success",
      "text-danger",
      "text-warning"
    );

    ubicacionStatus.classList.add(clase);
    ubicacionStatus.innerHTML = texto;
  }

  function actualizarCampos(lat, lon, acc, ts) {
    if (latitudInput) latitudInput.value = Number(lat).toFixed(6);
    if (longitudInput) longitudInput.value = Number(lon).toFixed(6);

    if (accuracyInput) {
      accuracyInput.value = acc !== null && acc !== undefined
        ? Math.round(acc)
        : "";
    }

    if (tsInput) {
      tsInput.value = new Date(ts || Date.now())
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }
  }

  function iniciarMapa(lat, lon) {
    if (!map) {
      map = L.map(mapaContainer).setView([lat, lon], 17);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      }).addTo(map);

      marker = L.marker([lat, lon], {
        draggable: true
      }).addTo(map);

      marker.bindPopup("Ubicación detectada").openPopup();

      marker.on("dragend", () => {
        const posicion = marker.getLatLng();
        actualizarCampos(
          posicion.lat,
          posicion.lng,
          accuracyInput ? accuracyInput.value : null,
          Date.now()
        );

        dibujarPrecision(
          posicion.lat,
          posicion.lng,
          accuracyInput ? Number(accuracyInput.value || 0) : 0
        );

        actualizarStatus(
          "text-success",
          '<i class="fas fa-location-dot me-1"></i>Ubicación ajustada manualmente'
        );

        asegurarBotonGuardarActivo();
      });

      circle = L.circle([lat, lon], {
        radius: 0
      }).addTo(map);
    } else {
      map.setView([lat, lon], 17);

      if (marker) {
        marker.setLatLng([lat, lon]);
      }
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }

  function dibujarPrecision(lat, lon, acc) {
    if (!circle) return;

    circle.setLatLng([lat, lon]);
    circle.setRadius(Number.isFinite(acc) ? acc : 0);
  }

  function detenerUbicacion() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }

    if (detenerUbicacionBtn) {
      detenerUbicacionBtn.disabled = true;
    }

    obtenerUbicacionBtn.disabled = false;
    asegurarBotonGuardarActivo();
  }

  function onGeoSuccess(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const acc = pos.coords.accuracy;
    const ts = pos.timestamp;

    actualizarCampos(lat, lon, acc, ts);
    iniciarMapa(lat, lon);
    dibujarPrecision(lat, lon, acc);

    actualizarStatus(
      "text-success",
      `<i class="fas fa-location-dot me-1"></i>Ubicación detectada. Precisión: ${Math.round(acc)} m`
    );

    asegurarBotonGuardarActivo();
  }

  function onGeoError(error) {
    actualizarStatus(
      "text-danger",
      `<i class="fas fa-circle-xmark me-1"></i>No se pudo obtener la ubicación: ${error.message}`
    );

    detenerUbicacion();
    asegurarBotonGuardarActivo();
  }

  obtenerUbicacionBtn.addEventListener("click", () => {
    asegurarBotonGuardarActivo();

    if (!navigator.geolocation) {
      actualizarStatus(
        "text-danger",
        '<i class="fas fa-circle-xmark me-1"></i>Este navegador no soporta geolocalización'
      );
      asegurarBotonGuardarActivo();
      return;
    }

    actualizarStatus(
      "text-warning",
      '<i class="fas fa-spinner fa-spin me-1"></i>Obteniendo ubicación...'
    );

    obtenerUbicacionBtn.disabled = true;

    if (detenerUbicacionBtn) {
      detenerUbicacionBtn.disabled = false;
    }

    const opciones = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    watchId = navigator.geolocation.watchPosition(
      onGeoSuccess,
      onGeoError,
      opciones
    );

    asegurarBotonGuardarActivo();

    setTimeout(() => {
      asegurarBotonGuardarActivo();
    }, 500);

    setTimeout(() => {
      asegurarBotonGuardarActivo();
    }, 1500);

    setTimeout(() => {
      asegurarBotonGuardarActivo();
    }, 3000);
  });

  if (detenerUbicacionBtn) {
    detenerUbicacionBtn.addEventListener("click", () => {
      detenerUbicacion();

      actualizarStatus(
        "text-muted",
        '<i class="fas fa-stop me-1"></i>Ubicación detenida'
      );

      asegurarBotonGuardarActivo();
    });
  }

  asegurarBotonGuardarActivo();
}