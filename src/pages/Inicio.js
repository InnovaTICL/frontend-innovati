import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container, Row, Col, Button, Card, Badge, Alert, Spinner,
} from "react-bootstrap";
import {
  FiArrowRight, FiCheck, FiCloud, FiCode, FiShield, FiZap,
} from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

import { API_BASE } from "../config/api";
import "../styles/inicio.css";

export default function Inicio() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/servicios`, { signal: controller.signal });
        if (!r.ok) throw new Error();
        const data = await r.json();
        setServicios(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") setError("No se pudieron cargar los servicios.");
      } finally {
        setCargando(false);
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/logo`);
        if (!r.ok) throw new Error();
        const blob = await r.blob();
        setLogoUrl(URL.createObjectURL(blob));
      } catch {
        setLogoUrl(process.env.PUBLIC_URL + "/logo.png");
      }
    })();
  }, []);

  const destacados = useMemo(() => servicios.slice(0, 3), [servicios]);

  return (
    <>
      {/* === HERO === */}
      <section className="hero-home" data-aos="fade-down">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <div className="d-flex align-items-center gap-3 mb-3">
                {logoUrl && <img src={logoUrl} alt="InnovaTi" className="hero-logo" />}
                <span className="text-uppercase fw-semibold hero-kicker">
                  Consultora tecnológica en Chile
                </span>
              </div>

              <h1 className="display-5 fw-bold hero-title mb-3">
                Software que <span className="text-gradient">impulsa</span> tu negocio
              </h1>
              <p className="lead hero-subtitle">
                Desarrollo a medida, Cloud/DevOps e Integraciones. Entregamos valor con
                <strong> sprints semanales</strong>, seguridad y soporte cercano.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Button as={Link} to="/servicios" size="lg" className="btn-gradient px-4">
                  Ver servicios
                </Button>
                <Button
                  as={Link}
                  to="/contacto"
                  variant="link"
                  className="btn-link-hero d-inline-flex align-items-center gap-1"
                >
                  Conversemos <FiArrowRight />
                </Button>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Badge bg="light" text="dark">React</Badge>
                <Badge bg="light" text="dark">Python/Flask</Badge>
                <Badge bg="light" text="dark">PostgreSQL</Badge>
                <Badge bg="light" text="dark">AWS/Azure</Badge>
              </div>
            </Col>

            <Col lg={5} data-aos="fade-left">
              <Card className="border-0 shadow-soft rounded-2xl hero-card">
                <Card.Body className="p-4 p-lg-5">
                  <div className="small text-uppercase text-muted mb-2">Kick-off</div>
                  <h5 className="fw-bold mb-2">Agenda una asesoría gratuita</h5>
                  <p className="text-muted mb-4">
                    20 minutos para entender tu reto y proponerte el mejor camino.
                  </p>
                  <ul className="list-unstyled d-grid gap-2 mb-4 text-muted">
                    {[
                      "Diagnóstico express del alcance",
                      "Recomendación técnica y costos de referencia",
                      "Siguiente paso claro (PoC / MVP / Integración)",
                    ].map((t, i) => (
                      <li key={i} className="d-flex align-items-center gap-2">
                        <FiCheck /> {t}
                      </li>
                    ))}
                  </ul>
                  <div className="d-grid gap-2">
                    <Button as={Link} to="/contacto" className="btn-gradient">
                      Quiero asesoría
                    </Button>
                    <Button as={Link} to="/servicios" variant="outline-secondary">
                      Conocer soluciones
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3 mt-4 mt-lg-5" data-aos="fade-up">
            {[{ n: "+25", t: "entregas ágiles" },
              { n: "99.9%", t: "uptime en despliegues" },
              { n: "48h", t: "SLA de respuesta" },
            ].map((m, i) => (
              <Col sm={4} key={i}>
                <Card className="metric-card text-white">
                  <Card.Body className="py-3 text-center">
                    <div className="h3 fw-bold mb-0">{m.n}</div>
                    <div className="opacity-90">{m.t}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* === SERVICIOS DESTACADOS === */}
      <section className="py-5 section-soft" data-aos="fade-up">
        <Container>
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-3">
            <h2 className="fw-semibold m-0">Servicios destacados</h2>
            <Button as={Link} to="/servicios" variant="link" className="p-0">
              Ver todos <FiArrowRight />
            </Button>
          </div>

          {error && <Alert variant="warning">{error}</Alert>}
          {cargando ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" /> <span>Cargando...</span>
            </div>
          ) : (
            <Row className="g-4">
              {destacados.map((s, i) => (
                <Col md={6} lg={4} key={i} data-aos="fade-up" data-aos-delay={i * 120}>
                  <Card className="h-100 border-0 shadow-soft rounded-2xl servicio-card">
                    <Card.Body className="p-4 d-flex flex-column">
                      <div className="display-6 text-primary mb-2">
                        {i === 0 ? <FiCode /> : i === 1 ? <FiCloud /> : <FiShield />}
                      </div>
                      <Card.Title className="fw-semibold">{s.titulo || "Servicio"}</Card.Title>
                      <Card.Text className="text-muted flex-grow-1">
                        {s.descripcion || "Solución tecnológica a medida para tu empresa."}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <small className="text-muted">
                          Desde <strong>{s.precio || "$120.000"}</strong>
                        </small>
                        <Button as={Link} to={`/servicios/${s.slug || ""}`} size="sm" variant="outline-primary">
                          Ver más
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* === BENEFICIOS === */}
      <section className="py-5" data-aos="fade-up">
        <Container>
          <Row className="text-center mb-4">
            <Col>
              <h2 className="fw-semibold">¿Por qué elegirnos?</h2>
              <p className="text-muted mb-0">
                Del descubrimiento al soporte continuo, contigo en cada paso.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {[{ icon: <FiZap />, t: "Entrega ágil", d: "Sprints semanales con demos desde la primera semana." },
              { icon: <FiShield />, t: "Seguridad y buenas prácticas", d: "Hardening, CI/CD y backups desde el inicio." },
              { icon: <FiCloud />, t: "Cloud listo para crecer", d: "AWS/Azure optimizados en costos y rendimiento." },
            ].map((b, i) => (
              <Col md={4} key={i}>
                <Card className="h-100 border-0 shadow-soft rounded-2xl text-center">
                  <Card.Body className="p-4">
                    <div className="display-6 mb-2 text-primary">{b.icon}</div>
                    <Card.Title className="fw-semibold">{b.t}</Card.Title>
                    <Card.Text className="text-muted">{b.d}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* === CTA FINAL === */}
      <section className="py-5 text-center section-soft" data-aos="fade-up">
        <Container>
          <h2 className="mb-2 fw-semibold">¿Listo para empezar?</h2>
          <p className="text-muted mb-4">
            Cuéntanos tu necesidad y armamos una propuesta gratuita.
          </p>
          <Button as={Link} to="/contacto" size="lg" className="btn-gradient px-4">
            Hablemos
          </Button>
        </Container>
      </section>
    </>
  );
}
