import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Form, Alert, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiSearch, FiSliders, FiArrowRight,
  FiCode, FiCloud, FiShield, FiLayers, FiZap, FiPenTool
} from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

import { API_BASE } from "../config/api";
import "../styles/servicios.css";

const FALLBACK = [
  { id: 1, titulo: "Desarrollo a medida", descripcion: "Aplicaciones web con React, APIs seguras y PostgreSQL.", categoria: "Desarrollo", desde_precio: 120000 },
  { id: 2, titulo: "Cloud y DevOps", descripcion: "Despliegue en AWS/Azure, CI/CD y optimización de costos.", categoria: "Cloud", desde_precio: 200000 },
  { id: 3, titulo: "Soporte y seguridad", descripcion: "Backups, monitoreo y hardening continuo.", categoria: "Soporte", desde_precio: 180000 },
];

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const formatDesdePrecio = (v) => {
  if (v === null || v === undefined || v === "") return "consulta";
  const n = Number(v);
  return isNaN(n) ? "consulta" : n > 0 ? CLP.format(n) : "a convenir";
};

const toSlug = (t = "") =>
  t.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "y")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const CAT = {
  Desarrollo: { icon: <FiCode />, className: "cat-dev" },
  Cloud: { icon: <FiCloud />, className: "cat-cloud" },
  Soporte: { icon: <FiShield />, className: "cat-support" },
  Integraciones: { icon: <FiLayers />, className: "cat-int" },
  Automatización: { icon: <FiZap />, className: "cat-auto" },
  "UI/UX": { icon: <FiPenTool />, className: "cat-ui" },
};

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/servicios`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.servicios)
          ? data.servicios
          : [];
        setServicios(lista.length ? lista : FALLBACK);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message);
          setServicios(FALLBACK);
        }
      } finally {
        setCargando(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const categorias = useMemo(() => {
    const cats = new Set(["Todas"]);
    servicios.forEach((s) => s?.categoria && cats.add(s.categoria));
    return Array.from(cats);
  }, [servicios]);

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return servicios.filter((s) => {
      const matchCat = categoria === "Todas" || s.categoria === categoria;
      const matchTxt =
        !term ||
        s.titulo.toLowerCase().includes(term) ||
        s.descripcion.toLowerCase().includes(term);
      return matchCat && matchTxt;
    });
  }, [servicios, busqueda, categoria]);

  return (
    <>
      {/* HERO */}
      <div className="servicios-hero" data-aos="fade-down">
        <Container>
          <h1 className="servicios-title">Servicios</h1>
          <p className="servicios-subtitle">
            Elige lo que necesitas y conversemos tu proyecto.
          </p>
        </Container>
      </div>

      <section className="pb-5">
        <Container data-aos="fade-up">
          {/* FILTROS */}
          <Card className="border-0 filtro-glass mb-4 rounded-4" data-aos="fade-up">
            <Card.Body>
              <Row className="g-3 align-items-center">
                <Col md={7}>
                  <div className="position-relative">
                    <FiSearch className="input-icon" />
                    <Form.Control
                      className="input-lg"
                      placeholder="Buscar servicio (ej. React, AWS, soporte...)"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="position-relative">
                    <FiSliders className="input-icon" />
                    <Form.Select
                      className="input-lg"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                      {categorias.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                <Col md={2} className="text-md-end">
                  <div className="small text-muted">
                    {cargando
                      ? "Cargando…"
                      : `${filtrados.length} resultado${
                          filtrados.length === 1 ? "" : "s"
                        }`}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {error && (
            <Alert variant="warning" className="mb-4" data-aos="fade-up">
              No se pudo cargar desde la API (<code>{error}</code>).
            </Alert>
          )}

          {/* GRID */}
          <Row className="g-4" data-aos="fade-up" data-aos-delay="200">
            {cargando ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Col md={6} lg={4} key={i}>
                  <div className="card h-100 border-0 rounded-4 shadow-sm skeleton-card">
                    <div className="skeleton-line w-75 mb-2"></div>
                    <div className="skeleton-line w-100 mb-2"></div>
                    <div className="skeleton-line w-50"></div>
                  </div>
                </Col>
              ))
            ) : filtrados.length ? (
              filtrados.map((s, idx) => {
                const cat = CAT[s.categoria] || {};
                return (
                  <Col md={6} lg={4} key={s.id} data-aos="fade-up" data-aos-delay={100 * idx}>
                    <Card className="h-100 border-0 rounded-4 servicio-card">
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex align-items-start gap-3 mb-2">
                          <div className={`icon-wrap flex-shrink-0 ${cat.className || ""}`}>
                            {cat.icon || <FiCode />}
                          </div>
                          <div className="w-100">
                            <div className="d-flex justify-content-between align-items-start">
                              <Card.Title className="mb-1 fw-bold lh-sm servicio-heading">
                                {s.titulo}
                              </Card.Title>
                              {s.categoria && (
                                <Badge
                                  bg="light"
                                  text="dark"
                                  className={`rounded-pill px-3 chip ${cat.className || ""}`}
                                >
                                  {s.categoria}
                                </Badge>
                              )}
                            </div>
                            <Card.Text className="text-muted mt-1 mb-0">
                              {s.descripcion}
                            </Card.Text>
                          </div>
                        </div>
                        <div className="mt-auto d-flex justify-content-between align-items-center pt-3">
                          <small className="text-muted">
                            Desde{" "}
                            <strong className="precio">
                              {formatDesdePrecio(s.desde_precio)}
                            </strong>
                          </small>
                          <Button
                            as={Link}
                            to={`/servicios/${toSlug(s.titulo)}`}
                            size="sm"
                            variant="outline-primary"
                            className="btn-ghost"
                          >
                            Ver más <FiArrowRight className="ms-1" />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <Col>
                <Card className="border-0 text-center shadow-sm rounded-4">
                  <Card.Body className="py-5">
                    <h5 className="mb-1 fw-bold">Sin resultados</h5>
                    <p className="text-muted mb-0">
                      No encontramos servicios para este filtro.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Servicios;
