// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { AlertCircleIcon, ArrowLeftIcon } from "../components/Icons";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="sv-notfound container">
      <div className="sv-notfound-icon">
        <AlertCircleIcon size={40} />
      </div>
      <h1 className="sv-notfound-codigo">404</h1>
      <h2 className="sv-notfound-titulo">Página no encontrada</h2>
      <p className="sv-notfound-desc">
        La página que buscas no existe, fue movida o la dirección es incorrecta.
        Verifica la URL o regresa al inicio.
      </p>
      <div className="sv-notfound-acciones">
        <Link to="/" className="btn btn-primary">
          <ArrowLeftIcon size={16} />
          Volver al inicio
        </Link>
        <Link to="/soporte" className="btn btn-outline">
          Ir a Soporte
        </Link>
      </div>
    </div>
  );
}
