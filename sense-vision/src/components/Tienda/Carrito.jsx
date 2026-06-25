// src/components/Tienda/Carrito.jsx
import { useNavigate } from "react-router-dom";
import { OPCIONES_INFO } from "./OpcionesAdicionales";
import { TrashIcon, ShoppingBagIcon, ArrowRightIcon } from "../Icons";
import "./Carrito.css";

export default function Carrito({ items, onEliminar, onEliminarOpcion, total }) {
  const navigate = useNavigate();
  const totalItems = items.length;

  return (
    <div className="sv-carrito card">
      <div className="sv-carrito-header">
        <ShoppingBagIcon size={20} />
        <h2>Carrito</h2>
        {totalItems > 0 && (
          <span className="sv-carrito-badge">{totalItems}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="sv-carrito-vacio">
          <ShoppingBagIcon size={40} />
          <p>Aún no has agregado ningún bastón.</p>
        </div>
      ) : (
        <ul className="sv-carrito-lista">
          {items.map((item, index) => (
            <li key={index} className="sv-carrito-grupo">
              <div className="sv-carrito-item">
                <div className="sv-carrito-item-info">
                  <span className="sv-carrito-item-nombre">{item.nombre}</span>
                  <span className="sv-carrito-item-precio">
                    ${item.precio.toLocaleString("es-MX")}
                  </span>
                </div>
                <button
                  className="sv-eliminar-btn"
                  title="Eliminar"
                  onClick={() => onEliminar(index)}
                >
                  <TrashIcon size={14} />
                </button>
              </div>

              {item.opciones &&
                Object.entries(item.opciones)
                  .filter(([, valor]) => valor.activo)
                  .map(([clave]) => (
                    <div key={clave} className="sv-carrito-item sv-carrito-subitem">
                      <div className="sv-carrito-item-info">
                        <span className="sv-carrito-item-nombre sv-carrito-opcion-nombre">
                          + {OPCIONES_INFO[clave].etiqueta}
                        </span>
                        <span className="sv-carrito-item-precio sv-carrito-opcion-precio">
                          ${OPCIONES_INFO[clave].precio.toLocaleString("es-MX")}
                        </span>
                      </div>
                      <button
                        className="sv-eliminar-btn sv-eliminar-btn--sm"
                        title="Quitar opción"
                        onClick={() => onEliminarOpcion(index, clave)}
                      >
                        <TrashIcon size={12} />
                      </button>
                    </div>
                  ))}
            </li>
          ))}
        </ul>
      )}

      <div className="sv-carrito-footer">
        <div className="sv-carrito-total">
          <span>Total</span>
          <strong>${total.toLocaleString("es-MX")} MXN</strong>
        </div>

        <button
          className="btn btn-accent sv-pagar-btn"
          disabled={items.length === 0}
          onClick={() => navigate("/pago")}
        >
          Proceder al pago
          <ArrowRightIcon size={16} />
        </button>
      </div>
    </div>
  );
}
