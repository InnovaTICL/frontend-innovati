import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

function Header() {
  return (
    <Navbar expand="lg" className="navbar" sticky="top" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="InnovaTi" height="32" />
          <span className="fw-semibold">
            <span className="text-gradient">Innova</span>
            <span style={{ color: "var(--inn-primary)" }}>TI</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/servicios">Servicios</Nav.Link>
            <Nav.Link as={NavLink} to="/planes">Planes</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-2 ms-3">
            {/* Botón acceso clientes */}
            <Button
              as={Link}
              to="/cliente/login"
              variant="outline-dark"
              className="px-3"
            >
              Acceso Clientes
            </Button>
            {/* Botón cotizar */}
            <Button
              as={Link}
              to="/contacto"
              className="btn-gradient px-4"
            >
              Cotizar
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
