// src/pages/Proceso.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getFirebaseDb } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { ShoppingBagIcon, FileTextIcon, DotsVerticalIcon, XIcon } from "../components/Icons";
import "./Proceso.css";

const ESTADOS_LABEL = {
  pendiente_pago: "Pendiente de pago",
  pago_confirmado: "Pago confirmado",
  en_proceso: "En proceso",
  enviado: "Enviado",
  entregado: "Entregado",
};

const ESTADO_COLOR = {
  pendiente_pago: "sv-estado--pendiente",
  pago_confirmado: "sv-estado--confirmado",
  en_proceso: "sv-estado--proceso",
  enviado: "sv-estado--enviado",
  entregado: "sv-estado--entregado",
};

const ESTADOS_PASO = ["pendiente_pago", "pago_confirmado", "en_proceso", "enviado", "entregado"];

function MenuPedido({ pedido, onVerInfo }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function cerrar(e) {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    }
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  return (
    <div className="sv-pedido-menu" ref={ref}>
      <button
        className="sv-pedido-menu-btn"
        title="Opciones"
        onClick={() => setAbierto((v) => !v)}
      >
        <DotsVerticalIcon size={18} />
      </button>
      {abierto && (
        <div className="sv-pedido-dropdown">
          <button
            className="sv-pedido-dropdown-item"
            onClick={() => { onVerInfo(pedido); setAbierto(false); }}
          >
            <FileTextIcon size={15} />
            Información del pedido
          </button>
        </div>
      )}
    </div>
  );
}

function ModalPedido({ pedido, onCerrar }) {
  const pasoActual = ESTADOS_PASO.indexOf(pedido.estado);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="sv-modal-overlay" onClick={onCerrar}>
      <div className="sv-modal card" onClick={(e) => e.stopPropagation()}>
        <div className="sv-modal-header">
          <div className="sv-modal-titulo">
            <FileTextIcon size={18} />
            <h2>Información del pedido</h2>
          </div>
          <button className="sv-modal-cerrar" onClick={onCerrar}>
            <XIcon size={18} />
          </button>
        </div>

        <div className="sv-modal-body">
          {/* ID y fecha */}
          <div className="sv-modal-meta">
            <span className="sv-pedido-id">#{pedido.id.slice(-8).toUpperCase()}</span>
            {pedido.creadoEn?.toDate && (
              <span className="sv-pedido-fecha">
                {pedido.creadoEn.toDate().toLocaleDateString("es-MX", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            )}
            <span className={`sv-estado-badge ${ESTADO_COLOR[pedido.estado] || ""}`}>
              {ESTADOS_LABEL[pedido.estado] || pedido.estado}
            </span>
          </div>

          {/* Progreso */}
          <div className="sv-modal-progreso">
            {ESTADOS_PASO.map((estado, i) => (
              <div
                key={estado}
                className={`sv-proceso-paso ${i <= pasoActual ? "sv-proceso-paso--activo" : ""} ${i === pasoActual ? "sv-proceso-paso--actual" : ""}`}
              >
                <div className="sv-proceso-paso-circulo">{i + 1}</div>
                <span className="sv-proceso-paso-label">{ESTADOS_LABEL[estado]}</span>
              </div>
            ))}
          </div>

          {/* Productos */}
          <div className="sv-modal-seccion">
            <h3 className="sv-modal-seccion-titulo">Productos</h3>
            <ul className="sv-pedido-items">
              {pedido.items?.map((item, i) => (
                <li key={i} className="sv-pedido-item">
                  <span>{item.nombre}</span>
                  <span>${item.precio?.toLocaleString("es-MX")} MXN</span>
                </li>
              ))}
            </ul>
            <div className="sv-pedido-total-row">
              <span>Total</span>
              <strong>${pedido.total?.toLocaleString("es-MX")} MXN</strong>
            </div>
          </div>

          {/* Envío */}
          <div className="sv-modal-seccion">
            <h3 className="sv-modal-seccion-titulo">Datos de envío</h3>
            <div className="sv-modal-envio">
              <p><strong>Nombre:</strong> {pedido.datosEnvio?.nombre}</p>
              <p><strong>Dirección:</strong> {pedido.datosEnvio?.direccion}</p>
              <p><strong>Ciudad:</strong> {pedido.datosEnvio?.ciudad}, C.P. {pedido.datosEnvio?.codigoPostal}</p>
              <p><strong>Teléfono:</strong> {pedido.datosEnvio?.telefono}</p>
              <p><strong>Correo:</strong> {pedido.datosEnvio?.correo}</p>
              {pedido.datosEnvio?.especificaciones && (
                <p><strong>Especificaciones:</strong> {pedido.datosEnvio.especificaciones}</p>
              )}
            </div>
          </div>

          {/* Pago */}
          <div className="sv-modal-seccion">
            <h3 className="sv-modal-seccion-titulo">Método de pago</h3>
            <p className="sv-modal-metodo">
              {pedido.metodoPago === "deposito" ? "Depósito bancario" : "Transferencia bancaria"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Proceso() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    if (!user) { setCargando(false); return; }
    async function cargar() {
      try {
        // Carga diferida: "firebase/firestore" solo se descarga cuando
        // el usuario entra a "Mis pedidos".
        const [{ collection, query, where, orderBy, getDocs }, db] = await Promise.all([
          import("firebase/firestore"),
          getFirebaseDb(),
        ]);
        const q = query(
          collection(db, "pedidos"),
          where("usuarioId", "==", user.uid),
          orderBy("creadoEn", "desc")
        );
        const snap = await getDocs(q);
        setPedidos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [user]);

  return (
    <div className="sv-proceso container">
      <div className="sv-proceso-header">
        <ShoppingBagIcon size={28} />
        <div>
          <h1 className="section-title">Mis Pedidos</h1>
          <p className="section-subtitle">Historial de pedidos realizados con tu cuenta.</p>
        </div>
      </div>

      {cargando ? (
        <p className="sv-proceso-cargando">Cargando tus pedidos...</p>
      ) : pedidos.length === 0 ? (
        <div className="card sv-proceso-vacio">
          <ShoppingBagIcon size={48} />
          <p>Aún no tienes pedidos registrados.</p>
          <Link to="/tienda" className="btn btn-primary">Ir a la tienda</Link>
        </div>
      ) : (
        <div className="sv-proceso-lista">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="card sv-pedido">
              <div className="sv-pedido-header">
                <div className="sv-pedido-meta">
                  <FileTextIcon size={16} />
                  <span className="sv-pedido-id">#{pedido.id.slice(-8).toUpperCase()}</span>
                  {pedido.creadoEn?.toDate && (
                    <span className="sv-pedido-fecha">
                      {pedido.creadoEn.toDate().toLocaleDateString("es-MX", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <div className="sv-pedido-header-derecha">
                  <span className={`sv-estado-badge ${ESTADO_COLOR[pedido.estado] || ""}`}>
                    {ESTADOS_LABEL[pedido.estado] || pedido.estado}
                  </span>
                  <MenuPedido pedido={pedido} onVerInfo={setPedidoSeleccionado} />
                </div>
              </div>

              <ul className="sv-pedido-items">
                {pedido.items?.map((item, i) => (
                  <li key={i} className="sv-pedido-item">
                    <span>{item.nombre}</span>
                    <span>${item.precio?.toLocaleString("es-MX")} MXN</span>
                  </li>
                ))}
              </ul>

              <div className="sv-pedido-footer">
                <span className="sv-pedido-metodo">
                  {pedido.metodoPago === "deposito" ? "Depósito bancario" : "Transferencia bancaria"}
                </span>
                <span className="sv-pedido-total">
                  Total: <strong>${pedido.total?.toLocaleString("es-MX")} MXN</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {pedidoSeleccionado && (
        <ModalPedido
          pedido={pedidoSeleccionado}
          onCerrar={() => setPedidoSeleccionado(null)}
        />
      )}
    </div>
  );
}