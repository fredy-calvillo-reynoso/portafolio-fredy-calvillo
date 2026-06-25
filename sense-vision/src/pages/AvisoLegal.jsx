// src/pages/AvisoLegal.jsx
import { Link } from "react-router-dom";
import { ArrowLeftIcon, FileTextIcon, GavelIcon, InfoCircleIcon, ShieldIcon } from "../components/Icons";
import "./AvisoLegal.css";

const FECHA = "13 de junio de 2026";
const EMPRESA = "Sense Vision S.A. de C.V.";
const DOMICILIO = "Av. Insurgentes Sur 2453, Col. San Ángel, C.P. 01000, Ciudad de México, México.";
const EMAIL = "legal@sensevision.com";

export default function AvisoLegal() {
  return (
    <div className="sv-aviso-legal container">
      <div className="sv-terminos-header">
        <div className="sv-legal-icon sv-legal-icon--gavel">
          <GavelIcon size={32} />
        </div>
        <h1 className="section-title">Aviso Legal</h1>
        <p className="section-subtitle">
          Información legal sobre la titularidad, uso y condiciones del sitio web
          y los servicios ofrecidos por Sense Vision.
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
            <h2>1. Datos del Titular</h2>
          </div>
          <p>
            En cumplimiento con el artículo 10 de la Ley de Servicios de la Sociedad de la
            Información y de Comercio Electrónico, así como con la normativa aplicable en materia
            de comercio electrónico en los Estados Unidos Mexicanos, se informa que el presente
            sitio web es titularidad de:
          </p>
          <ul className="sv-legal-lista sv-legal-lista--contacto">
            <li><strong>Denominación social:</strong> {EMPRESA}</li>
            <li><strong>Domicilio fiscal:</strong> {DOMICILIO}</li>
            <li><strong>Actividad principal:</strong> Diseño, fabricación y comercialización de dispositivos de tecnología asistiva.</li>
            <li><strong>Correo electrónico de contacto:</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
          </ul>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>2. Objeto y Finalidad del Sitio Web</h2>
          </div>
          <p>
            El presente sitio web tiene por objeto proporcionar información sobre los productos
            y servicios de Sense Vision, así como facilitar la adquisición de bastones inteligentes
            a través de un entorno digital seguro. El contenido publicado tiene carácter meramente
            informativo y comercial, sin que en ningún caso pueda considerarse asesoramiento médico,
            terapéutico ni de cualquier otra índole profesional de salud.
          </p>
          <p>
            Sense Vision no garantiza la idoneidad de sus productos para necesidades médicas
            específicas. Se recomienda que el usuario consulte a un especialista de salud antes
            de adquirir cualquier dispositivo de asistencia.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <ShieldIcon size={18} />
            <h2>3. Propiedad Intelectual e Industrial</h2>
          </div>
          <p>
            Todos los contenidos del sitio web de Sense Vision —incluyendo, de manera enunciativa
            y no limitativa, textos, imágenes, gráficos, logotipos, iconos, vídeos, animaciones,
            código fuente, diseños y arquitectura de la interfaz— son propiedad exclusiva de{" "}
            <strong>{EMPRESA}</strong> o de terceros que han autorizado expresamente su uso, y se
            encuentran protegidos por la legislación mexicana e internacional en materia de
            propiedad intelectual e industrial.
          </p>
          <p>
            Queda expresamente prohibida la reproducción total o parcial, distribución, comunicación
            pública, transformación o cualquier otra forma de explotación de dichos contenidos sin
            contar con la autorización previa y expresa por escrito de Sense Vision. El incumplimiento
            de esta disposición podrá dar lugar a las acciones legales que correspondan.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>4. Responsabilidad por Contenidos de Terceros</h2>
          </div>
          <p>
            El sitio web de Sense Vision puede contener enlaces a páginas externas o referencias
            a servicios de terceros. Sense Vision no controla ni supervisa el contenido de dichos
            sitios y no asume responsabilidad alguna por la información publicada en los mismos,
            su disponibilidad ni la exactitud de su contenido.
          </p>
          <p>
            La inclusión de enlaces externos tiene una finalidad meramente informativa y no implica
            aprobación, respaldo ni afiliación de Sense Vision con los sitios enlazados.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>5. Exclusión de Garantías y Responsabilidad</h2>
          </div>
          <p>
            Sense Vision no garantiza la disponibilidad continua e ininterrumpida del sitio web.
            Asimismo, no se hace responsable por posibles daños o perjuicios derivados de:
          </p>
          <ul className="sv-legal-lista">
            <li>Interrupciones, errores o deficiencias técnicas en el acceso al sitio web.</li>
            <li>La presencia de virus u otros elementos maliciosos en el sitio o en los archivos descargados.</li>
            <li>El uso indebido o fraudulento del sitio web por parte de terceros.</li>
            <li>Inexactitudes, omisiones o errores en el contenido publicado.</li>
          </ul>
          <p>
            Sense Vision adoptará las medidas técnicas razonables para garantizar la seguridad y
            correcto funcionamiento de su plataforma, pero no puede garantizar la total ausencia
            de vulnerabilidades en entornos digitales.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <ShieldIcon size={18} />
            <h2>6. Protección de Datos Personales</h2>
          </div>
          <p>
            El tratamiento de los datos personales de los usuarios que interactúen con este sitio
            web se rige por el{" "}
            <Link to="/privacidad" className="sv-legal-enlace">Aviso de Privacidad</Link>{" "}
            de Sense Vision, elaborado en conformidad con la Ley Federal de Protección de Datos
            Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.
          </p>
          <p>
            Se informa al usuario que el sitio web puede utilizar tecnologías de seguimiento como
            cookies con la finalidad de mejorar la experiencia de navegación y analizar el tráfico
            del sitio. El usuario puede configurar su navegador para rechazar el uso de cookies,
            aunque ello podría limitar algunas funcionalidades del sitio.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <FileTextIcon size={18} />
            <h2>7. Uso Permitido del Sitio</h2>
          </div>
          <p>
            El acceso al sitio web de Sense Vision está permitido únicamente para personas mayores
            de 18 años o para menores bajo la supervisión y consentimiento expreso de sus tutores
            legales. El usuario se compromete a hacer un uso adecuado, lícito y respetuoso del
            sitio, absteniéndose de realizar cualquier acción que pueda interferir con su
            funcionamiento o que contravenga la legislación vigente.
          </p>
        </section>

        <section className="sv-legal-section">
          <div className="sv-legal-section-title">
            <GavelIcon size={18} />
            <h2>8. Legislación Aplicable y Jurisdicción</h2>
          </div>
          <p>
            El presente Aviso Legal se rige e interpreta de conformidad con la legislación vigente
            en los Estados Unidos Mexicanos. Cualquier controversia derivada del acceso o uso
            de este sitio web será sometida a la jurisdicción de los Tribunales de la Ciudad
            de México, renunciando expresamente las partes a cualquier otro fuero que pudiera
            corresponderles.
          </p>
        </section>

        <section className="sv-legal-section sv-legal-section--contacto">
          <div className="sv-legal-section-title">
            <InfoCircleIcon size={18} />
            <h2>9. Contacto Legal</h2>
          </div>
          <p>
            Para cualquier consulta, reclamación o solicitud relacionada con el contenido de
            este Aviso Legal, puede contactarnos en:
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
