// src/pages/Soporte.jsx
import { useState } from "react";
import { getFirebaseDb } from "../firebase/config";
import {
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoCircleIcon,
  BookOpenIcon,
  CreditCardIcon,
  HeadphonesIcon,
  ChevronDownIcon,
  BankIcon,
  ClockIcon,
} from "../components/Icons";
import "./Soporte.css";

const FAQS = [
  {
    categoria: "Dispositivo",
    pregunta: "¿Cómo activo la función de detección de obstáculos?",
    respuesta:
      "Activa la detección de obstáculos presionando el botón lateral del bastón durante 2 segundos. Un pitido corto confirmará que la función está activa. Para desactivarla, repite el mismo proceso.",
  },
  {
    categoria: "Dispositivo",
    pregunta: "¿Cómo utilizo el botón de pánico?",
    respuesta:
      "Mantén presionado el botón de pánico durante 3 segundos. El dispositivo emitirá una alerta sonora y enviará automáticamente tu ubicación GPS a los contactos de emergencia que hayas configurado en la aplicación.",
  },
  {
    categoria: "Dispositivo",
    pregunta: "¿Qué hago si el bastón no enciende?",
    respuesta:
      "Verifica que la batería tenga carga suficiente conectándolo al cargador durante al menos 30 minutos. Si el problema persiste, restablece el dispositivo manteniendo presionado el botón de encendido durante 10 segundos. Si continúa sin encender, comunícate con soporte técnico.",
  },
  {
    categoria: "Dispositivo",
    pregunta: "¿Cómo actualizo el firmware del bastón?",
    respuesta:
      "Las actualizaciones de firmware se aplican automáticamente cuando el dispositivo está conectado a la red a través de la aplicación oficial. Para verificar la versión instalada, accede a Configuración > Información del dispositivo > Versión de firmware dentro de la app.",
  },
  {
    categoria: "Pagos",
    pregunta: "¿Cuáles son los métodos de pago aceptados?",
    respuesta:
      "Aceptamos depósito bancario en efectivo y transferencia electrónica, ambos a través de BBVA. Al elegir tu método de pago en la página de pago, verás los datos bancarios completos una vez confirmado el pedido.",
  },
  {
    categoria: "Pagos",
    pregunta: "¿Cómo realizo un depósito o transferencia por BBVA?",
    respuesta:
      "Puedes realizar el pago depositando en efectivo en cualquier sucursal BBVA, o mediante transferencia desde tu banca en línea utilizando la CLABE interbancaria. Los datos bancarios específicos se muestran tras confirmar tu orden en el formulario de pago para asegurar el correcto seguimiento de tu cuenta.",
  },
  {
    categoria: "Pagos",
    pregunta: "¿Cuándo se confirma mi pago?",
    respuesta:
      "Una vez que realizas el depósito o transferencia y envías el comprobante, nuestro equipo verifica la transacción en un plazo máximo de 24 horas hábiles. Recibirás un correo de confirmación con el estado de tu pedido al momento de la verificación.",
  },
  {
    categoria: "Pedidos",
    pregunta: "¿Cuánto tiempo tarda la entrega de mi pedido?",
    respuesta:
      "El tiempo estimado de entrega es de 5 a 10 días hábiles contados a partir de la confirmación del pago. Para zonas metropolitanas, el tiempo puede reducirse a 3 a 5 días hábiles. Recibirás un número de seguimiento por correo electrónico una vez que tu pedido sea enviado.",
  },
  {
    categoria: "Pedidos",
    pregunta: "¿Puedo devolver o cambiar el producto?",
    respuesta:
      "Sí, contamos con una garantía de 30 días a partir de la fecha de entrega. Si el producto presenta defectos de fabricación o fallas técnicas, puedes solicitar cambio o reembolso contactando a nuestro equipo de soporte con tu comprobante de compra.",
  },
];

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_NOMBRE = /^[a-zA-ZÀ-ÿ\s]+$/;
const REGEX_TELEFONO = /^[0-9]{10}$/;

function validarFormulario(form) {
  const errores = {};
  if (!form.nombre.trim()) {
    errores.nombre = "El nombre es obligatorio.";
  } else if (form.nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 caracteres.";
  } else if (form.nombre.trim().length > 80) {
    errores.nombre = "El nombre no puede superar 80 caracteres.";
  } else if (!REGEX_NOMBRE.test(form.nombre.trim())) {
    errores.nombre = "El nombre solo puede contener letras y espacios.";
  }
  if (!form.correo.trim()) {
    errores.correo = "El correo electrónico es obligatorio.";
  } else if (!REGEX_EMAIL.test(form.correo.trim())) {
    errores.correo = "Ingresa un correo electrónico válido (ej. usuario@correo.com).";
  }
  if (form.telefono.trim() && !REGEX_TELEFONO.test(form.telefono.trim())) {
    errores.telefono = "Ingresa un número de teléfono válido a 10 dígitos.";
  }
  if (!form.asunto.trim()) {
    errores.asunto = "El asunto es obligatorio.";
  } else if (form.asunto.trim().length < 5) {
    errores.asunto = "El asunto debe tener al menos 5 caracteres.";
  } else if (form.asunto.trim().length > 120) {
    errores.asunto = "El asunto no puede superar 120 caracteres.";
  }
  if (!form.mensaje.trim()) {
    errores.mensaje = "El mensaje es obligatorio.";
  } else if (form.mensaje.trim().length < 20) {
    errores.mensaje = `El mensaje debe tener al menos 20 caracteres (llevas ${form.mensaje.trim().length}).`;
  } else if (form.mensaje.trim().length > 1000) {
    errores.mensaje = "El mensaje excede el límite permitido de 1,000 caracteres.";
  }
  return errores;
}

const CATEGORIAS = ["Todas", "Dispositivo", "Pagos", "Pedidos"];

export default function Soporte() {
  const [faqAbierta, setFaqAbierta] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  function toggleFaq(index) {
    setFaqAbierta((actual) => (actual === index ? null : index));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const nuevoForm = { ...formulario, [name]: value };
    setFormulario(nuevoForm);
    if (tocados[name] || intentoEnvio) {
      setErrores(validarFormulario(nuevoForm));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTocados((prev) => ({ ...prev, [name]: true }));
    setErrores(validarFormulario(formulario));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIntentoEnvio(true);
    setErrorEnvio("");
    const nuevosErrores = validarFormulario(formulario);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      const [{ collection, addDoc, serverTimestamp }, db] = await Promise.all([
        import("firebase/firestore"),
        getFirebaseDb(),
      ]);

      await addDoc(collection(db, "reportes"), {
        nombre: formulario.nombre.trim(),
        correo: formulario.correo.trim(),
        telefono: formulario.telefono.trim() || null,
        asunto: formulario.asunto.trim(),
        mensaje: formulario.mensaje.trim(),
        estado: "pendiente",
        creadoEn: serverTimestamp(),
      });

      setEnviado(true);
      setFormulario({ nombre: "", correo: "", telefono: "", asunto: "", mensaje: "" });
      setTocados({});
      setIntentoEnvio(false);
    } catch (err) {
      console.error(err);
      setErrorEnvio(
        "No se pudo enviar tu mensaje. Verifica tu conexión e inténtalo nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  const faqsFiltradas = FAQS.filter((faq) => {
    const termino = busqueda.toLowerCase();
    const matchBusqueda =
      faq.pregunta.toLowerCase().includes(termino) ||
      faq.respuesta.toLowerCase().includes(termino);
    const matchCategoria =
      categoriaActiva === "Todas" || faq.categoria === categoriaActiva;
    return matchBusqueda && matchCategoria;
  });

  const mostrarError = (campo) => errores[campo] && (tocados[campo] || intentoEnvio);
  const mostrarOk = (campo) =>
    !errores[campo] && (tocados[campo] || intentoEnvio) && formulario[campo].trim();

  function scrollA(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="sv-soporte">

      {/* ====== HERO ====== */}
      <section className="sv-soporte-hero">
        <div className="container sv-hero-inner">
          <h1 className="sv-hero-titulo">Centro de Soporte</h1>
          <p className="sv-hero-subtitulo">
            Encuentra respuestas, conoce nuestros canales de contacto o comunícate
            directamente con nuestro equipo de atención.
          </p>
          <div className="sv-busqueda">
            <input
              type="search"
              placeholder="¿En qué podemos ayudarte?"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setCategoriaActiva("Todas");
              }}
              aria-label="Buscar en preguntas frecuentes"
            />
          </div>
        </div>
      </section>

      {/* ====== ACCESO RÁPIDO ====== */}
      <section className="sv-acceso-rapido container" aria-label="Acceso rápido">
        <button className="sv-acceso-card" onClick={() => scrollA("faq")}>
          <span className="sv-acceso-icono"><InfoCircleIcon size={26} /></span>
          <span className="sv-acceso-label">Preguntas frecuentes</span>
        </button>
        <button className="sv-acceso-card" onClick={() => scrollA("canales")}>
          <span className="sv-acceso-icono"><BookOpenIcon size={26} /></span>
          <span className="sv-acceso-label">Canales de contacto</span>
        </button>
        <button className="sv-acceso-card" onClick={() => scrollA("pagos-soporte")}>
          <span className="sv-acceso-icono"><CreditCardIcon size={26} /></span>
          <span className="sv-acceso-label">Soporte de pagos</span>
        </button>
        <button className="sv-acceso-card" onClick={() => scrollA("contacto")}>
          <span className="sv-acceso-icono"><HeadphonesIcon size={26} /></span>
          <span className="sv-acceso-label">Contacto directo</span>
        </button>
      </section>
      <br />
      {/* ====== FAQ ====== */}
      <section className="sv-faq container" id="faq">
        <div className="sv-seccion-header">
          <h2 className="sv-seccion-titulo">Preguntas Frecuentes</h2>
          <p className="sv-seccion-desc">
            Consulta las respuestas a las dudas más comunes sobre el bastón inteligente Sense Vision.
          </p>
        </div>

        <div className="sv-faq-filtros" role="group" aria-label="Filtrar por categoría">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              className={`sv-filtro-btn${categoriaActiva === cat ? " sv-filtro-btn--activo" : ""}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="card sv-faq-lista" role="list">
          {faqsFiltradas.length === 0 ? (
            <div className="sv-faq-vacio">
              <InfoCircleIcon size={32} />
              <p>No encontramos resultados para tu búsqueda.</p>
              <button
                className="btn btn-outline"
                onClick={() => { setBusqueda(""); setCategoriaActiva("Todas"); }}
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            faqsFiltradas.map((faq, index) => (
              <div
                className={`sv-faq-item${faqAbierta === index ? " sv-faq-item--abierto" : ""}`}
                key={index}
                role="listitem"
              >
                <button
                  className="sv-faq-pregunta"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={faqAbierta === index}
                >
                  <span className="sv-faq-cat">{faq.categoria}</span>
                  <span className="sv-faq-texto">{faq.pregunta}</span>
                  <span className="sv-faq-chevron">
                    <ChevronDownIcon size={18} />
                  </span>
                </button>
                {faqAbierta === index && (
                  <div className="sv-faq-respuesta">
                    <p>{faq.respuesta}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
      <br />
      {/* ====== CANALES DE CONTACTO ====== */}
      <section className="sv-canales container" id="canales">
        <div className="sv-seccion-header">
          <h2 className="sv-seccion-titulo">Canales de Contacto</h2>
          <p className="sv-seccion-desc">
            Elige el medio que prefieras para comunicarte con nuestro equipo de
            atención a clientes.
          </p>
        </div>

        <div className="sv-canales-grid">
          <div className="card sv-canal-card">
            <span className="sv-canal-icono"><MailIcon size={26} /></span>
            <div className="sv-canal-contenido">
              <h3>Correo Electrónico</h3>
              <p>Escríbenos para dudas generales, soporte técnico o información sobre tu pedido.</p>
              <a href="mailto:sensevision0@gmail.com" className="btn btn-outline sv-canal-btn">
                sensevision0@gmail.com
              </a>
            </div>
          </div>

          <div className="card sv-canal-card">
            <span className="sv-canal-icono"><PhoneIcon size={26} /></span>
            <div className="sv-canal-contenido">
              <h3>Línea Telefónica</h3>
              <p>Comunícate directamente con nuestro equipo en horario de atención.</p>
              <a href="tel:4351203525" className="btn btn-outline sv-canal-btn">
                435 120 3525
              </a>
            </div>
          </div>

          <div className="card sv-canal-card">
            <span className="sv-canal-icono"><ClockIcon size={26} /></span>
            <div className="sv-canal-contenido">
              <h3>Horario de Atención</h3>
              <p>
                Lunes a viernes de 9:00 a.m. a 6:00 p.m. y sábados de 9:00 a.m. a 2:00 p.m.
                Fuera de este horario, tu mensaje será respondido el siguiente día hábil.
              </p>
            </div>
          </div>
        </div>
      </section>
       <br />
      {/* ====== SOPORTE PARA PAGOS ====== */}
      <section className="sv-pagos-soporte container" id="pagos-soporte">
        <div className="sv-seccion-header">
          <h2 className="sv-seccion-titulo">Soporte para Pagos</h2>
          <p className="sv-seccion-desc">
            Información sobre métodos de pago aceptados y asistencia para depósitos y transferencias bancarias.
          </p>
        </div>

        <div className="sv-pagos-grid">
          {/* SECCIÓN MODIFICADA: Sustitución de datos duros por flujo dinámico guiado por íconos */}
          <div className="card sv-banco-card">
            <div className="sv-banco-encabezado">
              <span className="sv-banco-icono-wrap"><BankIcon size={20} /></span>
              <h3>Asignación de Datos Bancarios</h3>
            </div>

            <p className="sv-banco-desc">
              Para garantizar la seguridad de tus transacciones y vincular correctamente cada depósito con su orden, los números de cuenta y CLABE de <strong>BBVA</strong> no se muestran de forma pública en este apartado.
            </p>

            <div className="sv-banco-pasos" style={{ display: "flex", flexDirection: "column", gap: "15px", margin: "20px 0" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ color: "var(--color-accent)", marginTop: "2px" }}><CreditCardIcon size={18} /></span>
                <div>
                  <strong>1. Generación desde el Módulo de Pago</strong>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: "1.4" }}>
                    Completa tus datos de envío en el carrito de compras y selecciona tu método preferido (Depósito en efectivo o Transferencia interbancaria).
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ color: "var(--color-secondary)", marginTop: "2px" }}><CheckCircleIcon size={18} /></span>
                <div>
                  <strong>2. Visualización y Confirmación Única</strong>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: "1.4" }}>
                    Al hacer clic en "Confirmar y finalizar pedido", el sistema guardará la orden de tu bastón en la base de datos y renderizará de inmediato las cuentas oficiales en una vista limpia.
                  </p>
                </div>
              </div>
            </div>

            <div className="sv-banco-aviso">
              <InfoCircleIcon size={15} />
              <p>
                Si ya confirmaste un pedido pero cerraste la ventana del navegador antes de guardar la información de la cuenta, por favor comunícate directamente a nuestros canales oficiales con tu nombre completo para validar el estatus de la orden.
              </p>
            </div>
          </div>

          <div className="card sv-pagos-ayuda-card">
            <span className="sv-pagos-ayuda-icono"><HeadphonesIcon size={30} /></span>
            <h3>¿Problemas con tu pago?</h3>
            <p>
              Si tienes dificultades para completar un depósito o transferencia, o no
              recibes la confirmación de tu pago, comunícate directamente con nuestro
              equipo de soporte.
            </p>
            <ul className="sv-mini-contacto">
              <li>
                <span className="sv-mini-icono"><MailIcon size={16} /></span>
                <a href="mailto:sensevisio0@gmail.com">sensevisio0@gmail.com</a>
              </li>
              <li>
                <span className="sv-mini-icono"><PhoneIcon size={16} /></span>
                <a href="tel:4351203525">435 120 3525</a>
              </li>
            </ul>
            <div className="sv-tiempo-resp">
              <ClockIcon size={14} />
              <span>Tiempo de respuesta: máximo 24 horas hábiles</span>
            </div>
          </div>
        </div>
      </section>
       <br />
      {/* ====== CONTACTO ====== */}
      <section className="sv-contacto container" id="contacto">
        <div className="sv-seccion-header">
          <h2 className="sv-seccion-titulo">Contáctanos</h2>
          <p className="sv-seccion-desc">
            ¿No encontraste lo que buscabas? Envíanos un mensaje y te responderemos a la brevedad.
          </p>
        </div>

        <div className="sv-contacto-grid">

          {/* --- Formulario --- */}
          <div className="card sv-contacto-form-card">
            <h3>Formulario de Contacto</h3>

            {enviado && (
              <div className="sv-contacto-exito" role="alert">
                <CheckCircleIcon size={18} />
                <span>
                  Tu mensaje fue enviado correctamente. Te responderemos en un plazo
                  máximo de 48 horas hábiles.
                </span>
              </div>
            )}

            {errorEnvio && (
              <div className="sv-contacto-error" role="alert">
                <AlertCircleIcon size={18} />
                <span>{errorEnvio}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="nombre">
                  Nombre completo <span className="campo-req">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={mostrarError("nombre") ? "input-error" : mostrarOk("nombre") ? "input-ok" : ""}
                  placeholder="Ej. María García López"
                  maxLength={80}
                  autoComplete="name"
                />
                {mostrarError("nombre") && (
                  <span className="form-error-msg">
                    <AlertCircleIcon size={13} /> {errores.nombre}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="correo">
                  Correo electrónico <span className="campo-req">*</span>
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={formulario.correo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={mostrarError("correo") ? "input-error" : mostrarOk("correo") ? "input-ok" : ""}
                  placeholder="Ej. maria@correo.com"
                  autoComplete="email"
                />
                {mostrarError("correo") && (
                  <span className="form-error-msg">
                    <AlertCircleIcon size={13} /> {errores.correo}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="telefono">
                  Teléfono <span className="sv-campo-opcional">(opcional)</span>
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  inputMode="numeric"
                  value={formulario.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={mostrarError("telefono") ? "input-error" : ""}
                  placeholder="Ej. 4351203525"
                  maxLength={10}
                  autoComplete="tel"
                />
                {mostrarError("telefono") && (
                  <span className="form-error-msg">
                    <AlertCircleIcon size={13} /> {errores.telefono}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="asunto">
                  Asunto <span className="campo-req">*</span>
                </label>
                <input
                  id="asunto"
                  name="asunto"
                  value={formulario.asunto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={mostrarError("asunto") ? "input-error" : mostrarOk("asunto") ? "input-ok" : ""}
                  placeholder="Ej. Problema con mi pedido"
                  maxLength={120}
                  autoComplete="off"
                />
                {mostrarError("asunto") && (
                  <span className="form-error-msg">
                    <AlertCircleIcon size={13} /> {errores.asunto}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">
                  Mensaje <span className="campo-req">*</span>
                  <span className="sv-contador">{formulario.mensaje.length}/1000</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  value={formulario.mensaje}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={mostrarError("mensaje") ? "input-error" : mostrarOk("mensaje") ? "input-ok" : ""}
                  placeholder="Describe tu consulta o problema con el mayor detalle posible."
                  maxLength={1000}
                />
                {mostrarError("mensaje") && (
                  <span className="form-error-msg">
                    <AlertCircleIcon size={13} /> {errores.mensaje}
                  </span>
                )}
              </div>

              <p className="sv-campo-req-nota">
                <span className="campo-req">*</span> Campos obligatorios
              </p>

              <button type="submit" className="btn btn-primary sv-submit-btn" disabled={enviando}>
                {enviando ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </div>

          {/* --- Info lateral --- */}
          <div className="sv-contacto-lateral">
            <div className="card sv-contacto-directo">
              <h3>Contacto Directo</h3>
              <p className="sv-contacto-intro">
                Para atención inmediata, comunícate con nuestro equipo a través de
                los siguientes medios oficiales:
              </p>
              <ul className="sv-contacto-lista">
                <li>
                  <span className="sv-contacto-icono-wrap">
                    <MailIcon size={18} />
                  </span>
                  <div className="sv-contacto-dato">
                    <span className="sv-contacto-etiqueta">Correo electrónico</span>
                    <a
                      href="mailto:sensevision0@gmail.com"
                      className="sv-contacto-valor"
                    >
                      sensevision0@gmail.com
                    </a>
                  </div>
                </li>
                <li>
                  <span className="sv-contacto-icono-wrap">
                    <PhoneIcon size={18} />
                  </span>
                  <div className="sv-contacto-dato">
                    <span className="sv-contacto-etiqueta">Teléfono</span>
                    <a href="tel:4351203525" className="sv-contacto-valor">
                      435 120 3525
                    </a>
                  </div>
                </li>
              </ul>
              <div className="sv-horario">
                <h4>Horario de atención</h4>
                <p>Lunes a viernes: 9:00 a.m. — 6:00 p.m.</p>
                <p>Sábados: 9:00 a.m. — 2:00 p.m.</p>
              </div>
            </div>

            <div className="card sv-estado-card">
              <h3>Estado del Servicio</h3>
              <ul className="sv-estado-lista">
                <li>
                  <CheckCircleIcon size={16} className="sv-estado-ok" />
                  <span>Soporte técnico operando con normalidad</span>
                </li>
                <li>
                  <CheckCircleIcon size={16} className="sv-estado-ok" />
                  <span>Procesamiento de pedidos activo</span>
                </li>
                <li>
                  <CheckCircleIcon size={16} className="sv-estado-ok" />
                  <span>Actualizaciones de firmware disponibles</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}