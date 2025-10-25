import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  FiArrowRight,
  FiCheck,
  FiCloud,
  FiCode,
  FiShield,
  FiZap,
  FiTarget,
  FiLayers,
  FiTrendingUp,
  FiMessageCircle,
} from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

import { API_BASE } from "../config/api";
import "../styles/inicio.css";

/* ---------- Utilidades de precios ---------- */
const fCLP = (v) =>
  typeof v === "number"
    ? `CLP ${v.toLocaleString("es-CL")}`
    : v || "$ a convenir";

const getPrecioTexto = (s) => {
  const base =
    s?.desde_precio ?? s?.desde ?? s?.precio_desde ?? s?.precio ?? null;
  return base ? `Desde ${fCLP(Number(base))}` : "A convenir";
};

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
        const r = await fetch(`${API_BASE}/servicios`, {
          signal: controller.signal,
        });
        if (!r.ok) throw new Error();
        const data = await r.json();
        setServicios(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError")
          setError("No se pudieron cargar los servicios.");
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
                {logoUrl && <img src={logoUrl} alt="InnovaTI" className="hero-logo" />}
                <span className="text-uppercase fw-semibold hero-kicker">
                  Consultora tecnológica en Chile
                </span>
              </div>

              <h1 className="display-5 fw-bold hero-title mb-3">
                Somos una consultora <span className="text-gradient">nueva</span> con estrategias claras
              </h1>
              <p className="lead hero-subtitle">
                Un equipo profesional que combina <strong>desarrollo a medida</strong>,{" "}
                <strong>Cloud/DevOps</strong> e <strong>integraciones</strong>. Partimos pequeño, pero
                operamos con buenas prácticas: sprints semanales, seguridad y comunicación simple.
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
                    20 minutos para entender su necesidad y proponer el mejor camino.
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
            {[
              { n: "Respuesta rápida", t: "Primer contacto útil en poco tiempo" },
              { n: "Propuesta clara", t: "Estimación y plan en menos de 3 días" },
              { n: "Acompañamiento cercano", t: "Canales directos y seguimiento semanal" },
            ].map((m, i) => (
              <Col sm={4} key={i}>
                <Card className="metric-card text-white">
                  <Card.Body className="py-3 text-center">
                    <div className="h5 fw-bold mb-0">{m.n}</div>
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
                        {s.descripcion || "Solución tecnológica a medida para su empresa."}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <small className="text-muted">
                          <strong>{getPrecioTexto(s)}</strong>
                        </small>
                        <Button
                          as={Link}
                          to={`/servicios/${s.slug || ""}`}
                          size="sm"
                          variant="outline-primary"
                        >
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

      {/* === CÓMO TRABAJAMOS === */}
      <section className="py-5 section-why" data-aos="fade-up">
        <Container>
          <Row className="text-center mb-4">
            <Col>
              <h2 className="fw-semibold section-title">¿Cómo trabajamos?</h2>
              <p className="text-muted mb-0">
                Un proceso simple que prioriza resultados tempranos y comunicación clara.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {[
              { icon: <FiTarget />, t: "1) Descubrimiento", d: "Entendemos el problema, definimos el alcance y priorizamos." },
              { icon: <FiLayers />, t: "2) Plan y estimación", d: "Le proponemos un plan realista, costos transparentes y quick wins." },
              { icon: <FiZap />, t: "3) Sprints cortos", d: "Entregas semanales con demo y feedback continuo." },
              { icon: <FiTrendingUp />, t: "4) Despliegue y soporte", d: "Puesta en producción y acompañamiento cercano." },
            ].map((b, i) => (
              <Col md={6} lg={3} key={i}>
                <Card className="h-100 border-0 why-card text-center">
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

      {/* === COMPROMISOS === */}
      <section className="py-5" data-aos="fade-up">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <h2 className="fw-semibold mb-3">Nuestros compromisos</h2>
              <ul className="list-unstyled d-grid gap-2 text-muted">
                {[
                  "Tiempos de respuesta cortos.",
                  "Costos y alcances transparentes (sin letra chica).",
                  "Propiedad del código y documentación básica incluida.",
                  "Buenas prácticas de seguridad y backups desde el día 1.",
                ].map((t, i) => (
                  <li key={i} className="d-flex align-items-start gap-2">
                    <FiCheck className="mt-1" /> {t}
                  </li>
                ))}
              </ul>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow-soft rounded-2xl">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-2 text-primary mb-2">
                    <FiMessageCircle /> <strong>¿Tiene dudas?</strong>
                  </div>
                  <p className="mb-3 text-muted">
                    Escríbanos y armamos una reunión breve para ver si somos el partner correcto
                    para su proyecto.
                  </p>
                  <Button as={Link} to="/contacto" className="btn-gradient">Contactar</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
     
    </>
  );
}
