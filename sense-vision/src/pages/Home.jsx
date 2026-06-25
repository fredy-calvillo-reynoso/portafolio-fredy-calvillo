// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { ShieldIcon, GearIcon, UsersIcon } from "../components/Icons";
// 1. Importas la imagen con su ruta relativa desde la carpeta pages hacia img
import bastonImage from "../img/baston_web.JPG"; 
import "./Home.css";

export default function Home() {
  return (
    <div className="sv-home">
      <section className="sv-hero">
        <picture className="sv-hero-poster">
          {/* 2. Pasas la variable importada al atributo src */}
          <img
            src={bastonImage} 
            alt="Bastón inteligente Sense Vision"
            className="sv-hero-poster-img"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        {/* Video: solo se muestra en pantallas no móviles */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/img/hero-poster.webp"
          className="sv-hero-video"
          aria-hidden="true"
        >
          <source src="/video/video.mp4" type="video/mp4" />
        </video>

        <div className="sv-hero-overlay" />
        <div className="sv-hero-content container">
          <h1>El futuro de la asistencia visual está aquí</h1>
          <p>
            Tecnología inteligente, segura y accesible para acompañarte en cada paso.
          </p>
          <Link to="/tienda" className="btn btn-accent sv-hero-btn">
            Conocer más
          </Link>
        </div>
      </section>
      <br />
      <section className="sv-highlights container">
        <h2 className="sv-visually-hidden">¿Por qué elegir Sense Vision?</h2>

        <div className="sv-highlight-card card">
          <div className="sv-highlight-icon sv-icon-trust">
            <ShieldIcon size={34} />
          </div>
          <h3>Seguridad primero</h3>
          <p>
            Sensores de proximidad y botón de pánico con ubicación GPS para que
            siempre te sientas protegido.
          </p>
        </div>

        <div className="sv-highlight-card card">
          <div className="sv-highlight-icon sv-icon-easy">
            <GearIcon size={34} />
          </div>
          <h3>Fácil de usar</h3>
          <p>
            Diseño intuitivo pensado para adaptarse a tu día a día sin
            complicaciones.
          </p>
        </div>

        <div className="sv-highlight-card card">
          <div className="sv-highlight-icon sv-icon-trustcolor">
            <UsersIcon size={34} />
          </div>
          <h3>Confianza comprobada</h3>
          <p>
            Materiales resistentes y soporte continuo para acompañarte donde sea
            que estés.
          </p>
        </div>
        <br />
      </section>
    </div>
  );
}