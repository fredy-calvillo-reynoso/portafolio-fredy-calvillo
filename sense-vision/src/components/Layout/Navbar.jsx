// src/components/Layout/Navbar.jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav className="sv-nav">
      <div className="sv-nav-container">
        <Link to="/" className="sv-logo" onClick={() => setMenuAbierto(false)}>
          SENSE VISION
        </Link>

        <button
          className="sv-menu-toggle"
          aria-label="Abrir menú"
          onClick={() => setMenuAbierto((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`sv-nav-links ${menuAbierto ? "abierto" : ""}`}>
          <li>
            <NavLink to="/" onClick={() => setMenuAbierto(false)} end>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/tienda" onClick={() => setMenuAbierto(false)}>
              Tienda
            </NavLink>
          </li>
          <li>
            <NavLink to="/soporte" onClick={() => setMenuAbierto(false)}>
              Soporte
            </NavLink>
          </li>

          {user && (
            <li>
              <NavLink to="/proceso" onClick={() => setMenuAbierto(false)}>
                Mis Pedidos
              </NavLink>
            </li>
          )}

          {isAdmin && (
            <li>
              <NavLink to="/admin" onClick={() => setMenuAbierto(false)}>
                Administración
              </NavLink>
            </li>
          )}

          {user ? (
            <li className="sv-nav-user">
              <span className="sv-nav-username">
                {user.displayName || user.email}
              </span>
              <button className="sv-logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
          ) : (
            <li>
              <NavLink
                to="/login"
                className="sv-login-link"
                onClick={() => setMenuAbierto(false)}
              >
                Iniciar sesión
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
