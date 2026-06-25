// src/components/Tienda/OpcionesAdicionales.jsx
import { SensorIcon, BellIcon, LocationPinIcon, LockClosedIcon } from "../Icons";
import "./OpcionesAdicionales.css";

const OPCIONES_INFO = {
  sensorLaser: {
    etiqueta: "Sensor Láser",
    precio: 190,
    descripcion:
      "Permite detectar obstáculos cercanos con alta precisión, evitando colisiones inesperadas.",
    icono: SensorIcon,
  },
  buzzer: {
    etiqueta: "Buzzer",
    precio: 150,
    descripcion:
      "Emite un sonido breve al detectar obstáculos cercanos o a larga distancia.",
    icono: BellIcon,
  },
  botonPanico: {
    etiqueta: "Botón de Pánico",
    precio: 310,
    descripcion:
      "Envía tu ubicación GPS a contactos de emergencia en caso de situaciones peligrosas.",
    icono: LocationPinIcon,
  },
};

export default function OpcionesAdicionales({ opciones, bloqueadas, onCambiar }) {
  return (
    <div className="sv-opciones card">
      <div className="sv-opciones-header">
        <h2>Opciones adicionales</h2>
        <p className="sv-opciones-sub">Personaliza tu bastón con accesorios extra</p>
      </div>

      <div className="sv-opciones-lista">
        {Object.entries(OPCIONES_INFO).map(([clave, info]) => {
          const bloqueada = bloqueadas.includes(clave);
          const activa = opciones[clave]?.activo || false;
          const Icono = info.icono;

          return (
            <label
              key={clave}
              className={`sv-opcion ${bloqueada ? "sv-opcion--bloqueada" : ""} ${activa ? "sv-opcion--activa" : ""}`}
            >
              <div className="sv-opcion-icono-wrap">
                <Icono size={20} />
              </div>

              <div className="sv-opcion-contenido">
                <div className="sv-opcion-top">
                  <span className="sv-opcion-nombre">{info.etiqueta}</span>
                  <span className="sv-opcion-precio">+${info.precio.toLocaleString("es-MX")}</span>
                </div>
                <p className="sv-opcion-desc">{info.descripcion}</p>
              </div>

              <div className="sv-opcion-toggle-wrap">
                {bloqueada ? (
                  <span className="sv-opcion-incluido" title="Incluido en este modelo">
                    <LockClosedIcon size={14} />
                    Incluido
                  </span>
                ) : (
                  <input
                    type="checkbox"
                    className="sv-opcion-toggle"
                    checked={activa}
                    disabled={bloqueada}
                    onChange={(e) => onCambiar(clave, e.target.checked, info.precio)}
                  />
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export { OPCIONES_INFO };
