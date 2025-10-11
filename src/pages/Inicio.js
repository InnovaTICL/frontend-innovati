import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container, Row, Col, Button, Card, Badge, Spinner, Alert
} from "react-bootstrap";
import {
  FiArrowRight, FiCheck, FiCloud, FiCode, FiShield, FiZap
} from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

export default function Inicio() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  // Carga servicios (preview)
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setCargando(true);
        const r = await fetch(`${API_URL}/servicios`, { signal: controller.signal });
        if (!r.ok) throw new Error("No se pudo obtener servicios");
        const data = await r.json();
        setServicios(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "Error al cargar servicios");
          setServicios([]);
        }
      } finally {
        setCargando(false);
      }
    })();
    return () => controller.abort();
  }, []);

  // Logo (usa /logo si existe, si no, fallback a /logo.png)
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const r = await fetch(`${API_URL}/logo`, { signal: controller.signal });
        if (!r.ok) throw new Error();
        const blob = await r.blob();
        setLogoUrl(URL.createObjectURL(blob));
      } catch {
        setLogoUrl(process.env.PUBLIC_URL + "/logo.png");
      }
    })();
    return () => controller.abort();
  }, []);

  const destacados = useMemo(() => servicios.slice(0, 3), [servicios]);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-home text-white">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <div className="d-flex align-items-center gap-3 mb-3">
                {logoUrl && <img src={logoUrl} alt="InnovaTI" style={{ height: 48 }} />}
                <span className="text-uppercase fw-semibold opacity-75">
                  Consultora tecnológica en Chile
                </span>
              </div>

              <h1 className="display-5 fw-bold mb-3" style={{ letterSpacing: "-.02em", lineHeight: 1.05 }}>
                Software que <span className="text-gradient">impulsa</span> tu negocio
              </h1>
              <p className="lead mb-4 opacity-90">
                Desarrollo a medida, Cloud/DevOps e Integraciones. Entregamos valor con
                <span className="fw-semibold"> sprints semanales</span>, seguridad y soporte cercano.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Button as={Link} to="/servicios" size="lg" className="btn-gradient px-4">
                  Ver servicios
                </Button>
                <Button as={Link} to="/planes" size="lg" variant="outline-light" className="px-4">
                  Planes y precios
                </Button>
                <Button as={Link} to="/contacto" variant="link" className="text-white d-inline-flex align-items-center gap-1">
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

            <Col lg={5}>
              <Card className="border-0 shadow-soft rounded-2xl hero-card">
                <Card.Body className="p-4 p-lg-5">
                  <div className="small text-uppercase text-muted mb-2">Kick-off</div>
                  <h5 className="fw-bold mb-2">Agenda una asesoría gratuita</h5>
                  <p className="text-muted mb-4">
                    20 minutos para entender tu reto y proponerte el mejor camino.
                  </p>
                  <ul className="list-unstyled d-grid gap-2 mb-4">
                    {[
                      "Diagnóstico express del alcance",
                      "Recomendación técnica y costos de referencia",
                      "Siguiente paso claro (PoC / MVP / Integración)"
                    ].map((t, i) => (
                      <li key={i} className="d-flex align-items-center gap-2">
                        <FiCheck /> {t}
                      </li>
                    ))}
                  </ul>
                  <div className="d-grid gap-2">
                    <Button as={Link} to="/contacto" className="btn-gradient">Quiero asesoría</Button>
                    <Button as={Link} to="/servicios" variant="outline-secondary">Conocer soluciones</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Métricas rápida confianza */}
          <Row className="g-3 mt-4 mt-lg-5">
            {[
              { n: "+25", t: "entregas ágiles" },
              { n: "99.9%", t: "uptime en despliegues" },
              { n: "48h", t: "SLA de respuesta" },
            ].map((m, i) => (
              <Col sm={4} key={i}>
                <Card className="border-0 bg-white/10 text-white shadow-none">
                  <Card.Body className="py-3">
                    <div className="h3 fw-bold mb-0">{m.n}</div>
                    <div className="opacity-85">{m.t}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ===== BENEFICIOS ===== */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-4">
            <Col>
              <h2 className="fw-semibold">¿Por qué elegirnos?</h2>
              <p className="text-muted mb-0">Del descubrimiento al soporte continuo, contigo en cada paso.</p>
            </Col>
          </Row>
          <Row className="g-4">
            {[
              { icon: <FiZap />, t: "Entrega ágil", d: "Sprints semanales con demos: valor desde la primera semana." },
              { icon: <FiShield />, t: "Seguridad y buenas prácticas", d: "Hardening, CI/CD y backups desde el inicio." },
              { icon: <FiCloud />, t: "Cloud listo para crecer", d: "AWS/Azure optimizados en costos y rendimiento." },
            ].map((b, i) => (
              <Col md={4} key={i}>
                <Card className="h-100 border-0 shadow-soft rounded-2xl">
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

      {/* ===== SERVICIOS DESTACADOS (API) ===== */}
      <section className="py-5">
        <Container>
          <Row className="mb-4 align-items-end">
            <Col>
              <h2 className="fw-semibold mb-0">Servicios destacados</h2>
              <small className="text-muted">Cargados dinámicamente desde tu API</small>
            </Col>
            <Col className="text-md-end mt-3 mt-md-0">
              <Button as={Link} to="/servicios" variant="outline-primary">
                Ver todos los servicios
              </Button>
            </Col>
          </Row>

          {cargando && (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" /> <span>Cargando servicios…</span>
            </div>
          )}

          {error && (
            <Alert variant="light" className="border">
              No se pudieron cargar los servicios: {error}
            </Alert>
          )}

          {!cargando && !error && (
            <Row className="g-4">
              {(destacados.length ? destacados : servicios.slice(0, 3)).map((s) => (
                <Col md={4} key={s.id}>
                  <Card className="h-100 border-0 shadow-soft rounded-2xl servicio-card">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="mb-0">{s.titulo}</Card.Title>
                        {s.categoria && <Badge bg="light" text="dark">{s.categoria}</Badge>}
                      </div>
                      <Card.Text className="text-muted flex-grow-1">
                        {s.descripcion || "Servicio sin descripción"}
                      </Card.Text>
                      {typeof s.desde_precio === "number" && (
                        <div className="fw-semibold mb-3">Desde ${s.desde_precio.toLocaleString("es-CL")}</div>
                      )}
                      <div className="d-flex gap-2 mt-auto">
                        <Button as={Link} to="/contacto" className="btn-gradient flex-fill">Cotizar</Button>
                        <Button as={Link} to="/servicios" variant="outline-primary">Ver más</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* ===== PROCESO ÁGIL ===== */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-4">
            <Col><h2 className="fw-semibold">Cómo trabajamos</h2></Col>
          </Row>
          <Row className="g-4">
            {[
              { icon: <FiCode />, t: "Descubrimiento", d: "Levantamiento breve y definición de alcance." },
              { icon: <FiZap />, t: "Sprints", d: "Planificación semanal y entregas continuas." },
              { icon: <FiShield />, t: "Calidad", d: "Revisiones, pruebas y seguridad integradas." },
              { icon: <FiCloud />, t: "Despliegue & soporte", d: "CI/CD, monitoreo y postventa que responde." },
            ].map((p, i) => (
              <Col md={3} key={i}>
                <Card className="h-100 border-0 shadow-soft rounded-2xl text-center">
                  <Card.Body className="p-4">
                    <div className="h2 text-primary mb-2">{p.icon}</div>
                    <Card.Title className="fw-semibold">{p.t}</Card.Title>
                    <Card.Text className="text-muted">{p.d}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-4">
            <Col>
              <h2 className="fw-semibold">Lo que dicen nuestros clientes</h2>
              <p className="text-muted mb-0">Historias reales de proyectos entregados.</p>
            </Col>
          </Row>
          <Row className="g-4">
            {[
              { q: "Montaron nuestro MVP en semanas y empezamos a facturar antes de lo previsto.", a: "CEO de e-commerce" },
              { q: "La automatización nos ahorró horas de trabajo manual por día.", a: "Gerente de Operaciones" },
              { q: "Excelente comunicación y soporte. Nos sentimos acompañados.", a: "CTO fintech" },
            ].map((t, i) => (
              <Col md={4} key={i}>
                <Card className="h-100 border-0 shadow-soft rounded-2xl">
                  <Card.Body className="p-4">
                    <p className="mb-2">“{t.q}”</p>
                    <div className="text-muted small">— {t.a}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-5 text-center section-soft">
        <Container>
          <h2 className="mb-2">¿Listo para empezar?</h2>
          <p className="text-muted mb-4">Cuéntanos tu necesidad y armamos una propuesta gratuita.</p>
          <Button as={Link} to="/contacto" size="lg" className="btn-gradient px-4">
            Hablemos
          </Button>
        </Container>
      </section>

      {/* Estilos puntuales (apoyados en tu theme.css) */}
      <style>{`
        .hero-home{
          background: linear-gradient(135deg, #0b1a3a 0%, #1e2766 50%, #3a2a7c 100%);
          padding: 64px 0 48px;
        }
        .hero-card{ backdrop-filter: blur(2px); }
        .rounded-2xl{ border-radius: 20px; }
        .shadow-soft{ box-shadow: 0 12px 34px rgba(0,0,0,.10); }
        .bg-white\\/10{ background: rgba(255,255,255,.10); border-radius: 14px; }
        .servicio-card{ transition: transform .16s ease, box-shadow .16s ease; }
        .servicio-card:hover{ transform: translateY(-2px); box-shadow: 0 18px 48px rgba(0,0,0,.12); }
      `}</style>
    </>
  );
}