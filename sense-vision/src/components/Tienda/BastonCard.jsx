// src/components/Tienda/BastonCard.jsx
import { ShoppingCartIcon, CheckCircleIcon } from "../Icons";
import "./BastonCard.css";

export default function BastonCard({ baston, seleccionado, onSeleccionar }) {
  return (
    <div className={`sv-baston-card card ${seleccionado ? "sv-baston-card--activo" : ""}`}>
      {baston.badge && (
        <span className="sv-baston-badge">{baston.badge}</span>
      )}

      <div className="sv-baston-img-wrap">
        <img src={baston.imagen} alt={baston.nombre} className="sv-baston-img" />
      </div>

      <div className="sv-baston-body">
        <h2 className="sv-baston-nombre">{baston.nombre}</h2>
        <p className="sv-baston-desc-corta">{baston.descripcionCorta}</p>

        <div className="sv-baston-precio-row">
          <span className="sv-baston-precio">
            ${baston.precio.toLocaleString("es-MX")}
            <span className="sv-baston-moneda"> MXN</span>
          </span>
        </div>

        <button
          className={`sv-agregar-btn ${seleccionado ? "sv-agregar-btn--activo" : ""}`}
          onClick={() => onSeleccionar(baston)}
        >
          {seleccionado ? (
            <>
              <CheckCircleIcon size={17} />
              Seleccionado
            </>
          ) : (
            <>
              <ShoppingCartIcon size={17} />
              Agregar al carrito
            </>
          )}
        </button>
      </div>

      <details className="sv-baston-detalles">
        <summary>Ver componentes incluidos</summary>
        <p>{baston.materiales}</p>
      </details>
    </div>
  );
}
