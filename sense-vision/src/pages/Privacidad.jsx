// src/pages/Privacidad.jsx
import { Link } from "react-router-dom";
import { ArrowLeftIcon, ShieldIcon, LockIcon, FileTextIcon } from "../components/Icons";
import "./Privacidad.css";

const FECHA_ACTUALIZACION = "13 de junio de 2026";
const RESPONSABLE = "Sense Vision S.A. de C.V.";
const DOMICILIO = "Av. Insurgentes Sur 2453, Col. San Ángel, C.P. 01000, Ciudad de México, México.";
const EMAIL_PRIVACIDAD = "privacidad@sensevision.com";
const TEL_PRIVACIDAD = "55 1234 5678";

export default function Privacidad() {
  return (
    <div className="sv-privacidad container">
      <div className="sv-privacidad-header">
        <div className="sv-priv-icon">
          <ShieldIcon size={32} />
        </div>
        <h1 className="section-title">Aviso de Privacidad</h1>
        <p className="section-subtitle">
          En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión
          de los Particulares (LFPDPPP) y su Reglamento.
        </p>
        <div className="sv-priv-meta">
          <span>Última actualización: {FECHA_ACTUALIZACION}</span>
          <span>Versión 1.0</span>
        </div>
      </div>

      <div className="card sv-privacidad-card">

        {/* 1. RESPONSABLE */}
        <section className="sv-priv-section">
          <div className="sv-priv-section-title">
            <FileTextIcon size={18} />
            <h2>I. Identidad y Domicilio del Responsable</h2>
          </div>
          <p>
            <strong>{RESPONSABLE}</strong> (en adelante "Sense Vision" o el "Responsable"), con domicilio
            en {DOMICILIO} es la empresa responsable del uso y protección de sus datos personales
            recopilados a través de nuestro sitio web, aplicación y canales de atención.
          </p>
          <p>
            Para consultas relacionadas con este Aviso de Privacidad o el tratamiento de sus datos
            personales, puede contactarnos a través de:
          </p>
          <ul className="sv-priv-lista-contacto">
            <li><strong>Correo electrónico:</strong> {EMAIL_PRIVACIDAD}</li>
            <li><strong>Teléfono:</strong> {TEL_PRIVACIDAD}</li>
            <li><strong>Domicilio:</strong> {DOMICILIO}</li>
          </ul>
        </section>

        {/* 2. DATOS PERSONALES */}
        <section className="sv-priv-section">
          <div className="sv-priv-section-title">
            <FileTextIcon size={18} />
            <h2>II. Datos Personales que Recabamos</h2>
          </div>
          <p>
            Sense Vision recaba las siguientes categorías de datos personales de manera directa,
            cuando usted los proporciona voluntariamente a través de nuestros formularios digitales
            y canales de atención:
          </p>

          <h3>Datos de identificación y contacto:</h3>
          <ul>
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono fijo o móvil</li>
            <li>Número de teléfono de emergencia (para botón de pánico)</li>
          </ul>

          <h3>Datos de ubicación y entrega:</h3>
          <ul>
            <li>Dirección de envío (calle, número, colonia, ciudad y código postal)</li>
            <li>Especificaciones adicionales de domicilio</li>
          </ul>

          <h3>Datos de acceso a servicios:</h3>
          <ul>
            <li>Nombre de usuario y contraseña de acceso</li>
            <li>Dirección de correo electrónico de autenticación</li>
          </ul>

          <h3>Datos de carácter técnico (recopilados de forma automática):</h3>
          <ul>
            <li>Dirección IP y tipo de navegador</li>
            <li>Datos de uso del sitio mediante cookies y tecnologías similares</li>
            <li>Historial de pedidos y transacciones realizadas</li>
          </ul>

          <div className="sv-priv-nota">
            <LockIcon size={15} />
            <p>
              Sense Vision <strong>no recaba datos personales sensibles</strong> en los términos
              del artículo 3, fracción VI de la LFPDPPP, tales como origen étnico o racial,
              estado de salud, preferencias sexuales, datos biométricos o creencias religiosas.
            </p>
          </div>
        </section>

        {/* 3. FINALIDADES */}
        <section className="sv-priv-section">
          <div className="sv-priv-section-title">
            <FileTextIcon size={18} />
            <h2>III. Finalidades del Tratamiento de Datos</h2>
          </div>

          <h3>Finalidades primarias (necesarias para la relación contractual):</h3>
          <ol>
            <li>Procesar y gestionar sus pedidos de productos Sense Vision.</li>
            <li>Coordinar la entrega y envío de los productos adquiridos a la dirección indicada.</li>
            <li>Configurar el teléfono de emergencia vinculado al botón de pánico del bastón inteligente.</li>
            <li>Verificar su identidad y gestionar su cuenta de usuario.</li>
            <li>Procesar pagos y emitir comprobantes de transacción.</li>
            <li>Brindar soporte técnico y atención posventa sobre los productos adquiridos.</li>
            <li>Dar cumplimiento a obligaciones legales y fiscales aplicables.</li>
          </ol>

          <h3>Finalidades secundarias (opcionales, requieren consentimiento):</h3>
          <ol>
            <li>Enviarle comunicaciones comerciales, novedades y actualizaciones de productos.</li>
            <li>Realizar encuestas de satisfacción y estudios de calidad del servicio.</li>
            <li>Elaborar perfiles de uso para mejorar la experiencia de usuario.</li>
          </ol>

          <p>
            En caso de que no desee que sus datos personales sean tratados para las finalidades
            secundarias, puede manifestarlo en cualquier momento a través del correo
            electrónico: <strong>{EMAIL_PRIVACIDAD}</strong>, indicando en el asunto "Oposición
            a finalidades secundarias".
          </p>
        </section>

        {/* 4. TRANSFERENCIAS */}
        <section className="sv-priv-section">
          <div className="sv-priv-section-title">
            <FileTextIcon size={18} />
            <h2>IV. Transferencia de Datos Personales</h2>
          </div>
          <p>
            Sense Vision no comparte, vende ni arrienda sus datos personales a terceros para
            fines comerciales propios. Sin embargo, podrá realizar las siguientes transferencias
            para el cumplimiento de las finalidades descritas en este Aviso:
          </p>
          <div className="sv-priv-tabla-wrapper">
            <table className="sv-priv-tabla">
              <thead>
                <tr>
                  <th>Destinatario</th>
                  <th>Finalidad</th>
                  <th>Requiere consentimiento</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Empresa de paquetería y logística</td>
                  <td>Entrega de productos adquiridos</td>
                  <td>No (art. 37, fracc. I LFPDPPP)</td>
                </tr>
                <tr>
                  <td>Procesador de pagos y banco</td>
                  <td>Confirmación y procesamiento de pagos</td>
                  <td>No (art. 37, fracc. I LFPDPPP)</td>
                </tr>
                <tr>
                  <td>Autoridades gubernamentales</td>
                  <td>Cumplimiento de obligaciones legales</td>
                  <td>No (art. 37, fracc. II LFPDPPP)</td>
                </tr>
                <tr>
                  <td>Proveedores de servicios en la nube (Firebase)</td>
                  <td>Almacenamiento y gestión de datos</td>
                  <td>No (art. 37, fracc. VII LFPDPPP)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Todos los terceros que reciban datos personales de Sense Vision quedan obligados
            a tratarlos bajo los mismos estándares de confidencialidad y seguridad establecidos
            en este Aviso y en la legislación aplicable.
          </p>
        </section>

        {/* 5. DERECHOS ARCO */}
        <section className="sv-priv-section">
          <div className="sv-priv-section-title">
            <FileTextIcon size={18} />
            <h2>V. Derechos ARCO y Cómo Ejercerlos</h2>
          </div>
          <p>
            Usted tiene el derecho de Acceder, Rectificar, Cancelar u Oponerse (Derechos ARCO)
            al tratamiento de sus datos personales. A continuación se describe cada derecho:
          </p>

          <div className="sv-arco-grid">
            <div className="sv-arco-card">
              <h3>Acceso</h3>
              <p>Conocer qué datos personales suyos tenemos y cómo los utilizamos.</p>
            </div>
            <div className="sv-arco-card">
              <h3>Rectificación</h3>
              <p>Solicitar que corrijamos sus datos cuando sean inexactos o estén incompletos.</p>
            </div>
            <div className="sv-arco-card">
              <h3>Cancelación</h3>
              <p>Solicitar que eliminemos sus datos de nuestros registros cuando considere que no son necesarios.</p>
            </div>
            <div className="sv-arco-card">
              <h3>Oposición</h3>
              <p>Oponerse al tratamiento de sus datos para fines específicos o ante un daño legítimo.</p>
            </div>
          </div>

          <h3>Procedimiento para ejercer sus derechos:</h3>
          <p>
            Para ejercer cualquiera de sus Derechos ARCO, envíe una solicitud por escrito a
            <strong> {EMAIL_PRIVACIDAD}</strong> con los siguientes datos:
          </p>
          <ol>
            <li>Nombre completo y correo electrónico registrado en su cuenta.</li>
            <li>Copia de identificación oficial vigente (INE, pasaporte o cédula profesional).</li>
            <li>Descripción clara del derecho que desea ejercer y los datos personales involucrados.</li>
            <li>Cualquier documento que facilite la localización de sus datos (número de pedido, fecha, etc.).</li>
          </ol>
          <p>
            Sense Vision responderá a su solicitud en un plazo máximo de <strong>20 días hábiles</strong>
            a partir de la fecha de recepción. En caso de ser procedente, el derecho se hará efectivo
            en los siguientes <strong>15 días hábiles</strong>.
          </p>
        </section>

        {/* 6. REVOCACION */}
        <section className="sv-priv-section">
          <div className="sv-priv-section-title">
            <FileTextIcon size={18} />
            <h2>VI. Revocación del Consentimiento</h2>
          </div>
          <p>
            Usted puede revocar el consentimiento que haya otorgado para el tratamiento de sus
            datos personales enviando un correo electrónico a <strong>{EMAIL_PRIVACIDAD}</strong>
            con el asunto "Revocación de Consentimiento", indicando los fines específicos para
            los que desea revocar su consentimiento.
          </p>
          <p>
            Tenga en cuenta que la revocación del consentimiento para finalidades primarias
            podría imposibilitar la prestación del servicio contratado. La revocación respecto de
            finalidades secundarias no afectará la relación comercial.
          </p>
        </section>

        {/* 7. COOKIES */}
        <section className="sv-priv-section">
          <div className="sv-priv-section-title">
            <FileTextIcon size={18} />
            <h2>VII. Uso de Cookies y Tecnologías de Rastreo</h2>
          </div>
          <p>
            El sitio web de Sense Vision utiliza cookies y tecnologías similares para:
          </p>
          <ul>
            <li>Mantener activa su sesión de usuario durante la navegación.</li>
            <li>Recordar sus preferencias y contenido del carrito de compras.</li>
            <li>Analizar el comportamiento de navegación para mejorar nuestros servicios (Google Analytics).</li>
            <li>Garantizar la seguridad de las transacciones.</li>
          </ul>
          <p>
            Puede configurar su navegador para bloquear o eliminar cookies en cualquier momento.
            Sin embargo, la desactivación de ciertas cookies podría afectar el funcionamiento
            del sitio. Para más información, consulte la documentación de su navegador.
          </p>
        </section>

        {/* 8. SEGURIDAD */}
        <section className="sv-priv-section">
          <div className="sv-priv-section-title">
            <FileTextIcon size={18} />
            <h2>VIII. Medidas de Seguridad</h2>
          </div>
          <p>
            Sense Vision implementa las medidas de seguridad administrativas, técnicas y físicas
            necesarias para proteger sus datos personales frente a daño, pérdida, alteración,
            destrucción o uso, acceso o tratamiento no autorizados. Estas medidas incluyen:
          </p>
          <ul>
            <li>Cifrado de contraseñas mediante algoritmos de hash seguros (bcrypt).</li>
            <li>Transmisión de datos a través de protocolo HTTPS con certificado SSL/TLS.</li>
            <li>Almacenamiento en infraestructura de nube con certificación de seguridad (Firebase/Google Cloud).</li>
            <li>Acceso restringido a datos personales únicamente al personal autorizado bajo acuerdos de confidencialidad.</li>
            <li>Revisiones periódicas de seguridad y actualización de sistemas.</li>
          </ul>
          <p>
            A pesar de las medidas adoptadas, ningún sistema de seguridad es completamente
            infalible. En caso de detectar una vulneración de datos personales que represente
            un riesgo considerable para usted, Sense Vision se lo comunicará de manera oportuna.
          </p>
        </section>

        {/* 9. CAMBIOS */}
        <section className="sv-priv-section">
          <div className="sv-priv-section-title">
            <FileTextIcon size={18} />
            <h2>IX. Cambios al Aviso de Privacidad</h2>
          </div>
          <p>
            El presente Aviso de Privacidad puede ser modificado en cualquier momento. Toda
            modificación será notificada a través de nuestro sitio web con al menos <strong>30 días
            naturales de anticipación</strong>. En el caso de cambios relevantes que afecten las
            finalidades del tratamiento o la transferencia de datos, solicitaremos nuevamente
            su consentimiento cuando así lo exija la ley.
          </p>
          <p>
            Le recomendamos revisar periódicamente este Aviso de Privacidad en nuestra página web.
            El uso continuado de nuestros servicios tras la publicación de los cambios implica
            su aceptación de los mismos.
          </p>
        </section>

        {/* 10. AUTORIDAD */}
        <section className="sv-priv-section">
          <div className="sv-priv-section-title">
            <FileTextIcon size={18} />
            <h2>X. Autoridad Reguladora</h2>
          </div>
          <p>
            Si considera que el tratamiento de sus datos personales no ha sido adecuado o
            que sus derechos han sido vulnerados, tiene el derecho de acudir ante el
            Instituto Nacional de Transparencia, Acceso a la Información y Protección de
            Datos Personales (<strong>INAI</strong>), con domicilio en Av. Insurgentes Sur 3211,
            Col. Insurgentes Cuicuilco, C.P. 04530, Ciudad de México.
          </p>
          <p>
            Sitio web oficial: <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer">www.inai.org.mx</a>
          </p>
        </section>

        {/* CONSENTIMIENTO */}
        <div className="sv-priv-consentimiento">
          <LockIcon size={16} />
          <p>
            Al utilizar los servicios de Sense Vision o proporcionar sus datos personales a través
            de nuestros formularios, usted manifiesta haber leído, entendido y aceptado los
            términos del presente Aviso de Privacidad.
          </p>
        </div>

        <div className="sv-priv-firma">
          <p><strong>{RESPONSABLE}</strong></p>
          <p>Fecha de última actualización: {FECHA_ACTUALIZACION}</p>
        </div>
      </div>

      <div className="sv-priv-volver">
        <Link to="/" className="btn btn-outline">
          <ArrowLeftIcon size={16} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}