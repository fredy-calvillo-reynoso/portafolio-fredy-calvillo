// src/pages/Tienda.jsx
import { useState } from "react";
import BastonCard from "../components/Tienda/BastonCard";
import OpcionesAdicionales from "../components/Tienda/OpcionesAdicionales";
import Carrito from "../components/Tienda/Carrito";
import { useCart } from "../context/CartContext";
import ComponentesTienda from "../components/Tienda/ComponentesTienda.jsx";
import "./Tienda.css";

const BASTONES = [
  {
    id: "basico",
    nombre: "Bastón Básico",
    precio: 1250,
    imagen: "/img/Baston.png",
    badge: null,
    descripcionCorta: "Ideal para movilidad cotidiana con detección básica de obstáculos.",
    materiales:
      "Bastón, Caja impresa 3D, Microcontrolador, Sensor ultrasónico, Motor de vibración. Ideal para quienes buscan máxima funcionalidad y tecnología en un diseño compacto y resistente.",
    optionsBloqueadas: [],
  },
  {
    id: "avanzado",
    nombre: "Bastón Avanzado",
    precio: 1440,
    imagen: "/img/Baston.png",
    badge: "Más vendido",
    descripcionCorta: "Doble sistema de sensores para mayor precisión y seguridad.",
    materiales:
      "Bastón, Caja impresa 3D, Microcontrolador, Sensor ultrasónico, Sensor láser, Motor de vibración, Motor de vibración móvil. Ideal para quienes buscan máxima funcionalidad y tecnología en un diseño compacto y resistente.",
    opcionesBloqueadas: ["sensorLaser"],
  },
  {
    id: "premium",
    nombre: "Bastón Premium",
    precio: 1750,
    imagen: "/img/Baston.png",
    badge: "Premium",
    descripcionCorta: "Conectividad GPS y SIM para máxima seguridad en todo momento.",
    materiales:
      "Bastón, Caja impresa 3D, Módulo GPS, Sim800l, Microcontrolador, Sensor ultrasónico, Sensor láser, Centro de carga, Motor de vibración, Motor de vibración móvil. Ideal para quienes buscan máxima funcionalidad y tecnología.",
    opcionesBloqueadas: ["sensorLaser", "buzzer", "botonPanico"],
  },
];

export default function Tienda() {
  const { items, agregarBaston, eliminarItem, actualizarOpciones, total } = useCart();
  const [bastonActivo, setBastonActivo] = useState(null);

  function handleSeleccionar(baston) {
    agregarBaston({
      id: baston.id,
      nombre: baston.nombre,
      precio: baston.precio,
      imagen: baston.imagen,
      materiales: baston.materiales,
      opciones: {},
    });
    setBastonActivo(items.length);
  }

  function handleCambiarOpcion(clave, activo, precio) {
    if (bastonActivo === null) return;
    const item = items[bastonActivo];
    const opciones = { ...(item.opciones || {}), [clave]: { activo, precio } };
    actualizarOpciones(bastonActivo, opciones);
  }

  function handleEliminarOpcion(index, clave) {
    const item = items[index];
    const opciones = { ...item.opciones, [clave]: { ...item.opciones[clave], activo: false } };
    actualizarOpciones(index, opciones);
  }

  function handleEliminarBaston(index) {
    eliminarItem(index);
    if (bastonActivo === index) setBastonActivo(null);
    else if (bastonActivo !== null && index < bastonActivo) {
      setBastonActivo(bastonActivo - 1);
    }
  }

  const seleccionActiva =
    bastonActivo !== null && items[bastonActivo] ? items[bastonActivo] : null;

  const bloqueadas = seleccionActiva
    ? BASTONES.find((b) => b.id === seleccionActiva.id)?.opcionesBloqueadas || []
    : [];

  const bastonInfo = seleccionActiva
    ? BASTONES.find((b) => b.id === seleccionActiva.id)
    : null;

  return (
    <div className="sv-tienda">
      {/* Hero */}
      <section className="sv-tienda-hero">
        <div className="container">
          <span className="sv-tienda-eyebrow">Catálogo de productos</span>
          <h1 className="section-title">Elige tu Bastón Inteligente</h1>
          <p className="section-subtitle">
            Selecciona el modelo que mejor se adapte a tus necesidades de movilidad y seguridad.
            Todos los modelos incluyen garantía de 12 meses.
          </p>
          
          {/* Botón de Componentes agregado y centrado de forma elegante en el Hero */}
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
            <ComponentesTienda />
          </div>
        </div>
      </section>

      {/* Tarjetas de bastones */}
      <section className="sv-bastones-section container">
        <div className="sv-bastones-grid">
          {BASTONES.map((baston) => (
            <BastonCard
              key={baston.id}
              baston={baston}
              seleccionado={seleccionActiva?.id === baston.id}
              onSeleccionar={handleSeleccionar}
            />
          ))}
        </div>
      </section>
      <br />

      {/* Panel de configuración + carrito */}
      {items.length > 0 && (
        <section className="sv-configurador container">
          <div className="sv-configurador-header">
            <h2 className="sv-configurador-titulo">Configura tu pedido</h2>
            {bastonInfo && (
              <p className="sv-configurador-sub">
                Personalizando: <strong>{bastonInfo.nombre}</strong>
              </p>
            )}
          </div>

          <div className="sv-configurador-layout">
            {/* Columna izquierda: opciones + resumen */}
            <div className="sv-configurador-izquierda">
              {seleccionActiva && (
                <OpcionesAdicionales
                  opciones={seleccionActiva.opciones || {}}
                  bloqueadas={bloqueadas}
                  onCambiar={handleCambiarOpcion}
                />
              )}

              {bastonInfo && (
                <div className="sv-resumen-modelo card">
                  <div className="sv-resumen-modelo-img-wrap">
                    <img
                      src={seleccionActiva.imagen}
                      alt={seleccionActiva.nombre}
                      className="sv-resumen-img"
                    />
                  </div>
                  <div className="sv-resumen-modelo-info">
                    <h3>{bastonInfo.nombre}</h3>
                    <p className="sv-resumen-desc-corta">{bastonInfo.descripcionCorta}</p>
                    <div className="sv-resumen-materiales">
                      <span className="sv-resumen-label">Componentes incluidos</span>
                      <p>{bastonInfo.materiales}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Columna derecha: carrito */}
            <div className="sv-configurador-derecha">
              <Carrito
                items={items}
                onEliminar={handleEliminarBaston}
                onEliminarOpcion={handleEliminarOpcion}
                total={total}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}