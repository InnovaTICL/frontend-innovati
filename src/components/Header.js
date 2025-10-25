import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import "../styles/header.css";

function Header() {
  const [expanded, setExpanded] = useState(false);

  const closeMenu = () => setExpanded(false);

  return (
    <Navbar
      expand="lg"
      sticky="top"
      collapseOnSelect
      expanded={expanded}
      onToggle={(val) => setExpanded(val)}
      className="navbar-modern py-2 shadow-sm position-relative"
    >
      <Container className="navbar-wrap">
        {/* Marca */}
        <Navbar.Brand as={Link} to="/inicio" className="brand-wrap">
          <img
            src="/logo.png"
            alt="InnovaTI"
            width="28"
            height="28"
            style={{ borderRadius: 8 }}
          />
          <span className="brand-text ms-2">
            Innova<span className="text-gradient">TI</span>
          </span>
        </Navbar.Brand>

        {/* Hamburguesa */}
        <Navbar.Toggle aria-controls="main-nav" />

        {/* Menú */}
        <Navbar.Collapse id="main-nav">
          <Nav className="nav nav-links ms-auto align-items-center">
            <NavLink
              to="/inicio"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              onClick={closeMenu}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/servicios"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              onClick={closeMenu}
            >
              Servicios
            </NavLink>

            {/* 
            <NavLink
              to="/planes"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              onClick={closeMenu}
            >
              Planes
            </NavLink>
            */}

            <NavLink
              to="/contacto"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              onClick={closeMenu}
            >
              Contacto
            </NavLink>

            {/* CTA */}
            <Button
              as={Link}
              to="/cliente/login"
              onClick={closeMenu}
              className="btn-cta btn-gradient ms-lg-3"
            >
              Acceso Clientes
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
