import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Form, Alert, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiSearch, FiSliders, FiArrowRight,
  FiCode, FiCloud, FiShield, FiLayers, FiZap, FiPenTool
} from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

const FALLBACK = [
  { id: 1, titulo: "Desarrollo a medida", descripcion: "Aplicaciones web con React, APIs seguras y PostgreSQL.", categoria: "Desarrollo", desde_precio: 0 },
  { id: 2, titulo: "Cloud y DevOps", descripcion: "Despliegue en AWS/Azure, CI/CD y optimización de costos.", categoria: "Cloud", desde_precio: 0 },
  { id: 3, titulo: "Soporte y seguridad", descripcion: "Backups, monitoreo, hardening y parches continuos.", categoria: "Soporte", desde_precio: 0 },
];

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const formatDesdePrecio = (v) => {
  if (v === null || v === undefined || v === "") return "consulta";
  if (typeof v === "number") return v > 0 ? CLP.format(v) : "a convenir";
  const n = Number(v);
  if (Number.isNaN(n)) return "consulta";
  return n > 0 ? CLP.format(n) : "a convenir";
};

const toSlug = (t = "") =>
  t.toLowerCase()
   .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .replace(/&/g, "y")
   .replace(/[^a-z0-9]+/g, "-")
   .replace(/(^-|-$)/g, "");

// Icono + color por categoría (colores suaves para chips)
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
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${API_URL}/servicios`, { signal: controller.signal, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`API /servicios respondió ${res.status}`);
        const data = await res.json();
        const lista = Array.isArray(data) ? data :
                      Array.isArray(data?.servicios) ? data.servicios :
                      Array.isArray(data?.data) ? data.data : [];
        setServicios(lista.length ? lista : FALLBACK);
        setError(null);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.warn("[Servicios] usando FALLBACK:", e);
          setError(e.message || String(e));
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
    (servicios || []).forEach((s) => s?.categoria && cats.add(s.categoria));
    return Array.from(cats);
  }, [servicios]);

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return (servicios || []).filter((s) => {
      const matchCat = categoria === "Todas" || s?.categoria === categoria;
      const matchTxt =
        !term ||
        (s?.titulo && s.titulo.toLowerCase().includes(term)) ||
        (s?.descripcion && s.descripcion.toLowerCase().includes(term));
      return matchCat && matchTxt;
    });
  }, [servicios, busqueda, categoria]);

  return (
    <>
      {/* HERO con tipografía más marcada */}
      <div
        className="py-5 mb-4"
        style={{
          background: "linear-gradient(135deg, rgba(93,78,255,0.10) 0%, rgba(93,78,255,0.04) 60%, rgba(0,0,0,0) 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Container>
          <h1 className="display-6 fw-bolder mb-1" style={{ letterSpacing: "-.02em", lineHeight: 1.1 }}>
            Servicios
          </h1>
          <p className="text-muted mb-0">Elige lo que necesitas y conversemos tu proyecto.</p>
        </Container>
      </div>

      <section className="pb-5">
        <Container>
          {/* Barra de filtros */}
          <Card className="border-0 shadow-sm mb-4 rounded-4">
            <Card.Body>
              <Row className="g-3 align-items-center">
                <Col md={7}>
                  <div className="position-relative">
                    <FiSearch className="position-absolute" style={{ left: 12, top: 12, opacity: .7 }} />
                    <Form.Control
                      style={{ paddingLeft: 38, height: 44 }}
                      placeholder="Buscar servicio (ej. React, AWS, soporte...)"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="position-relative">
                    <FiSliders className="position-absolute" style={{ left: 12, top: 12, opacity: .7 }} />
                    <Form.Select
                      style={{ paddingLeft: 38, height: 44 }}
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                      {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                    </Form.Select>
                  </div>
                </Col>
                <Col md={2} className="text-md-end">
                  <div className="small text-muted">{cargando ? "Cargando…" : `${filtrados.length} resultado${filtrados.length === 1 ? "" : "s"}`}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Estados */}
          {error && (
            <Alert variant="warning" className="mb-4" role="alert">
              No se pudo cargar desde la API (<code>{error}</code>). Mostrando lista base.
            </Alert>
          )}

          {/* Grid */}
          <Row className="g-4">
            {cargando ? (
              // Skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <Col md={6} lg={4} key={`sk-${i}`}>
                  <div className="card h-100 border-0 rounded-4 shadow-sm skeleton-card">
                    <div className="skeleton-line w-75 mb-2"></div>
                    <div className="skeleton-line w-100 mb-2"></div>
                    <div className="skeleton-line w-50"></div>
                    <div className="mt-auto skeleton-chip"></div>
                  </div>
                </Col>
              ))
            ) : (
              filtrados.map((s) => {
                const cat = CAT[s?.categoria] || null;
                return (
                  <Col md={6} lg={4} key={s.id}>
                    <Card className="h-100 border-0 rounded-4 servicio-card">
                      <Card.Body className="d-flex flex-column">
                        {/* Encabezado con icono */}
                        <div className="d-flex align-items-start gap-3 mb-2">
                          <div className="icon-wrap flex-shrink-0">
                            {cat?.icon || <FiCode />}
                          </div>
                          <div className="w-100">
                            <div className="d-flex justify-content-between align-items-start">
                              <Card.Title className="mb-1 fw-bold lh-sm" style={{ letterSpacing: "-.01em" }}>
                                {s.titulo}
                              </Card.Title>
                              {s?.categoria && (
                                <Badge bg="light" text="dark" className={`rounded-pill px-3 ${cat?.className || ""}`}>
                                  {s.categoria}
                                </Badge>
                              )}
                            </div>
                            {s?.descripcion && (
                              <Card.Text className="text-muted mt-1 mb-0">{s.descripcion}</Card.Text>
                            )}
                          </div>
                        </div>

                        <div className="mt-auto d-flex justify-content-between align-items-center pt-3">
                          <small className="text-muted">Desde {formatDesdePrecio(s.desde_precio)}</small>
                          <Button
                            as={Link}
                            to={`/servicios/${toSlug(s.titulo)}`}
                            size="sm"
                            variant="outline-primary"
                            className="btn-ghost"
                            aria-label={`Ver más sobre ${s.titulo}`}
                          >
                            Ver más <FiArrowRight className="ms-1" />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            )}

            {!cargando && filtrados.length === 0 && (
              <Col>
                <Card className="border-0 text-center shadow-sm rounded-4">
                  <Card.Body className="py-5">
                    <h5 className="mb-1 fw-bold">Sin resultados</h5>
                    <p className="text-muted mb-0">
                      No encontramos servicios para este filtro. Prueba con otra palabra clave o categoría.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* estilos finos */}
      <style>{`
        .servicio-card { box-shadow: 0 10px 28px rgba(0,0,0,.06); transition: transform .18s ease, box-shadow .18s ease, border .18s ease; }
        .servicio-card:hover { transform: translateY(-2px); box-shadow: 0 18px 48px rgba(0,0,0,.10); border-color: rgba(99,102,241,.25); }
        .icon-wrap { width: 42px; height: 42px; border-radius: 12px; display:flex; align-items:center; justify-content:center; background: rgba(99,102,241,.10); color:#6366f1; }
        .btn-ghost { transition: background-color .15s ease, transform .15s ease; }
        .btn-ghost:hover { transform: translateX(1px); }
        /* chips por categoría */
        .cat-dev{ background: #eef2ff !important; }
        .cat-cloud{ background: #eaf8ff !important; }
        .cat-support{ background: #effaf1 !important; }
        .cat-int{ background: #f6f2ff !important; }
        .cat-auto{ background: #fff7ed !important; }
        .cat-ui{ background: #f4f4f5 !important; }

        /* skeleton */
        .skeleton-card{ padding: 20px; border-radius: 16px; }
        .skeleton-line{ height: 12px; border-radius: 6px; background: linear-gradient(90deg, #eee 25%, #f6f6f6 37%, #eee 63%); background-size: 400% 100%; animation: shimmer 1.2s ease-in-out infinite; }
        .skeleton-chip{ width: 92px; height: 24px; border-radius: 999px; margin-top: 16px; background: linear-gradient(90deg, #eee 25%, #f6f6f6 37%, #eee 63%); background-size: 400% 100%; animation: shimmer 1.2s ease-in-out infinite; }
        @keyframes shimmer { 0%{background-position: 100% 0} 100%{background-position: -100% 0} }
      `}</style>
    </>
  );
}

export default Servicios;