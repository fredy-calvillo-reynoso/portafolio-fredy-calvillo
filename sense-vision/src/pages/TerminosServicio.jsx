// src/pages/TerminosServicio.jsx
import { Link } from "react-router-dom";
import { ArrowLeftIcon, FileTextIcon, ScaleIcon, InfoCircleIcon, ShieldIcon } from "../components/Icons";
import "./TerminosServicio.css";

const FECHA = "13 de junio de 2026";
const EMPRESA = "Sense Vision S.A. de C.V.";
const DOMICILIO = "Av. Insurgentes Sur 2453, Col. San Ángel, C.P. 01000, Ciudad de México, México.";
const EMAIL = "legal@sensevision.com";

export default function TerminosServicio() {
  return (
    <div className="sv-terminos container">
      <div className="sv-terminos-header">
        <div className="sv-legal-icon">
          <ScaleIcon size={32} />
        </div>
        <h1 className="section-title">Términos de Servicio</h1>
        <p className="section-subtitle">
          Lea cuidadosamente los siguientes términos antes de adquirir o utilizar
          cualquier producto o servicio de Sense Vision.
        </p>
        <div className="sv-legal-meta">
          <span>Última actualización: {FECHA}</span>
          <span>Versión 1.0</span>
        </div>
      </div>

      <div className="card sv-legal-card">

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <InfoCircleIcon size={18} />
            <h2>1. Aceptación de los Términos</h2>
          </div>
          <p>
            El acceso y uso de la plataforma web, la aplicación móvil y los servicios ofrecidos por{" "}
            <strong>{EMPRESA}</strong> (en adelante, "Sense Vision", "nosotros" o "la Empresa")
            implica la aceptación plena y sin reservas de los presentes Términos de Servicio.
          </p>
          <p>
            Si usted no está de acuerdo con alguno de los términos aquí establecidos, le solicitamos
            abstenerse de utilizar nuestros servicios o adquirir nuestros productos. El uso continuado
            de la plataforma constituirá evidencia de su aceptación.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>2. Descripción del Servicio</h2>
          </div>
          <p>
            Sense Vision es una empresa de tecnología asistiva que diseña, fabrica y comercializa
            bastones inteligentes equipados con sensores de detección de obstáculos, sistemas de
            vibración háptica y módulos de comunicación GPS. A través de su plataforma digital,
            los usuarios pueden:
          </p>
          <ul className="sv-legal-lista">
            <li>Consultar el catálogo de productos y sus especificaciones técnicas.</li>
            <li>Personalizar su bastón con opciones adicionales de hardware.</li>
            <li>Realizar pedidos y gestionar pagos en línea de forma segura.</li>
            <li>Dar seguimiento al proceso de fabricación y entrega de su pedido.</li>
            <li>Acceder al soporte técnico y canales de atención al cliente.</li>
          </ul>
          <p>
            Nos reservamos el derecho de modificar, suspender o descontinuar cualquier
            funcionalidad del servicio con o sin previo aviso, sin que ello genere responsabilidad
            alguna hacia el usuario, salvo en los casos expresamente señalados en la legislación aplicable.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>3. Registro y Cuenta de Usuario</h2>
          </div>
          <p>
            Para realizar compras o acceder a funcionalidades avanzadas de la plataforma, el usuario
            deberá crear una cuenta personal proporcionando información verídica, actualizada y completa.
            El usuario es responsable de:
          </p>
          <ul className="sv-legal-lista">
            <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
            <li>Notificar de inmediato a Sense Vision ante cualquier uso no autorizado de su cuenta.</li>
            <li>Toda la actividad que se realice desde su cuenta, independientemente de si fue llevada a cabo por el usuario o por un tercero.</li>
          </ul>
          <p>
            Sense Vision se reserva el derecho de suspender o eliminar cuentas que incumplan estos
            términos o que sean utilizadas de manera fraudulenta o contraria a la ley.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>4. Proceso de Compra y Pagos</h2>
          </div>
          <p>
            Todos los precios publicados en la plataforma se expresan en pesos mexicanos (MXN) e
            incluyen el Impuesto al Valor Agregado (IVA) vigente al momento de la transacción.
            Los precios están sujetos a cambios sin previo aviso; sin embargo, el precio aplicable
            a un pedido es el vigente al momento de su confirmación.
          </p>
          <p>
            El proceso de compra se considera completado una vez que Sense Vision envíe una
            confirmación electrónica del pedido al correo registrado por el usuario. Sense Vision
            no será responsable por errores en los datos de pago proporcionados por el usuario.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>5. Política de Envíos y Entrega</h2>
          </div>
          <p>
            Los pedidos son procesados dentro de un plazo de 3 a 5 días hábiles a partir de la
            confirmación del pago. Los tiempos de entrega varían según la ubicación del destinatario
            y el tipo de servicio de mensajería seleccionado. Sense Vision no se hace responsable
            por retrasos atribuibles a factores externos como huelgas, fenómenos naturales o
            restricciones gubernamentales.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <ShieldIcon size={18} />
            <h2>6. Garantía del Producto</h2>
          </div>
          <p>
            Todos los bastones Sense Vision cuentan con una garantía limitada de <strong>12 meses</strong>{" "}
            contra defectos de fabricación, contados a partir de la fecha de recepción del producto.
            Esta garantía no cubre:
          </p>
          <ul className="sv-legal-lista">
            <li>Daños ocasionados por mal uso, negligencia o accidentes.</li>
            <li>Daños por exposición a líquidos o condiciones climáticas extremas fuera de las especificaciones del producto.</li>
            <li>Modificaciones realizadas por el usuario o por terceros no autorizados.</li>
            <li>Daño cosmético o desgaste natural por uso ordinario.</li>
          </ul>
          <p>
            Para hacer válida la garantía, el usuario deberá contactar a nuestro equipo de soporte
            dentro del período de cobertura, adjuntando evidencia del defecto y comprobante de compra.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>7. Uso Aceptable de la Plataforma</h2>
          </div>
          <p>
            El usuario se compromete a utilizar la plataforma de Sense Vision exclusivamente para
            fines lícitos y de conformidad con la legislación vigente. Queda expresamente prohibido:
          </p>
          <ul className="sv-legal-lista">
            <li>Realizar actividades que puedan dañar, deshabilitar o sobrecargar los sistemas de la plataforma.</li>
            <li>Intentar acceder a áreas restringidas o cuentas de otros usuarios sin autorización.</li>
            <li>Reproducir, distribuir o modificar el contenido de la plataforma sin consentimiento expreso de Sense Vision.</li>
            <li>Utilizar la plataforma para difundir contenido falso, engañoso, difamatorio o ilegal.</li>
          </ul>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>8. Limitación de Responsabilidad</h2>
          </div>
          <p>
            Sense Vision no será responsable por daños indirectos, incidentales, especiales o consecuentes
            derivados del uso o la imposibilidad de uso de sus productos o servicios, incluyendo,
            sin limitación, la pérdida de datos, interrupción del negocio o lucro cesante.
          </p>
          <p>
            La responsabilidad total de Sense Vision ante cualquier reclamación derivada de estos
            Términos no excederá el monto pagado por el usuario en los últimos seis (6) meses
            por los productos o servicios objeto de la reclamación.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>9. Modificaciones a los Términos</h2>
          </div>
          <p>
            Sense Vision podrá modificar los presentes Términos de Servicio en cualquier momento.
            Los cambios serán notificados a través de la plataforma o mediante correo electrónico
            a los usuarios registrados con al menos <strong>15 días naturales</strong> de anticipación.
            El uso continuado de los servicios tras la entrada en vigor de las modificaciones
            constituirá aceptación de los nuevos términos.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <ScaleIcon size={18} />
            <h2>10. Jurisdicción y Ley Aplicable</h2>
          </div>
          <p>
            Los presentes Términos de Servicio se rigen por las leyes vigentes en los Estados Unidos
            Mexicanos. Para cualquier controversia derivada de la interpretación o ejecución de
            estos términos, las partes se someten a la jurisdicción de los tribunales competentes
            de la Ciudad de México, renunciando expresamente a cualquier otro fuero que pudiere
            corresponderles en razón de sus domicilios presentes o futuros.
          </p>
        </section>

        <section className="sv-legal-section sv-legal-section--contacto">
          <div className="sv-legal-section-title">
            <InfoCircleIcon size={18} />
            <h2>11. Contacto</h2>
          </div>
          <p>
            Para cualquier duda, aclaración o solicitud relacionada con estos Términos de Servicio,
            puede ponerse en contacto con nosotros a través de los siguientes medios:
          </p>
          <ul className="sv-legal-lista sv-legal-lista--contacto">
            <li><strong>Empresa:</strong> {EMPRESA}</li>
            <li><strong>Domicilio:</strong> {DOMICILIO}</li>
            <li><strong>Correo electrónico:</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
          </ul>
        </section>
      </div>

      <div className="sv-legal-nav">
        <Link to="/" className="btn btn-outline">
          <ArrowLeftIcon size={16} />
          Regresar al inicio
        </Link>
      </div>
    </div>
  );
}
