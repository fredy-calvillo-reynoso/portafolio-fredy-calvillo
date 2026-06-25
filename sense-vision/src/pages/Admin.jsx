// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import { getFirebaseDb } from "../firebase/config";
import "./Admin.css";

const ESTADOS = ["pendiente_pago", "pago_confirmado", "en_proceso", "enviado", "entregado"];
const ESTADOS_REPORTE = ["pendiente", "en_revision", "resuelto"];

// Verifica si una fecha de Firestore (Timestamp) cae dentro del
// rango [inicio, fin] definido por dos inputs type="date" (YYYY-MM-DD).
function fechaDentroDeRango(timestamp, inicio, fin) {
  if (!inicio && !fin) return true;
  if (!timestamp?.toDate) return true;
  const fecha = timestamp.toDate();
  if (inicio && fecha < new Date(`${inicio}T00:00:00`)) return false;
  if (fin && fecha > new Date(`${fin}T23:59:59`)) return false;
  return true;
}

// Formatea un Timestamp de Firestore a una fecha legible (es-MX).
function formatearFecha(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Admin() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [vista, setVista] = useState("pedidos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Filtros — Pedidos
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState("todos");
  const [fechaInicioPedido, setFechaInicioPedido] = useState("");
  const [fechaFinPedido, setFechaFinPedido] = useState("");

  // Filtros — Reportes
  const [filtroEstadoReporte, setFiltroEstadoReporte] = useState("todos");
  const [fechaInicioReporte, setFechaInicioReporte] = useState("");
  const [fechaFinReporte, setFechaFinReporte] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    setError("");
    try {
      // Carga diferida: "firebase/firestore" solo se descarga al
      // entrar al panel de administración.
      const [{ collection, getDocs, orderBy, query }, db] = await Promise.all([
        import("firebase/firestore"),
        getFirebaseDb(),
      ]);

      const pedidosSnap = await getDocs(query(collection(db, "pedidos"), orderBy("creadoEn", "desc")));
      setPedidos(pedidosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const usuariosSnap = await getDocs(collection(db, "usuarios"));
      setUsuarios(usuariosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const reportesSnap = await getDocs(query(collection(db, "reportes"), orderBy("creadoEn", "desc")));
      setReportes(reportesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos. Verifica tu conexión a Firebase.");
    } finally {
      setCargando(false);
    }
  }

  async function cambiarEstado(pedidoId, nuevoEstado) {
    try {
      const [{ doc, updateDoc }, db] = await Promise.all([
        import("firebase/firestore"),
        getFirebaseDb(),
      ]);

      await updateDoc(doc(db, "pedidos", pedidoId), { estado: nuevoEstado });
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function cambiarEstadoReporte(reporteId, nuevoEstado) {
    try {
      const [{ doc, updateDoc }, db] = await Promise.all([
        import("firebase/firestore"),
        getFirebaseDb(),
      ]);

      await updateDoc(doc(db, "reportes", reporteId), { estado: nuevoEstado });
      setReportes((prev) =>
        prev.map((r) => (r.id === reporteId ? { ...r, estado: nuevoEstado } : r))
      );
    } catch (err) {
      console.error(err);
    }
  }

  function limpiarFiltrosPedidos() {
    setFiltroEstadoPedido("todos");
    setFechaInicioPedido("");
    setFechaFinPedido("");
  }

  function limpiarFiltrosReportes() {
    setFiltroEstadoReporte("todos");
    setFechaInicioReporte("");
    setFechaFinReporte("");
  }

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideEstado = filtroEstadoPedido === "todos" || p.estado === filtroEstadoPedido;
    const coincideFecha = fechaDentroDeRango(p.creadoEn, fechaInicioPedido, fechaFinPedido);
    return coincideEstado && coincideFecha;
  });

  const reportesFiltrados = reportes.filter((r) => {
    const coincideEstado = filtroEstadoReporte === "todos" || r.estado === filtroEstadoReporte;
    const coincideFecha = fechaDentroDeRango(r.creadoEn, fechaInicioReporte, fechaFinReporte);
    return coincideEstado && coincideFecha;
  });

  const hayFiltrosPedidos = filtroEstadoPedido !== "todos" || fechaInicioPedido || fechaFinPedido;
  const hayFiltrosReportes = filtroEstadoReporte !== "todos" || fechaInicioReporte || fechaFinReporte;

  return (
    <div className="sv-admin container">
      <h1 className="section-title">Panel de Administración</h1>
      <p className="section-subtitle">
        Gestiona pedidos, usuarios y reportes registrados en Sense Vision.
      </p>

      <div className="sv-admin-tabs">
        <button
          className={`sv-admin-tab ${vista === "pedidos" ? "sv-admin-tab--activa" : ""}`}
          onClick={() => setVista("pedidos")}
        >
          Pedidos ({pedidos.length})
        </button>
        <button
          className={`sv-admin-tab ${vista === "usuarios" ? "sv-admin-tab--activa" : ""}`}
          onClick={() => setVista("usuarios")}
        >
          Usuarios ({usuarios.length})
        </button>
        <button
          className={`sv-admin-tab ${vista === "reportes" ? "sv-admin-tab--activa" : ""}`}
          onClick={() => setVista("reportes")}
        >
          Reportes ({reportes.length})
        </button>
      </div>

      {error && <div className="sv-admin-error">{error}</div>}

      {cargando ? (
        <p className="sv-admin-loading">Cargando información...</p>
      ) : vista === "pedidos" ? (
        <>
          <div className="sv-admin-filtros card">
            <div className="sv-admin-filtro-grupo">
              <label htmlFor="filtro-estado-pedido">Estado</label>
              <select
                id="filtro-estado-pedido"
                value={filtroEstadoPedido}
                onChange={(e) => setFiltroEstadoPedido(e.target.value)}
              >
                <option value="todos">Todos</option>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="sv-admin-filtro-grupo">
              <label htmlFor="fecha-inicio-pedido">Desde</label>
              <input
                id="fecha-inicio-pedido"
                type="date"
                value={fechaInicioPedido}
                onChange={(e) => setFechaInicioPedido(e.target.value)}
              />
            </div>
            <div className="sv-admin-filtro-grupo">
              <label htmlFor="fecha-fin-pedido">Hasta</label>
              <input
                id="fecha-fin-pedido"
                type="date"
                value={fechaFinPedido}
                onChange={(e) => setFechaFinPedido(e.target.value)}
              />
            </div>
            {hayFiltrosPedidos && (
              <button type="button" className="btn btn-outline sv-admin-filtro-limpiar" onClick={limpiarFiltrosPedidos}>
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="sv-admin-tabla-wrapper card">
            <table className="sv-admin-tabla">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Correo</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Método</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="sv-admin-vacio">No hay pedidos registrados todavía.</td>
                  </tr>
                ) : pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="sv-admin-vacio">No hay pedidos que coincidan con los filtros seleccionados.</td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>{pedido.datosEnvio?.nombre || "—"}</td>
                      <td>{pedido.usuarioCorreo || "—"}</td>
                      <td>
                        {pedido.items?.map((item, i) => (
                          <div key={i}>{item.nombre}</div>
                        ))}
                      </td>
                      <td>${pedido.total?.toLocaleString("es-MX")}</td>
                      <td>
                        {pedido.metodoPago === "deposito" ? "Depósito bancario" : "Transferencia bancaria"}
                      </td>
                      <td>{formatearFecha(pedido.creadoEn)}</td>
                      <td>
                        <select
                          value={pedido.estado}
                          onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                        >
                          {ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <br />
        </>
) : vista === "usuarios" ? (
        <>
          <div className="sv-admin-tabla-wrapper card">
            <table className="sv-admin-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="sv-admin-vacio">No hay usuarios registrados todavía.</td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.nombre || "—"}</td>
                      <td>{u.correo}</td>
                      <td>
                        <span className={`sv-admin-rol sv-admin-rol--${u.rol}`}>{u.rol}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <br />
        </>
      ) :  (
        
        <>
          <div className="sv-admin-filtros card">
            <div className="sv-admin-filtro-grupo">
              <label htmlFor="filtro-estado-reporte">Estado</label>
              <select
                id="filtro-estado-reporte"
                value={filtroEstadoReporte}
                onChange={(e) => setFiltroEstadoReporte(e.target.value)}
              >
                <option value="todos">Todos</option>
                {ESTADOS_REPORTE.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="sv-admin-filtro-grupo">
              <label htmlFor="fecha-inicio-reporte">Desde</label>
              <input
                id="fecha-inicio-reporte"
                type="date"
                value={fechaInicioReporte}
                onChange={(e) => setFechaInicioReporte(e.target.value)}
              />
            </div>
            <div className="sv-admin-filtro-grupo">
              <label htmlFor="fecha-fin-reporte">Hasta</label>
              <input
                id="fecha-fin-reporte"
                type="date"
                value={fechaFinReporte}
                onChange={(e) => setFechaFinReporte(e.target.value)}
              />
            </div>
            {hayFiltrosReportes && (
              <button type="button" className="btn btn-outline sv-admin-filtro-limpiar" onClick={limpiarFiltrosReportes}>
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="sv-admin-tabla-wrapper card">
            <table className="sv-admin-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Asunto</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reportes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="sv-admin-vacio">No hay reportes registrados todavía.</td>
                  </tr>
                ) : reportesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="sv-admin-vacio">No hay reportes que coincidan con los filtros seleccionados.</td>
                  </tr>
                ) : (
                  reportesFiltrados.map((reporte) => (
                    <tr key={reporte.id}>
                      <td>{reporte.nombre || "—"}</td>
                      <td>
                        <div>{reporte.correo || "—"}</div>
                        {reporte.telefono && <div>{reporte.telefono}</div>}
                      </td>
                      <td>{reporte.asunto || "—"}</td>
                      <td className="sv-admin-mensaje">{reporte.mensaje}</td>
                      <td>{formatearFecha(reporte.creadoEn)}</td>
                      <td>
                        <select
                          value={reporte.estado}
                          onChange={(e) => cambiarEstadoReporte(reporte.id, e.target.value)}
                        >
                          {ESTADOS_REPORTE.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <br />
        </>
      )}
    </div>
  );
}