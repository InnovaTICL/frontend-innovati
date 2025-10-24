import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "../styles/header.css"; // <- usted lo dejó como header.css

function Header() {
  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="navbar-modern py-2 shadow-sm"
      collapseOnSelect
    >
      {/* Contenedor más estrecho */}
      <Container className="navbar-wrap">
        {/* LOGO + Marca */}
        <Navbar.Brand as={Link} to="/" className="brand-wrap">
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="InnovaTI"
            height="34"
          />
          <span className="brand-text">
            <span className="text-gradient">Innova</span>
            <span className="brand-ti">TI</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav className="align-items-center gap-3 nav-links">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/servicios">
              Servicios
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">
              Contacto
            </Nav.Link>

            <Button
              as={Link}
              to="/cliente/login"
              className="btn-gradient ms-2 px-3 py-2 fw-semibold btn-cta"
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
