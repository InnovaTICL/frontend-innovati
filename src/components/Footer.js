import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { FiPhoneCall, FiMail } from "react-icons/fi"; // 👈 nuevos íconos
import { FaWhatsapp } from "react-icons/fa"; // 👈 ícono de WhatsApp
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
              <Link
                to="/"
                className="brand d-inline-flex align-items-center gap-2 text-decoration-none"
              >
                <img
                  src={process.env.PUBLIC_URL + "/logo.png"}
                  alt="InnovaTI"
                  height="28"
                />
                <span className="brand-text">
                  <span className="text-gradient">Innova</span>
                  <span className="brand-ti">TI</span>
                </span>
              </Link>
              <p className="mt-3 text-muted mb-0">
                Consultora tecnológica en Chile. Desarrollo a medida, Cloud/DevOps
                e Integraciones con foco en seguridad y entrega continua.
              </p>
            </Col>

            {/* Navegación */}
            <Col md={4} lg={3}>
              <h6 className="section-title">Navegación</h6>
              <Nav className="flex-column">
                <Nav.Link as={NavLink} to="/" end className="footer-link">
                  Inicio
                </Nav.Link>
                <Nav.Link as={NavLink} to="/servicios" className="footer-link">
                  Servicios
                </Nav.Link>
                <Nav.Link as={NavLink} to="/contacto" className="footer-link">
                  Contacto
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/cliente/login"
                  className="footer-link"
                >
                  Acceso Clientes
                </Nav.Link>
              </Nav>
            </Col>

            {/* Contacto */}
            <Col md={3} lg={4}>
              <h6 className="section-title">Contacto</h6>
              <ul className="list-unstyled mb-0">
                {/* Correo */}
                <li className="mb-2 d-flex align-items-center gap-2">
                  <FiMail size={16} />
                  <a
                    href="mailto:innovaticl@outlook.com"
                    className="footer-link"
                  >
                    innovaticl@outlook.com
                  </a>
                </li>

                {/* Teléfono */}
                <li className="mb-2 d-flex align-items-center gap-2">
                  <FiPhoneCall size={16} />
                  <a href="tel:+56962844148" className="footer-link">
                    +56 9 6284 4148
                  </a>
                </li>

                {/* WhatsApp */}
                <li className="mb-2 d-flex align-items-center gap-2">
                  <FaWhatsapp size={16} color="#25D366" />
                  <a
                    href="https://wa.me/56962844148"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    Escríbenos por WhatsApp
                  </a>
                </li>
              </ul>

              <div className="mt-3 d-flex gap-2">
                {/* Espacio reservado para redes sociales futuras */}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Barra inferior */}
      <div className="footer-bottom">
        <Container className="footer-wrap d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <small className="text-muted">
            © {year} InnovaTi. Todos los derechos reservados.
          </small>
          <div className="d-flex align-items-center gap-3">
            <Link to="/terminos" className="footer-link small">
              Términos
            </Link>
            <Link to="/privacidad" className="footer-link small">
              Privacidad
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
