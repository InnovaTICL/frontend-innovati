import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearSession, getUser } from "../config/auth";
import { LogOut, User2 } from "lucide-react";
import logo from "../assets/logo.png";
import "../styles/theme.css";

function ClienteNavbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const user = getUser();
  const is = (p) => pathname.startsWith(p);
  const logout = () => { clearSession(); nav("/cliente/login"); };

  return (
    <nav className="navbar navbar-expand-lg cliente-navbar shadow-sm mb-4">
      <div className="container">
        {/* Marca mejorada */}
        <Link className="navbar-brand d-flex align-items-center brand-lockup" to="/cliente">
          <span className="logo-chip">
            <img
              src={logo}
              alt="InnovaTI"
              width={22}
              height={22}
              className="logo-img"
            />
          </span>
          <span className="brand-text">Portal Cliente</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#clnav"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div id="clnav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto ms-2">
            <li className="nav-item">
              <Link className={`nav-link ${is("/cliente") ? "active-link" : ""}`} to="/cliente">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${is("/cliente/proyectos") ? "active-link" : ""}`} to="/cliente/proyectos">Proyectos</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${is("/cliente/facturas") ? "active-link" : ""}`} to="/cliente/facturas">Facturas</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${is("/cliente/tickets/nuevo") ? "active-link" : ""}`} to="/cliente/tickets/nuevo">Nuevo Ticket</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <small className="me-3 text-white d-none d-sm-flex align-items-center gap-1 user-chip">
              <User2 size={18} /> {user?.client_name || "Cliente"}
            </small>
            <button
              className="btn btn-sm btn-logout d-inline-flex align-items-center gap-1"
              onClick={logout}
              title="Cerrar sesión"
            >
              <LogOut size={16}/> Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default ClienteNavbar;
