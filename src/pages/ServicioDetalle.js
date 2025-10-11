import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Badge,
  Card,
  ListGroup,
  Accordion,
  Breadcrumb,
  Button,
} from "react-bootstrap";
import {
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiShield,
  FiMessageSquare,
  FiArrowLeft,
  FiTrendingUp,
} from "react-icons/fi";

const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const toSlug = (t = "") =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "y")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const SERVICIOS = [
  {
    titulo: "Desarrollo a medida",
    categoria: "Desarrollo",
    desde: 120000,
    heroTag: "Apps y APIs",
    queEs:
      "Creamos aplicaciones web y APIs a la medida de tu negocio usando tecnologías modernas (React, Flask/Node y PostgreSQL). Entregamos soluciones escalables, seguras y fáciles de mantener.",
    comoSeHace: [
      "Trabajamos con metodología ágil Scrum: organizamos el trabajo en sprints cortos y medibles.",
      "Nos mantenemos en contacto constante para priorizar funcionalidades y validar avances.",
      "Prototipamos (mockups) antes de desarrollar para asegurar alineamiento.",
      "Cada sprint genera entregables funcionales y visibles.",
    ],
    entregables: [
      "Código en repositorio privado y documentado.",
      "Entornos de desarrollo, QA y producción en la nube.",
      "Manual breve de uso + sesión de capacitación grabada.",
      "Plan de soporte post-entrega para garantizar continuidad.",
    ],
    tiempos:
      "Un MVP inicial puede estar listo en 2–3 semanas; luego seguimos iterando en sprints semanales según alcance.",
    highlights: [
      { icon: <FiShield />, text: "Buenas prácticas de seguridad y hardening" },
      { icon: <FiRefreshCw />, text: "Despliegues CI/CD (cuando aplica)" },
      { icon: <FiTrendingUp />, text: "Base escalable para crecer" },
    ],
  },
  {
    titulo: "Cloud y DevOps",
    categoria: "Cloud",
    desde: 200000,
    heroTag: "AWS/Azure · CI/CD",
    queEs:
      "Automatizamos despliegues y optimizamos costos en la nube (AWS/Azure) con pipelines CI/CD y buenas prácticas.",
    comoSeHace: [
      "Assessment de la infraestructura actual.",
      "Infraestructura como código (IaC) + pipelines CI/CD.",
      "Monitoreo básico, logging y alertas.",
    ],
    entregables: [
      "Pipeline automatizado de despliegue.",
      "Plantillas IaC (Terraform/CloudFormation).",
      "Reporte de costos y recomendaciones.",
    ],
    tiempos: "2–7 días según complejidad.",
    highlights: [
      { icon: <FiShield />, text: "Controles y permisos mínimos necesarios" },
      { icon: <FiClock />, text: "Rollbacks más rápidos" },
      { icon: <FiTrendingUp />, text: "Ahorro por optimización de recursos" },
    ],
  },
  {
    titulo: "Soporte y seguridad",
    categoria: "Soporte",
    desde: 180000,
    heroTag: "Monitoreo · Backups",
    queEs:
      "Backups, monitoreo y hardening continuo de tu sitio o app. Mantención mensual con foco preventivo.",
    comoSeHace: [
      "Revisión de riesgos y plan de parches.",
      "Automatización de backups y health checks.",
      "Aplicación de cabeceras/permissions y buenas prácticas.",
    ],
    entregables: [
      "Plan de respaldo y restauración probado.",
      "Checklist de seguridad aplicado.",
      "Reporte mensual de estado.",
    ],
    tiempos: "Servicio mensual renovable.",
    highlights: [
      { icon: <FiShield />, text: "Endurecimiento de superficie de ataque" },
      { icon: <FiClock />, text: "Alertas y tiempos de respuesta claros" },
      { icon: <FiMessageSquare />, text: "Canal directo para incidencias" },
    ],
  },
  {
    titulo: "Landing corporativa",
    categoria: "Desarrollo",
    desde: 130000,
    heroTag: "SEO básico · Analytics",
    queEs:
      "Sitio institucional rápido, responsive y optimizado para buscadores, con configuración de analytics.",
    comoSeHace: [
      "Wireframe + propuesta visual.",
      "Implementación responsive (mobile-first).",
      "SEO on-page básico y medición.",
    ],
    entregables: [
      "Landing publicada con dominio y SSL.",
      "Contenidos editables y guía de edición.",
      "Checklist de performance/accesibilidad básico.",
    ],
    tiempos: "3–7 días típicos según contenidos.",
    highlights: [
      { icon: <FiTrendingUp />, text: "Rápida indexación y performance" },
      { icon: <FiShield />, text: "SSL y buenas prácticas de seguridad" },
      { icon: <FiMessageSquare />, text: "Revisión de copy y CTA efectivos" },
    ],
  },
  {
    titulo: "E-commerce básico",
    categoria: "Desarrollo",
    desde: 250000,
    heroTag: "Catálogo · Checkout",
    queEs:
      "Tienda online con catálogo, carrito y pasarela local. Ideal para partir y crecer gradualmente.",
    comoSeHace: [
      "Setup base (Woo/Shopify o headless simple).",
      "Carga inicial de productos y variantes.",
      "Integración de pagos locales y envíos.",
    ],
    entregables: [
      "Tienda operativa lista para vender.",
      "Plantilla de carga masiva + capacitación.",
      "Guía antifraude y buenas prácticas.",
    ],
    tiempos: "1–2 semanas según integraciones.",
    highlights: [
      { icon: <FiTrendingUp />, text: "Listo para vender rápido" },
      { icon: <FiShield />, text: "Buenas prácticas PCI-aware" },
      { icon: <FiRefreshCw />, text: "Evolutivo por módulos" },
    ],
  },
  {
    titulo: "Integraciones API",
    categoria: "Integraciones",
    desde: 180000,
    heroTag: "REST · JSON",
    queEs:
      "Conectamos tu sistema con ERPs/CRMs/pasarelas a través de APIs REST. Manejo de errores, logs y reintentos.",
    comoSeHace: [
      "Revisión de API destino: auth, límites y costos.",
      "Desarrollo de conector y pruebas con datos de ejemplo.",
      "Observabilidad básica (logs/alertas).",
    ],
    entregables: [
      "Conector funcional (endpoint/worker).",
      "Documentación de uso y parámetros.",
      "Tablero simple de monitoreo (opcional).",
    ],
    tiempos: "3–10 días según API.",
    highlights: [
      { icon: <FiRefreshCw />, text: "Reintentos y tolerancia a fallos" },
      { icon: <FiShield />, text: "Gestión de credenciales segura" },
      { icon: <FiTrendingUp />, text: "Ahorro de tiempo operando" },
    ],
  },
  {
    titulo: "Automatización",
    categoria: "Automatización",
    desde: 200000,
    heroTag: "Bots · Scraping controlado",
    queEs:
      "Automatizamos tareas repetitivas con bots/workers. Scraping responsable y ejecutores programados.",
    comoSeHace: [
      "Definición del flujo y fuentes de datos.",
      "Prototipo del bot en entorno controlado.",
      "Programación y alertas de ejecución.",
    ],
    entregables: [
      "Worker/script automatizado.",
      "Manual de operación y límites.",
      "Registro de ejecuciones y fallos.",
    ],
    tiempos: "5–10 días según complejidad.",
    highlights: [
      { icon: <FiClock />, text: "Ahorro de horas operativas" },
      { icon: <FiRefreshCw />, text: "Ejecuciones programadas" },
      { icon: <FiShield />, text: "Respeto de términos y límites" },
    ],
  },
  {
    titulo: "Mantenimiento visual",
    categoria: "UI/UX",
    desde: 80000,
    heroTag: "UI/UX · Accesibilidad",
    queEs:
      "Mejoramos la apariencia, jerarquía visual y microcopys sin tocar la lógica de negocio.",
    comoSeHace: [
      "Diagnóstico de usabilidad y priorización de quick-wins.",
      "Ajustes tipográficos, espaciados, colores y estados.",
      "Pruebas de accesibilidad básicas.",
    ],
    entregables: [
      "Estilos actualizados y guía de uso.",
      "Antes/Después con capturas.",
      "Listado de mejoras futuras sugeridas.",
    ],
    tiempos: "2–5 días por sprint corto.",
    highlights: [
      { icon: <FiTrendingUp />, text: "Mejora inmediata de conversión" },
      { icon: <FiMessageSquare />, text: "Microcopys claros y humanos" },
      { icon: <FiShield />, text: "Contrastes y accesibilidad" },
    ],
  },
];

const INDEX = Object.fromEntries(SERVICIOS.map((s) => [toSlug(s.titulo), s]));

function ServicioDetalle() {
  const { slug } = useParams();
  const data = INDEX[slug];

  if (!data) {
    return (
      <Container className="py-5">
        <h2 className="mb-3">Servicio no encontrado</h2>
        <p className="text-muted">Revisa el enlace o vuelve al listado.</p>
        <Link to="/servicios" className="btn btn-primary">
          Volver a Servicios
        </Link>
      </Container>
    );
  }

  return (
    <>
      {/* HERO */}
      <div
        className="py-5 mb-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(93,78,255,0.10) 0%, rgba(93,78,255,0.04) 60%, rgba(0,0,0,0) 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Container>
          <Breadcrumb className="mb-2">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/servicios" }}>
              Servicios
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{data.titulo}</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="display-5 fw-semibold mb-2">{data.titulo}</h1>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <Badge bg="light" text="dark">
              {data.categoria}
            </Badge>
            {data.heroTag && (
              <Badge bg="secondary" className="opacity-75">
                {data.heroTag}
              </Badge>
            )}
            <span className="text-muted">Desde {CLP.format(data.desde)}</span>
          </div>
        </Container>
      </div>

      {/* CONTENIDO */}
      <section className="py-2">
        <Container>
          <Row className="g-4">
            <Col md={8}>
              <Card className="border-0 mb-3">
                <Card.Body className="p-0">
                  <h5 className="mb-2">¿Qué es?</h5>
                  <p className="text-muted">{data.queEs}</p>
                </Card.Body>
              </Card>

              <Card className="border-0 mb-3">
                <Card.Body className="p-0">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiRefreshCw />
                    <h5 className="m-0">¿Cómo trabajamos (Scrum)?</h5>
                  </div>

                  {/* Timeline simple de sprints */}
                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="px-0">
                      <strong>Sprint 0 – Descubrimiento (1–2 días):</strong>{" "}
                      objetivos, alcance y user stories prioritarias.
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <strong>Sprints de 1 semana:</strong> planificación,
                      desarrollo, demo y retrospectiva. Siempre ves avances.
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <strong>Canales de contacto:</strong> reuniones breves
                      (según necesites) y seguimiento por chat/correo con
                      actualizaciones semanales.
                    </ListGroup.Item>
                  </ListGroup>

                  <h6 className="mt-3">Dentro del sprint</h6>
                  <ul className="mb-0">
                    {data.comoSeHace.map((i, k) => (
                      <li key={k}>{i}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>

              <Card className="border-0 mb-3">
                <Card.Body className="p-0">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiCheckCircle />
                    <h5 className="m-0">Entregables</h5>
                  </div>
                  <ul className="mb-0">
                    {data.entregables.map((i, k) => (
                      <li key={k}>{i}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>

              <Card className="border-0 mb-4">
                <Card.Body className="p-0">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiClock />
                    <h5 className="m-0">Tiempos estimados</h5>
                  </div>
                  <p className="text-muted mb-0">{data.tiempos}</p>
                </Card.Body>
              </Card>

              <div className="d-flex gap-2 mb-5">
                <Button as={Link} to="/servicios" variant="outline-secondary">
                  <FiArrowLeft className="me-1" />
                  Volver
                </Button>
               
               <Button
                as={Link}
                to="/contacto"
                state={{
                    servicio: {
                    slug: toSlug(data.titulo),
                    titulo: data.titulo,
                    categoria: data.categoria,
                    desde: data.desde,
                    resumen: data.queEs,
                    highlights: (data.highlights || []).map(h => h.text),
                    entregables: data.entregables.slice(0, 3), // top 3 para no saturar
                    metodologia: "Scrum con sprints semanales, demos y seguimiento."
                    }
                }}
                variant="primary"
                >
                Quiero cotizar
                </Button>
              </div>

              {/* FAQ cortito para dar confianza */}
              <Accordion alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>¿Cómo fijan el precio final?</Accordion.Header>
                  <Accordion.Body>
                    Partimos con un alcance claro y un precio “desde”. Si el
                    alcance cambia, lo transparentamos antes de continuar. No
                    hay sorpresas.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>¿Cómo es la comunicación?</Accordion.Header>
                  <Accordion.Body>
                    Tendrás un canal directo para consultas rápidas y un
                    resumen semanal de avances. Las demos de sprint mantienen
                    todo alineado.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>¿Qué pasa después de entregar?</Accordion.Header>
                  <Accordion.Body>
                    Incluimos soporte post-entrega inicial y podemos continuar
                    con planes mensuales de soporte/seguridad si lo necesitas.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>

            {/* SIDEBAR */}
            <Col md={4}>
              <Card className="shadow-sm border-0 sticky-top" style={{ top: 88 }}>
                <Card.Body>
                  <h6 className="mb-3">Incluye siempre</h6>
                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                      <FiMessageSquare className="mt-1" />
                      <span>Asesoría inicial sin costo</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                      <FiRefreshCw className="mt-1" />
                      <span>Planificación ágil con sprints</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                      <FiClock className="mt-1" />
                      <span>Actualizaciones semanales</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 d-flex align-items-start gap-2">
                      <FiShield className="mt-1" />
                      <span>Soporte post-entrega (7 días)</span>
                    </ListGroup.Item>
                  </ListGroup>

                  {data.highlights?.length > 0 && (
                    <>
                      <h6 className="mb-2">Diferenciales</h6>
                      <ul className="mb-3 ps-3">
                        {data.highlights.map((h, i) => (
                          <li key={i} className="d-flex align-items-start gap-2">
                            <span className="mt-1">{h.icon}</span>
                            <span>{h.text}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <div className="p-3 rounded bg-light">
                    <div className="small text-muted">
                      Los precios “desde” pueden variar según alcance,
                      integraciones y urgencia. Siempre transparentamos los
                      costos antes de iniciar.
                    </div>
                  </div>

                  <Button
                    as={Link}
                    to="/contacto"
                    variant="primary"
                    className="w-100 mt-3"
                  >
                    Cotizar este servicio
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default ServicioDetalle;