import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white-50 py-3 border-top mt-auto">
      <Container className="d-flex flex-column flex-md-row align-items-center gap-2 justify-content-between">
        <small>© {year} InnovaTi. Todos los derechos reservados.</small>
        <small>
          <a
            className="link-light text-decoration-none"
            href="mailto:contacto@innovati.cl"
          >
            contacto@innovati.cl
          </a>
        </small>
      </Container>
    </footer>
  );
}

export default Footer;
