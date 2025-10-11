import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { adminClear, adminGetUser } from "../config/adminAuth";
import logo from "../assets/logo.png";
import "../styles/theme.css";

function AdminNavbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const u = adminGetUser();
  const is = (p) => pathname.startsWith(p);

  return (
    <nav className="navbar navbar-expand-lg admin-navbar shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center brand-lockup" to="/admin">
          <span className="logo-chip">
            <img src={logo} alt="InnovaTI" width={18} height={18} className="logo-img" />
          </span>
          <span className="brand-text">InnovaTI · Admin</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adnav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adnav">
          <ul className="navbar-nav me-auto ms-2">
            <li className="nav-item">
              <Link className={`nav-link ${is("/admin") && !is("/admin/clients") && !is("/admin/client-users") && !is("/admin/projects") && !is("/admin/tickets") ? "active-link" : ""}`} to="/admin">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${is("/admin/clients") ? "active-link" : ""}`} to="/admin/clients">Clientes</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${is("/admin/client-users") ? "active-link" : ""}`} to="/admin/client-users">Usuarios</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${is("/admin/projects") ? "active-link" : ""}`} to="/admin/projects">Proyectos</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${is("/admin/tickets") ? "active-link" : ""}`} to="/admin/tickets">Tickets</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <small className="me-3 text-white d-none d-sm-flex align-items-center gap-1">
              {u?.full_name || "Administrador"}
            </small>
            <button
              className="btn btn-sm btn-logout d-inline-flex align-items-center gap-1"
              onClick={() => { adminClear(); nav("/admin/login"); }}
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
