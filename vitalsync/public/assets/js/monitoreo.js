import { obtenerPacienteActual } from "./pacientes-service.js";
import { observarSesion } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  observarSesion(async (usuario) => {
    if (!usuario) {
      window.location.href = "login.html";
      return;
    }

    await cargarPaciente();
    iniciarGraficas();
  });
});

async function cargarPaciente() {
  const alerta = document.getElementById("alertaMonitoreo");

  try {
    const paciente = await obtenerPacienteActual();

    if (!paciente) {
      alerta.className = "alert alert-warning";
      alerta.textContent = "Aún no hay paciente guardado en esta cuenta.";
      iniciarMapa(null);
      return;
    }

    alerta.className = "alert alert-success";
    alerta.textContent = "Paciente cargado de esta cuenta.";

    setText("datoNombre", paciente.nombre);
    setText("datoApellidos", paciente.apellidos);
    setText("datoEdad", paciente.edad ? `${paciente.edad} años` : "—");
    setText("datoFechaNacimiento", paciente.fechaNacimiento);
    setText("datoGenero", paciente.genero);
    setText("datoDireccion", paciente.direccion);
    setText("datoTelefonoEmergencias", paciente.telefonoEmergencias);
    setText("datoTelefonoFamiliar", paciente.telefonoFamiliar);
    setText("datoTipoSangre", paciente.tipoSangre);
    setText("datoAlergiaGeneral", paciente.alergiaGeneral);
    setText("datoAlergiaMedicamento", paciente.alergiaMedicamento);
    setText("datoEnfermedades", paciente.enfermedades);
    setText("datoAlergias", paciente.alergias);
    setText(
      "datoMedicamentos",
      Array.isArray(paciente.medicamentos)
        ? paciente.medicamentos.join(", ")
        : paciente.medicamentos
    );

    iniciarMapa(paciente);
  } catch (error) {
    console.error(error);
    alerta.className = "alert alert-danger";
    alerta.textContent = "No se pudo cargar el paciente. Revise la configuración del sistema de guardado.";
    iniciarMapa(null);
  }
}

function setText(id, value) {
  const elemento = document.getElementById(id);

  if (elemento) {
    elemento.textContent = value || "—";
  }
}

function iniciarMapa(paciente) {
  const lat = paciente?.latitud || 19.702;
  const lon = paciente?.longitud || -101.194;
  const zoom = paciente?.latitud && paciente?.longitud ? 16 : 13;

  const mapContainer = document.getElementById("map");

  if (!mapContainer) {
    return;
  }

  if (mapContainer._leaflet_id) {
    mapContainer._leaflet_id = null;
    mapContainer.innerHTML = "";
  }

  const map = L.map("map").setView([lat, lon], zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  if (paciente?.latitud && paciente?.longitud) {
    L.marker([lat, lon]).addTo(map)
      .bindPopup(`${paciente.nombre || "Paciente"}<br>${paciente.direccion || "Sin dirección"}`)
      .openPopup();
  }
}

function iniciarGraficas() {
  const ecgCanvas = document.getElementById("ecgChart");
  const plethCanvas = document.getElementById("plethChart");

  if (!ecgCanvas || !plethCanvas) {
    return;
  }

  const ecgCtx = ecgCanvas.getContext("2d");
  const plethCtx = plethCanvas.getContext("2d");

  // Sin conexión a un reloj/sensor real todavía: se muestran las
  // gráficas en línea base (0) en lugar de datos simulados, para no
  // mostrar信号 falsos como si vinieran de un dispositivo.
  new Chart(ecgCtx, {
    type: "line",
    data: {
      labels: Array.from({ length: 300 }, () => ""),
      datasets: [{
        data: Array(300).fill(0),
        borderColor: "#e74c3c",
        borderWidth: 1.8,
        tension: 0,
        fill: false
      }]
    },
    options: chartOptions(-1.8, 2.0)
  });

  new Chart(plethCtx, {
    type: "line",
    data: {
      labels: Array.from({ length: 80 }, () => ""),
      datasets: [{
        data: Array(80).fill(0),
        borderColor: "#2ecc71",
        borderWidth: 1.5,
        tension: 0.35,
        fill: false
      }]
    },
    options: chartOptions(0, 100)
  });

  const tempFluid = document.querySelector(".thermometer .fluid");
  const pulseDisplay = document.getElementById("ritmo");
  const tempDisplay = document.getElementById("temp");
  const oxygenDisplay = document.getElementById("oxigeno");

  if (tempFluid) {
    tempFluid.style.height = "2px";
  }

  if (pulseDisplay) {
    pulseDisplay.innerHTML = `0 <span>lpm</span>`;
  }

  if (tempDisplay) {
    tempDisplay.innerHTML = `0.0 <span>°C</span>`;
  }

  if (oxygenDisplay) {
    oxygenDisplay.innerHTML = `0 <span>%</span>`;
  }
}

function chartOptions(min, max) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        min,
        max
      },
      x: {
        display: false
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      point: {
        radius: 0
      }
    },
    animation: false
  };
}