// src/pages/Pago.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getFirebaseDb } from "../firebase/config";
import { AlertCircleIcon } from "../components/Icons";
import "./Pago.css";

const DATOS_BANCARIOS = {
  banco: "BBVA",
  titular: "Sense Vision S.A. de C.V.",
  cuenta: "0123456789",
  clabe: "012180001234567895",
};

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_NOMBRE = /^[a-zA-ZÀ-ÿ\s]+$/;
const REGEX_TEL = /^\d{10}$/;
const REGEX_CP = /^\d{5}$/;
const REGEX_CIUDAD = /^[a-zA-ZÀ-ÿ\s]+$/;

function validarDatosEnvio(datos) {
  const err = {};

  if (!datos.nombre.trim()) {
    err.nombre = "El nombre completo es obligatorio.";
  } else if (datos.nombre.trim().length < 3) {
    err.nombre = "El nombre debe tener al menos 3 caracteres.";
  } else if (!REGEX_NOMBRE.test(datos.nombre.trim())) {
    err.nombre = "El nombre solo puede contener letras y espacios.";
  }

  if (!datos.direccion.trim()) {
    err.direccion = "La dirección es obligatoria.";
  } else if (datos.direccion.trim().length < 10) {
    err.direccion = "Ingresa tu dirección completa (calle, número, colonia).";
  }

  if (!datos.ciudad.trim()) {
    err.ciudad = "La ciudad es obligatoria.";
  } else if (datos.ciudad.trim().length < 3) {
    err.ciudad = "El nombre de la ciudad debe tener al menos 3 caracteres.";
  } else if (!REGEX_CIUDAD.test(datos.ciudad.trim())) {
    err.ciudad = "La ciudad solo puede contener letras y espacios.";
  }

  if (!datos.codigoPostal.trim()) {
    err.codigoPostal = "El código postal es obligatorio.";
  } else if (!REGEX_CP.test(datos.codigoPostal.trim())) {
    err.codigoPostal = "El código postal debe tener exactamente 5 dígitos numéricos.";
  }

  if (!datos.telefono.trim()) {
    err.telefono = "El teléfono de contacto es obligatorio.";
  } else if (!REGEX_TEL.test(datos.telefono.replace(/[\s-]/g, ""))) {
    err.telefono = "Ingresa un número de teléfono válido de 10 dígitos (sin espacios ni guiones).";
  }

  if (!datos.telefonoPanico.trim()) {
    err.telefonoPanico = "El teléfono para el botón de pánico es obligatorio.";
  } else if (!REGEX_TEL.test(datos.telefonoPanico.replace(/[\s-]/g, ""))) {
    err.telefonoPanico = "Ingresa un número de teléfono válido de 10 dígitos.";
  }

  if (!datos.especificaciones.trim()) {
    err.especificaciones = "Las especificaciones de domicilio son obligatorias.";
  } else if (datos.especificaciones.trim().length < 10) {
    err.especificaciones = "Describe con más detalle tu domicilio (mínimo 10 caracteres).";
  }

  if (!datos.correo.trim()) {
    err.correo = "El correo electrónico es obligatorio.";
  } else if (!REGEX_EMAIL.test(datos.correo.trim())) {
    err.correo = "Ingresa un correo electrónico válido.";
  }

  return err;
}

function CampoFormulario({ id, name, label, value, onChange, onBlur, error, showError, showOk, disabled, children, ...rest }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label} <span className="campo-req">*</span>
      </label>
      {children || (
        <input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={showError ? "input-error" : showOk ? "input-ok" : ""}
          {...rest}
        />
      )}
      {showError && (
        <span className="form-error-msg">
          <AlertCircleIcon size={13} /> {error}
        </span>
      )}
    </div>
  );
}

export default function Pago() {
  const { items, total, limpiarCarrito } = useCart();
  const { user } = useAuth();

  // Estados
  const [paso, setPaso] = useState(1); 
  const [totalFinal, setTotalFinal] = useState(0); // NUEVO ESTADO: Guarda el monto antes de limpiar el carrito

  const [metodoPago, setMetodoPago] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const [datosEnvio, setDatosEnvio] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    telefonoPanico: "",
    especificaciones: "",
    correo: user?.email || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    const soloDigitos = ["telefono", "telefonoPanico", "codigoPostal"];
    const nuevoValor = soloDigitos.includes(name) ? value.replace(/\D/g, "") : value;
    const nuevos = { ...datosEnvio, [name]: nuevoValor };
    
    setDatosEnvio(nuevos);

    if (tocados[name] || intentoEnvio) {
      setErrores(validarDatosEnvio(nuevos));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTocados((prev) => ({ ...prev, [name]: true }));
    setErrores(validarDatosEnvio(datosEnvio));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorServidor("");

    // --- ACCIÓN DEL BOTÓN: "Proceder con el pago" ---
    if (paso === 1) {
      setIntentoEnvio(true);
      const nuevoErr = validarDatosEnvio(datosEnvio);
      setErrores(nuevoErr);

      if (Object.keys(nuevoErr).length > 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!metodoPago) {
        setErrorServidor("Selecciona un método de pago para continuar.");
        return;
      }
      if (items.length === 0) {
        setErrorServidor("Tu carrito está vacío. Agrega un bastón antes de continuar.");
        return;
      }

      // Todo válido: Avanza al paso de revisión
      setPaso(2);
      return;
    }

    // --- ACCIÓN DEL BOTÓN: "Confirmar y finalizar pedido" ---
    if (paso === 2) {
      setEnviando(true);
      try {
        const [{ addDoc, collection, serverTimestamp }, db] = await Promise.all([
          import("firebase/firestore"),
          getFirebaseDb(),
        ]);

        await addDoc(collection(db, "pedidos"), {
          usuarioId: user?.uid || null,
          usuarioCorreo: user?.email || datosEnvio.correo,
          datosEnvio,
          items,
          total,
          metodoPago,
          estado: "pendiente_pago",
          creadoEn: serverTimestamp(),
        });

        setTotalFinal(total); // <-- AQUÍ CONGELAMOS EL TOTAL
        limpiarCarrito(); // <-- Y LUEGO LIMPIAMOS EL CARRITO
        setPaso(3); 
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error(err);
        setErrorServidor("Ocurrió un error al registrar tu pedido. Inténtalo de nuevo.");
      } finally {
        setEnviando(false);
      }
    }
  }

  const mE = (campo) => errores[campo] && (tocados[campo] || intentoEnvio);
  const mO = (campo) => !errores[campo] && (tocados[campo] || intentoEnvio) && datosEnvio[campo]?.trim?.();
  const totalErrores = intentoEnvio ? Object.keys(errores).length : 0;

  // ==========================================
  // PANTALLA FINAL: ÉXITO Y DATOS BANCARIOS
  // ==========================================
  if (paso === 3) {
    return (
      <div className="sv-pago container sv-pago-exito" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 className="section-title">¡Pedido Recibido con Éxito!</h1>
        <p className="section-subtitle">
          Tu orden ha sido registrada. Realiza tu pago para comenzar con el envío.
        </p>

        <div className="card sv-pago-card">
          <h2>Información para tu Pago</h2>
          <p>Utiliza los siguientes datos de <strong>BBVA</strong>:</p>
          
          <ul className="sv-lista-banco" style={{ textAlign: 'left', background: '#f5f7fa', padding: '20px', borderRadius: '8px', listStyle: 'none' }}>
            <li><strong>Banco:</strong> {DATOS_BANCARIOS.banco}</li>
            <li><strong>Titular:</strong> {DATOS_BANCARIOS.titular}</li>
            {metodoPago === "deposito" ? (
              <li><strong>Número de Cuenta:</strong> {DATOS_BANCARIOS.cuenta}</li>
            ) : (
              <li><strong>CLABE:</strong> {DATOS_BANCARIOS.clabe}</li>
            )}
            {/* AQUÍ USAMOS totalFinal EN LUGAR DE total */}
            <li style={{ marginTop: '10px', fontSize: '1.2rem' }}><strong>Monto Total:</strong> ${totalFinal.toLocaleString("es-MX")}</li>
          </ul>

          <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#555' }}>
            Una vez realizado tu {metodoPago === "deposito" ? "depósito" : "transferencia"}, envía tu comprobante a <a href="mailto:sensevision0@gmail.com">sensevision0@gmail.com</a> o al WhatsApp <a href="tel:4351203525">435 120 3525</a>.
          </p>

          <Link to="/" className="btn btn-accent" style={{ display: 'inline-block', marginTop: '20px' }}>
            Volver a la Página Principal
          </Link>
        </div>
        <br />
      </div>

    );
  }

  // ==========================================
  // VISTA PRINCIPAL: FORMULARIO Y RESUMEN (DOS COLUMNAS)
  // ==========================================
  return (
    <div className="sv-pago container">
      <h1 className="section-title">Formulario de Envío y Pago</h1>
      <p className="section-subtitle">Completa tus datos y selecciona tu método de pago.</p>

      {totalErrores > 0 && intentoEnvio && paso === 1 && (
        <div className="sv-pago-alerta-errores">
          <AlertCircleIcon size={16} />
          Hay {totalErrores} campo{totalErrores > 1 ? "s" : ""} con errores. Revísalos antes de continuar.
        </div>
      )}

      <form onSubmit={handleSubmit} className="sv-pago-grid" noValidate>
        
        {/* COLUMNA IZQUIERDA: DATOS DE ENVÍO */}
        <div className="card sv-pago-card">
          <h2>Datos de Envío</h2>
          <p className="sv-campos-req-nota"><span className="campo-req">*</span> Campos obligatorios</p>

          <CampoFormulario
            id="nombre" name="nombre" label="Nombre Completo"
            value={datosEnvio.nombre} onChange={handleChange} onBlur={handleBlur}
            error={errores.nombre} showError={mE("nombre")} showOk={mO("nombre")}
            disabled={paso === 2} placeholder="Ej. María García López" maxLength={80}
          />

          <CampoFormulario
            id="direccion" name="direccion" label="Dirección (calle, número, colonia)"
            value={datosEnvio.direccion} onChange={handleChange} onBlur={handleBlur}
            error={errores.direccion} showError={mE("direccion")} showOk={mO("direccion")}
            disabled={paso === 2} placeholder="Ej. Av. Insurgentes Sur 1234, Col. Del Valle" maxLength={200}
          />

          <div className="sv-pago-row">
            <CampoFormulario
              id="ciudad" name="ciudad" label="Ciudad"
              value={datosEnvio.ciudad} onChange={handleChange} onBlur={handleBlur}
              error={errores.ciudad} showError={mE("ciudad")} showOk={mO("ciudad")}
              disabled={paso === 2} placeholder="Ej. Ciudad de México" maxLength={80}
            />

            <CampoFormulario
              id="codigoPostal" name="codigoPostal" label="Código Postal"
              value={datosEnvio.codigoPostal} onChange={handleChange} onBlur={handleBlur}
              error={errores.codigoPostal} showError={mE("codigoPostal")} showOk={mO("codigoPostal")}
              disabled={paso === 2} placeholder="Ej. 06600" maxLength={5} inputMode="numeric"
            />
          </div>

          <CampoFormulario
            id="telefono" name="telefono" label="Teléfono de contacto"
            value={datosEnvio.telefono} onChange={handleChange} onBlur={handleBlur}
            error={errores.telefono} showError={mE("telefono")} showOk={mO("telefono")}
            disabled={paso === 2} placeholder="10 dígitos, Ej. 5512345678" maxLength={10} inputMode="tel"
          />

          <div className="form-group">
            <label htmlFor="telefonoPanico">
              Teléfono para Botón de Pánico <span className="campo-req">*</span>
            </label>
            <input
              id="telefonoPanico" name="telefonoPanico"
              value={datosEnvio.telefonoPanico} onChange={handleChange} onBlur={handleBlur}
              disabled={paso === 2}
              className={mE("telefonoPanico") ? "input-error" : mO("telefonoPanico") ? "input-ok" : ""}
              placeholder="10 dígitos, Ej. 5598765432" maxLength={10} inputMode="tel"
            />
            {mE("telefonoPanico") && (
              <span className="form-error-msg"><AlertCircleIcon size={13} /> {errores.telefonoPanico}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="especificaciones">
              Especificaciones del Domicilio <span className="campo-req">*</span>
            </label>
            <input
              id="especificaciones" name="especificaciones"
              value={datosEnvio.especificaciones} onChange={handleChange} onBlur={handleBlur}
              disabled={paso === 2}
              className={mE("especificaciones") ? "input-error" : mO("especificaciones") ? "input-ok" : ""}
              placeholder="Ej. Edificio B, Piso 3" maxLength={300}
            />
            {mE("especificaciones") && (
              <span className="form-error-msg"><AlertCircleIcon size={13} /> {errores.especificaciones}</span>
            )}
          </div>

          <CampoFormulario
            id="correo" name="correo" label="Correo Electrónico"
            value={datosEnvio.correo} onChange={handleChange} onBlur={handleBlur}
            error={errores.correo} showError={mE("correo")} showOk={mO("correo")}
            disabled={paso === 2} type="email" placeholder="Ej. maria@correo.com"
          />
        </div>

        {/* COLUMNA DERECHA: MÉTODO DE PAGO, RESUMEN DE BASTONES Y BOTÓN */}
        <div className="card sv-pago-card">
          <h2>Método de Pago</h2>

          <div className="sv-metodo-opciones">
            <label className={`sv-metodo-card ${metodoPago === "deposito" ? "sv-metodo-card--activa" : ""}`}>
              <input
                type="radio" name="metodoPago" value="deposito"
                checked={metodoPago === "deposito"}
                onChange={(e) => setMetodoPago(e.target.value)}
                disabled={paso === 2}
              />
              <div>
                <strong>Depósito Bancario</strong>
                <p>Pago en efectivo o practicaja.</p>
              </div>
            </label>

            <label className={`sv-metodo-card ${metodoPago === "transferencia" ? "sv-metodo-card--activa" : ""}`}>
              <input
                type="radio" name="metodoPago" value="transferencia"
                checked={metodoPago === "transferencia"}
                onChange={(e) => setMetodoPago(e.target.value)}
                disabled={paso === 2}
              />
              <div>
                <strong>Transferencia Bancaria</strong>
                <p>Desde tu banca móvil.</p>
              </div>
            </label>
          </div>

          <div className="sv-pago-resumen">
            <h3>Resumen del pedido</h3>
            <ul>
              {items.map((item, i) => (
                <li key={i}>{item.nombre}: ${item.precio.toLocaleString("es-MX")}</li>
              ))}
            </ul>
            <p className="sv-pago-total">Total a pagar: <strong>${total.toLocaleString("es-MX")}</strong></p>
          </div>

          {errorServidor && (
            <div className="sv-pago-error">
              <AlertCircleIcon size={15} />
              {errorServidor}
            </div>
          )}

          {/* CONTROL DE BOTONES SEGÚN EL PASO */}
          {paso === 1 ? (
            <button type="submit" className="btn btn-accent sv-pago-submit">
              Proceder con el pago
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "10px", borderRadius: "8px", textAlign: "center", marginBottom: "10px" }}>
                <strong>✓ Todo correcto.</strong> Por favor, confirma tu pedido.
              </div>
              <button type="submit" className="btn btn-accent sv-pago-submit" disabled={enviando}>
                {enviando ? "Procesando..." : "Confirmar y finalizar pedido"}
              </button>
              <button 
                type="button" 
                onClick={() => setPaso(1)} 
                disabled={enviando}
                style={{ background: "transparent", border: "1px solid #ccc", padding: "10px", borderRadius: "8px", cursor: "pointer" }}>
                Regresar a editar datos
              </button>
            </div>
          )}

        </div>
      </form>
      <br />
    </div>
  );
}