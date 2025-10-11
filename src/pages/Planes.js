import React, { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  Nav,
  Modal,
  Table,
} from "react-bootstrap";
import { BsCheck2 } from "react-icons/bs";

// Utilidad para CLP
const money = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);

// ===== Datos de familias y planes =====
const CATALOG = {
  "Mantenimiento Web": {
    key: "web",
    tag: "Sitio corporativo",
    tiers: [
      {
        name: "Basic",
        priceFrom: 49000,
        sla: "48 h hábiles",
        tickets: "1 ticket menor/mes",
        features: [
          "Backups mensuales y monitoreo",
          "Actualización núcleo y plugins",
          "Soporte por correo",
        ],
      },
      {
        name: "Plus",
        priceFrom: 89000,
        sla: "24–48 h hábiles",
        tickets: "2 tickets menores/mes",
        features: [
          "Backups semanales + parches de seguridad",
          "Mejoras UI/UX menores",
          "1 integración básica (formulario → correo/Sheet)",
        ],
        highlight: true,
      },
      {
        name: "Pro",
        priceFrom: 129000,
        sla: "24–8 h hábiles",
        tickets: "3 tickets menores/mes",
        features: [
          "Hardening y revisión mensual",
          "Monitoreo mejorado (uptime + performance)",
          "Soporte por correo y WhatsApp",
        ],
      },
    ],
    notes: [
      "Rediseños o nuevas funcionalidades se cotizan aparte.",
      "Tickets menores: hasta 2 horas por ticket, sin cambios estructurales.",
    ],
  },

  "E-commerce Care": {
    key: "ecom",
    tag: "WooCommerce / Shopify",
    tiers: [
      {
        name: "Basic",
        priceFrom: 169000,
        sla: "24 h hábiles",
        tickets: "2 tickets menores/mes",
        features: [
          "Compatibilidad de plugins/apps",
          "Revisión de catálogos y estados de pedido",
          "Soporte con proveedor (pasarela/envíos)",
        ],
        highlight: true,
      },
      {
        name: "Plus",
        priceFrom: 199000,
        sla: "24–12 h hábiles",
        tickets: "3 tickets menores/mes",
        features: [
          "Mejoras operativas (checkout, fichas, colecciones)",
          "Automatizaciones ligeras (etiquetas, emails)",
          "Gestión de copias de seguridad de la tienda",
        ],
      },
      {
        name: "Pro",
        priceFrom: 249000,
        sla: "12–8 h hábiles",
        tickets: "4 tickets menores/mes",
        features: [
          "Soporte prioritario con proveedores",
          "Monitoreo de conversiones (GA4/Meta Pixel)",
          "Informe mensual de rendimiento",
        ],
      },
    ],
    notes: [
      "No incluye costos de plataforma (Shopify, pasarelas, apps).",
      "Cambios mayores o integraciones avanzadas se cotizan aparte.",
    ],
  },

  "Soporte TI / Mesa de Ayuda": {
    key: "helpdesk",
    tag: "Usuarios y dispositivos",
    tiers: [
      {
        name: "Basic",
        priceFrom: 12000, // por usuario/mes (referencial)
        sla: "48 h hábiles",
        tickets: "Hasta 1 ticket/usuario/mes",
        features: [
          "Helpdesk por correo",
          "Onboarding/Offboarding básico",
          "Inventario ligero de equipos",
        ],
      },
      {
        name: "Plus",
        priceFrom: 18000,
        sla: "24 h hábiles",
        tickets: "Hasta 2 tickets/usuario/mes",
        features: [
          "Parcheo y antivirus administrado",
          "Soporte remoto",
          "Políticas básicas de seguridad",
        ],
        highlight: true,
      },
      {
        name: "Pro",
        priceFrom: 25000,
        sla: "8–24 h hábiles",
        tickets: "Hasta 3 tickets/usuario/mes",
        features: [
          "Mesa de ayuda prioritaria",
          "Playbooks y reportes mensuales",
          "Opción on-site (horas aparte)",
        ],
      },
    ],
    notes: [
      "Valores referenciales por usuario/mes (desde).",
      "Servicios on-site y repuestos se cotizan por separado.",
    ],
  },

  "Cloud & DevOps": {
    key: "cloud",
    tag: "Despliegue y CI/CD",
    tiers: [
      {
        name: "Basic",
        priceFrom: 349000,
        sla: "24 h hábiles",
        tickets: "Bolsa 4 h/mes",
        features: [
          "Pipeline CI/CD básico",
          "Ambiente de prueba (DEV/QA)",
          "Monitoreo y alertas iniciales",
        ],
      },
      {
        name: "Plus",
        priceFrom: 399000,
        sla: "12 h hábiles",
        tickets: "Bolsa 6 h/mes",
        features: [
          "Infraestructura como código (starter)",
          "Buenas prácticas de seguridad (WAF/CDN opcional)",
          "Revisión de costos (FinOps) básica",
        ],
        highlight: true,
      },
      {
        name: "Pro",
        priceFrom: 549000,
        sla: "8 h hábiles",
        tickets: "Bolsa 8 h/mes",
        features: [
          "Pipelines por servicio/microservicio",
          "IaC ampliado (módulos reutilizables)",
          "Observabilidad mejorada (logs, métricas, traces)",
        ],
      },
    ],
    notes: [
      "No incluye costos de nube (AWS/Azure/GCP).",
      "Horas adicionales o proyectos específicos se cotizan.",
    ],
  },

  "Paquetes de Desarrollo": {
    key: "dev",
    tag: "Bolsa de horas",
    tiers: [
      {
        name: "10 h",
        priceFrom: 330000,
        sla: "Según priorización",
        tickets: "Gestión Kanban",
        features: [
          "Desarrollo de funcionalidades menores",
          "Revisión de código y QA básico",
          "Demo al cierre del paquete",
        ],
        highlight: true,
      },
      {
        name: "20 h",
        priceFrom: 620000,
        sla: "Según priorización",
        tickets: "Gestión Kanban",
        features: [
          "Features medianas y ajustes",
          "Integraciones simples",
          "Documentación breve",
        ],
      },
      {
        name: "40 h",
        priceFrom: 1200000,
        sla: "Según priorización",
        tickets: "Gestión Kanban",
        features: [
          "Módulos completos o refactors",
          "Integraciones API más complejas",
          "QA funcional y handover",
        ],
      },
    ],
    notes: [
      "Horas consumibles dentro del mes (o rollover acordado).",
      "Alcance especificado en tablero y acta de inicio.",
    ],
  },

  "SEO / Crecimiento": {
    key: "seo",
    tag: "Visibilidad y conversión",
    tiers: [
      {
        name: "Basic",
        priceFrom: 149000,
        sla: "48 h hábiles",
        tickets: "1 solicitud/mes",
        features: [
          "Setup GA4 y Search Console",
          "SEO on-page básico",
          "1 contenido optimizado/mes",
        ],
      },
      {
        name: "Plus",
        priceFrom: 249000,
        sla: "24 h hábiles",
        tickets: "2 solicitudes/mes",
        features: [
          "Plan de contenidos mensual",
          "Optimización técnica on-page",
          "Dashboard de métricas",
        ],
        highlight: true,
      },
      {
        name: "Pro",
        priceFrom: 399000,
        sla: "24–12 h hábiles",
        tickets: "3 solicitudes/mes",
        features: [
          "CRO básico (tests A/B simples)",
          "Linkbuilding ligero",
          "Informe ejecutivo mensual",
        ],
      },
    ],
    notes: [
      "Pauta publicitaria no incluida.",
      "Resultados dependen del sector y competencia.",
    ],
  },
};

function Planes() {
  const families = Object.keys(CATALOG);
  const [active, setActive] = useState(families[0]);
  const [showCompare, setShowCompare] = useState(false);

  const current = useMemo(() => CATALOG[active], [active]);

  return (
    <>
      {/* HERO */}
      <section className="hero text-white py-5">
        <Container>
          <Row className="text-center">
            <Col md={{ span: 10, offset: 1 }}>
              <h1 className="fw-bold">
                Planes <span className="text-gradient">mensuales</span>
              </h1>
              <p className="lead mb-0">
                Precios <strong>desde</strong> + IVA y con alcance claro. Cambios de
                diseño mayor o nuevas funcionalidades se cotizan aparte.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* NAV FAMILIAS */}
      <section className="pt-4 section-soft">
        <Container>
          <Nav
            variant="pills"
            className="justify-content-center flex-wrap gap-2"
            activeKey={active}
            onSelect={(k) => setActive(k || families[0])}
          >
            {families.map((name) => (
              <Nav.Item key={name}>
                <Nav.Link eventKey={name}>{name}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Container>
      </section>

      {/* PLANES POR FAMILIA */}
      <section className="py-4 section-soft">
        <Container>
          <Row className="mb-3">
            <Col className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <h4 className="mb-0">{active}</h4>
                <Badge bg="secondary">{current.tag}</Badge>
              </div>
              <Button variant="outline-primary" onClick={() => setShowCompare(true)}>
                Comparar planes
              </Button>
            </Col>
          </Row>

          <Row className="g-4">
            {current.tiers.map((t) => (
              <Col md={6} lg={4} key={t.name}>
                <Card
                  className={`h-100 border-0 shadow-soft rounded-2xl ${
                    t.highlight ? "ring-2" : ""
                  }`}
                >
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <Card.Title className="mb-0">{t.name}</Card.Title>
                      <Badge bg={t.highlight ? "primary" : "secondary"}>
                        {t.tickets}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <div className="display-6 fw-bold">{money(t.priceFrom)}</div>
                      <div className="text-muted small">desde + IVA / mes</div>
                      <div className="text-muted small">SLA respuesta: {t.sla}</div>
                    </div>

                    <ListGroup variant="flush" className="mb-4">
                      {t.features.map((f, i) => (
                        <ListGroup.Item
                          key={i}
                          className="border-0 ps-0 d-flex gap-2 align-items-start"
                        >
                          <BsCheck2 className="mt-1" />
                          <span>{f}</span>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    <div className="mt-auto">
                      <Button
                        variant={t.highlight ? "primary" : "outline-primary"}
                        className="w-100"
                      >
                        Consultar este plan
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Notas de alcance */}
          <Row className="mt-4">
            <Col md={{ span: 10, offset: 1 }}>
              <Card className="border-0 shadow-soft rounded-2xl">
                <Card.Body>
                  <ul className="mb-0">
                    {current.notes.map((n, idx) => (
                      <li key={idx} className="text-muted">
                        {n}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Add-ons comunes */}
          <Row className="mt-4">
            <Col md={{ span: 10, offset: 1 }}>
              <Card className="border-0 shadow-soft rounded-2xl">
                <Card.Body>
                  <h6 className="mb-2">Add-ons opcionales</h6>
                  <p className="mb-0 text-muted">
                    Horas extra, On-Call fuera de horario, WAF/CDN, migración de
                    hosting, auditoría de seguridad, capacitaciones y reportes
                    ejecutivos. Se cotizan según alcance.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Modal comparativa */}
      <Modal show={showCompare} onHide={() => setShowCompare(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Comparativa — {active}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive bordered hover className="align-middle">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Desde (CLP + IVA / mes)</th>
                <th>SLA</th>
                <th>Tickets / Horas</th>
                <th>Incluye</th>
              </tr>
            </thead>
            <tbody>
              {current.tiers.map((t) => (
                <tr key={t.name}>
                  <td>
                    <strong>{t.name}</strong>
                  </td>
                  <td>{money(t.priceFrom)}</td>
                  <td>{t.sla}</td>
                  <td>{t.tickets}</td>
                  <td>
                    <ul className="mb-0 ps-3">
                      {t.features.slice(0, 3).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                      {t.features.length > 3 && <li>…</li>}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="text-muted small mb-0">
            Los valores son referenciales “desde”. El precio final se confirma
            tras una evaluación técnica del estado actual y el alcance requerido.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCompare(false)}>
            Cerrar
          </Button>
          <Button variant="primary">Solicitar propuesta</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Planes;
