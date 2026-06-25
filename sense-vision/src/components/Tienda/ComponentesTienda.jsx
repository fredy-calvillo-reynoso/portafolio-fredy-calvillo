import { useState } from "react";
import { InfoCircleIcon, GearIcon, ShieldIcon, PhoneIcon } from "../Icons.jsx";
// Si no tienes un ícono de chip/procesador, definimos uno rápido en SVG abajo
import "./ComponentesModal.css";

const COMPONENTES_DETALLE = [
  {
    nombre: "Sensor ToF VL53L0X",
    descripcion: "Mide la distancia exacta hacia obstáculos frontales mediante ráfagas de luz infrarroja imperceptibles, ofreciendo lecturas precisas en milisegundos.",
    icono: <InfoCircleIcon size={22} />
  },
  {
    nombre: "Módulo GPS y Conectividad SIM",
    descripcion: "Rastrea la ubicación satelital en tiempo real y permite el envío de coordenadas de asistencia a través de redes celulares integradas.",
    icono: <GearIcon size={22} />
  },
  {
    nombre: "Botón de Pánico Físico",
    descripcion: "Activador de emergencia táctil de alta respuesta que inicia instantáneamente el protocolo de alerta hacia los contactos configurados.",
    icono: <PhoneIcon size={22} />
  },
  {
    nombre: "Sistema de Alerta Háptica",
    descripcion: "Motor de vibración interno en el mango que notifica la proximidad de un objeto de forma silenciosa y directa, sin saturar el oído del usuario.",
    icono: <ShieldIcon size={22} />
  },
  {
    nombre: "Procesador Central ESP32",
    descripcion: "El cerebro electrónico del dispositivo. Gestiona eficientemente el consumo de batería, procesa las señales de los sensores y coordina las alertas.",
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
      </svg>
    )
  }
];

export default function ComponentesTienda() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="sv-componentes-contenedor">
      {/* Botón para abrir la ventana emergente */}
      <button 
        type="button" 
        className="btn btn-outline sv-btn-componentes"
        onClick={() => setModalAbierto(true)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        Ver componentes del bastón
      </button>

      {/* Ventana Emergente (Modal) */}
      {modalAbierto && (
        <div className="sv-modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="sv-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sv-modal-header">
              <h3>Arquitectura de Sense Vision</h3>
              <button 
                type="button" 
                className="sv-modal-cerrar" 
                onClick={() => setModalAbierto(false)}
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>
            
            <div className="sv-modal-body">
              <p className="sv-modal-intro">
                Tecnología integrada y optimizada para ofrecer una navegación segura y autónoma.
              </p>
              
              <div className="sv-componentes-lista">
                {COMPONENTES_DETALLE.map((comp, index) => (
                  <div key={index} className="sv-componente-item">
                    <div className="sv-componente-icono-wrap">
                      {comp.icono}
                    </div>
                    <div className="sv-componente-texto">
                      <h4>{comp.nombre}</h4>
                      <p>{comp.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sv-modal-footer">
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => setModalAbierto(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}