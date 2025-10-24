import React, { useEffect } from "react";
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
  FiCode,
  FiCloud,
  FiLayers,
  FiZap,
  FiPenTool,
} from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/servicioDetalle.css";

/* ============================
   UTIL: slug consistente
============================ */
const toSlug = (t = "") =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "y")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ============================
   Datos del catálogo (coherente
   con la página de Servicios)
============================ */
const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const CAT_ICON = {
  Desarrollo: <FiCode />,
  Cloud: <FiCloud />,
  Soporte: <FiShield />,
  Integraciones: <FiLayers />,
  Automatización: <FiZap />,
  "UI/UX": <FiPenTool />,
};

const SERVICIOS = [
  {
    titulo: "Desarrollo a medida",
    categoria: "Desarrollo",
    desde: 120000,
    heroTag: "React • APIs • PostgreSQL",
    queEs:
      "Construimos aplicaciones web a medida con React/Flask o Node, APIs seguras y base de datos PostgreSQL. Nos adaptamos a tu proceso y levantamos el alcance contigo.",
    comoSeHace: [
      "Arquitectura y stack definidos desde el Sprint 0.",
      "Definición de historias de usuario priorizadas.",
      "Desarrollo por sprints con demo semanal.",
      "Pruebas, documentación y handoff.",
    ],
    entregables: [
      "Código fuente en repositorio privado",
      "API y Frontend desplegados",
      "Documentación de endpoints y setup",
      "Guía de despliegue y handover",
    ],
    tiempos:
      "Proyectos pequeños: 2–4 sprints. Proyectos medianos: 6–10 sprints. Estimamos contigo en el Sprint 0.",
    highlights: [
      { icon: <FiShield />, text: "Buenas prácticas de seguridad por defecto" },
      { icon: <FiRefreshCw />, text: "Integración y entrega continua (CI/CD)" },
    ],
  },
  {
    titulo: "Cloud y DevOps",
    categoria: "Cloud",
    desde: 200000,
    heroTag: "AWS/Azure • CI/CD",
    queEs:
      "Despliegues confiables en AWS o Azure, pipelines de CI/CD y optimización de costos para evitar sobrecargos.",
    comoSeHace: [
      "Inventario y diagnóstico del entorno actual.",
      "Infraestructura como código (IaC) cuando aplica.",
      "Pipelines de CI/CD y monitoreo.",
      "Hardening básico y backups.",
    ],
    entregables: [
      "Pipeline CI/CD operativo",
      "Infraestructura descrita (IaC) opcional",
      "Monitoreo y alertas básicas",
      "Checklist de hardening y backups",
    ],
    tiempos: "Entre 2 y 6 sprints según complejidad e integraciones.",
    highlights: [
      { icon: <FiRefreshCw />, text: "Automatización de despliegues" },
      { icon: <FiShield />, text: "Mejoras de seguridad y cumplimiento" },
    ],
  },
  {
    titulo: "Soporte y seguridad",
    categoria: "Soporte",
    desde: 180000,
    heroTag: "Backups • Monitoreo • Hardening",
    queEs:
      "Plan de soporte técnico con monitoreo, backups y hardening continuo. Nos enfocamos en estabilidad y SLA.",
    comoSeHace: [
      "Onboarding técnico y métricas clave.",
      "Monitoreo 24/7 con alertas calibradas.",
      "Backups verificados y pruebas de restore.",
      "Parcheo y hardening periódico.",
    ],
    entregables: [
      "Panel con métricas y alertas",
      "Política de backups y restore test",
      "Reporte mensual de salud",
      "Acciones de hardening aplicadas",
    ],
    tiempos:
      "Inicial (setup) 1–2 sprints; luego continuidad mensual según SLA acordado.",
    highlights: [
      { icon: <FiShield />, text: "SLA y métricas claras desde el inicio" },
    ],
  },
  {
    titulo: "Landing corporativa",
    categoria: "Desarrollo",
    desde: 130000,
    heroTag: "SEO básico • Analytics",
    queEs:
      "Página institucional rápida y moderna con SEO básico, analytics y formulario de contacto.",
    comoSeHace: [
      "Wireframe + contenido en Sprint 0",
      "Diseño UI/UX y desarrollo responsivo",
      "Optimización de rendimiento",
      "Deploy y medición con analytics",
    ],
    entregables: [
      "Sitio estático o SPA desplegado",
      "Integración de analytics y metas",
      "Guía de edición de contenido",
      "Backup del código",
    ],
    tiempos: "1–3 sprints, según secciones y contenidos.",
    highlights: [{ icon: <FiRefreshCw />, text: "Carga veloz y Lighthouse verde" }],
  },
  {
    titulo: "E-commerce básico",
    categoria: "Desarrollo",
    desde: 250000,
    heroTag: "Catálogo • Checkout local",
    queEs:
      "Carrito, catálogo y checkout con pasarela local. Ideal para comenzar rápido y escalar.",
    comoSeHace: [
      "Inventario, variantes y políticas comerciales",
      "Integración con pasarela local",
      "Módulos de despacho y estados de pedido",
      "Capacitación breve de uso",
    ],
    entregables: [
      "Tienda operativa con medios de pago",
      "Gestor de productos y stock",
      "Documentación de administración",
      "Soporte post-entrega inicial",
    ],
    tiempos: "4–6 sprints dependiendo de integraciones.",
    highlights: [
      { icon: <FiRefreshCw />, text: "Checkout simple y rápido" },
      { icon: <FiShield />, text: "Buenas prácticas de seguridad" },
    ],
  },
  {
    titulo: "Integraciones API",
    categoria: "Integraciones",
    desde: 180000,
    heroTag: "ERP/CRM • Webhooks",
    queEs:
      "Conectamos tu sistema con ERPs, CRMs o pasarelas mediante APIs seguras y observables.",
    comoSeHace: [
      "Revisión técnica de endpoints y auth",
      "Mapeo de datos y pruebas de integración",
      "Manejo de errores y reintentos",
      "Observabilidad y logs",
    ],
    entregables: [
      "Servicios de integración desplegados",
      "Documento de endpoints y contratos",
      "Métricas y logs de integración",
      "Plan de rollback",
    ],
    tiempos: "2–6 sprints, según cantidad de sistemas a integrar.",
    highlights: [{ icon: <FiLayers />, text: "Contratos claros y versionados" }],
  },
  {
    titulo: "Automatización",
    categoria: "Automatización",
    desde: 200000,
    heroTag: "Bots • Scraping controlado",
    queEs:
      "Automatizamos tareas repetitivas con bots y scraping controlado cuando es legalmente posible.",
    comoSeHace: [
      "Evaluación de riesgos y límites legales",
      "Diseño del flujo y triggers",
      "Desarrollo y pruebas de tolerancia a fallos",
      "Monitoreo y mejoras",
    ],
    entregables: [
      "Bot/automatización operativa",
      "Documentación de operación",
      "Logs y métricas básicas",
      "Plan de mantenimiento",
    ],
    tiempos: "2–5 sprints según complejidad y volumen.",
    highlights: [{ icon: <FiZap />, text: "Ahorro de tiempo y costos" }],
  },
];

// Índice por slug (garantiza coincidencia)
const INDEX = Object.fromEntries(SERVICIOS.map((s) => [toSlug(s.titulo), s]));

/* ============================
   Página
============================ */
function ServicioDetalle() {
  const { slug } = useParams();
  const data = INDEX[slug];

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  if (!data) {
    return (
      <Container className="py-5 text-center">
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
      <div className="servicio-hero text-white py-5 mb-4" data-aos="fade-down">
        <Container>
          <Breadcrumb className="mb-2">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/servicios" }}>
              Servicios
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{data.titulo}</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="display-6 fw-bold mb-2 d-flex align-items-center gap-2">
            <span className="opacity-75">{CAT_ICON[data.categoria] || <FiCode />}</span>
            {data.titulo}
          </h1>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <Badge bg="light" text="dark">
              {data.categoria}
            </Badge>
            {data.heroTag && (
              <Badge bg="secondary" className="opacity-75">
                {data.heroTag}
              </Badge>
            )}
            <span className="text-light-emphasis">
              Desde {CLP.format(data.desde)}
            </span>
          </div>
        </Container>
      </div>

      {/* CONTENIDO */}
      <section className="py-5 section-soft">
        <Container>
          <Row className="g-4">
            {/* Columna principal */}
            <Col md={8} data-aos="fade-right">
              <Card className="border-0 shadow-soft mb-4 rounded-4">
                <Card.Body>
                  <h5 className="fw-semibold mb-2">¿Qué es?</h5>
                  <p className="text-muted">{data.queEs}</p>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-soft mb-4 rounded-4">
                <Card.Body>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiRefreshCw />
                    <h5 className="m-0">¿Cómo trabajamos (Scrum)?</h5>
                  </div>

                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="px-0 border-0">
                      <strong>Sprint 0 – Descubrimiento:</strong> objetivos,
                      alcance y user stories prioritarias.
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 border-0">
                      <strong>Sprints semanales:</strong> planificación,
                      desarrollo, demo y retrospectiva.
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 border-0">
                      <strong>Canales:</strong> reuniones breves y resumen
                      semanal por correo/chat.
                    </ListGroup.Item>
                  </ListGroup>

                  <h6 className="mt-3">Dentro del sprint</h6>
                  <ul className="mb-0 text-muted">
                    {data.comoSeHace.map((i, k) => (
                      <li key={k}>{i}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-soft mb-4 rounded-4">
                <Card.Body>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiCheckCircle />
                    <h5 className="m-0">Entregables</h5>
                  </div>
                  <ul className="mb-0 text-muted">
                    {data.entregables.map((i, k) => (
                      <li key={k}>{i}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-soft mb-4 rounded-4">
                <Card.Body>
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
                      highlights: (data.highlights || []).map((h) => h.text),
                      entregables: data.entregables.slice(0, 3),
                      metodologia:
                        "Scrum con sprints semanales, demos y seguimiento.",
                    },
                  }}
                  variant="primary"
                  className="btn-gradient"
                >
                  Quiero cotizar
                </Button>
              </div>

              <Accordion alwaysOpen data-aos="fade-up">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>¿Cómo fijan el precio final?</Accordion.Header>
                  <Accordion.Body>
                    Partimos con un alcance claro y un precio “desde”. Cualquier
                    cambio se transparenta antes de avanzar.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>¿Cómo es la comunicación?</Accordion.Header>
                  <Accordion.Body>
                    Canal directo para dudas rápidas y resumen semanal de
                    avances. Las demos de sprint mantienen todo alineado.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>¿Qué pasa después de entregar?</Accordion.Header>
                  <Accordion.Body>
                    Incluimos soporte post-entrega inicial y planes de soporte
                    mensual opcionales.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>

            {/* Sidebar */}
            <Col md={4} data-aos="fade-left">
              <Card className="shadow-soft border-0 sticky-top rounded-4" style={{ top: 88 }}>
                <Card.Body>
                  <h6 className="mb-3">Incluye siempre</h6>
                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="px-0 border-0 d-flex align-items-start gap-2">
                      <FiMessageSquare className="mt-1" />
                      <span>Asesoría inicial sin costo</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 border-0 d-flex align-items-start gap-2">
                      <FiRefreshCw className="mt-1" />
                      <span>Planificación ágil con sprints</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 border-0 d-flex align-items-start gap-2">
                      <FiClock className="mt-1" />
                      <span>Actualizaciones semanales</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 border-0 d-flex align-items-start gap-2">
                      <FiShield className="mt-1" />
                      <span>Soporte post-entrega (7 días)</span>
                    </ListGroup.Item>
                  </ListGroup>

                  {data.highlights?.length > 0 && (
                    <>
                      <h6 className="mb-2">Diferenciales</h6>
                      <ul className="mb-3 ps-3 text-muted">
                        {data.highlights.map((h, i) => (
                          <li key={i} className="d-flex align-items-start gap-2">
                            <span className="mt-1">{h.icon}</span>
                            <span>{h.text}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <div className="p-3 rounded bg-light small text-muted mb-3">
                    Los precios “desde” pueden variar según alcance e
                    integraciones. Siempre transparentamos los costos antes de
                    iniciar.
                  </div>

                  <Button
                    as={Link}
                    to="/contacto"
                    variant="primary"
                    className="w-100 btn-gradient"
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
