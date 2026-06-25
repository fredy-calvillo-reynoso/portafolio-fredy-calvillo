// src/components/Layout/Footer.jsx
import { Link } from "react-router-dom";
import { ShieldIcon, FileTextIcon, GavelIcon } from "../Icons";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="sv-footer">
      <div className="container sv-footer-content">
        <p className="sv-footer-brand">SENSE VISION</p>
        <ul className="sv-footer-links">
          <li>
            <Link to="/aviso-legal" className="sv-footer-legal-link">
              <GavelIcon size={13} />
              Aviso Legal
            </Link>
          </li>
          <li>
            <Link to="/privacidad" className="sv-footer-legal-link">
              <ShieldIcon size={13} />
              Aviso de Privacidad
            </Link>
          </li>
          <li>
            <Link to="/terminos" className="sv-footer-legal-link">
              <FileTextIcon size={13} />
              Términos de Servicio
            </Link>
          </li>
        </ul>
        <p className="sv-footer-copy">
          &copy; {new Date().getFullYear()} Sense Vision · Bastón Inteligente. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
