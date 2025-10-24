import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top border-top">
        <Container className="footer-wrap">
          <Row className="gy-4">
            {/* Marca + descripción */}
            <Col md={5}>
              <Link to="/" className="brand d-inline-flex align-items-center gap-2 text-decoration-none">
                <img src={process.env.PUBLIC_URL + "/logo.png"} alt="InnovaTI" height="28" />
                <span className="brand-text">
                  <span className="text-gradient">Innova</span><span className="brand-ti">TI</span>
                </span>
              </Link>
              <p className="mt-3 text-muted mb-0">
                Consultora tecnológica en Chile. Desarrollo a medida, Cloud/DevOps e Integraciones con foco en seguridad y entrega continua.
              </p>
            </Col>

            {/* Navegación */}
            <Col md={4} lg={3}>
              <h6 className="section-title">Navegación</h6>
              <Nav className="flex-column">
                <Nav.Link as={NavLink} to="/" end className="footer-link">Inicio</Nav.Link>
                <Nav.Link as={NavLink} to="/servicios" className="footer-link">Servicios</Nav.Link>
                <Nav.Link as={NavLink} to="/contacto" className="footer-link">Contacto</Nav.Link>
                <Nav.Link as={NavLink} to="/cliente/login" className="footer-link">Acceso Clientes</Nav.Link>
              </Nav>
            </Col>

            {/* Contacto */}
            <Col md={3} lg={4}>
              <h6 className="section-title">Contacto</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <a href="mailto:contacto@innovati.cl" className="footer-link">contacto@innovati.cl</a>
                </li>
                {/* Si quiere, active teléfono o WhatsApp: */}
                {/* <li className="mb-2"><a href="tel:+569XXXXXXXX" className="footer-link">+56 9 XXXX XXXX</a></li> */}
              </ul>
              <div className="mt-3 d-flex gap-2">
                {/* Espacio para redes si las desea más adelante */}
                {/* <a href="#" className="chip">LinkedIn</a>
                <a href="#" className="chip">GitHub</a> */}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Barra inferior */}
      <div className="footer-bottom">
        <Container className="footer-wrap d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <small className="text-muted">© {year} InnovaTi. Todos los derechos reservados.</small>
          <div className="d-flex align-items-center gap-3">
            <Link to="/terminos" className="footer-link small">Términos</Link>
            <Link to="/privacidad" className="footer-link small">Privacidad</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
