import React, { useRef, useState } from "react";
import {
  Container, Row, Col, Card, Form, Button, InputGroup, Badge, ListGroup, Alert
} from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa"; // <- icono

import { API_BASE } from "../config/api";

// Número de WhatsApp destino
const WHATSAPP_NUMBER = "+56900000000"; // cámbialo por el real

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [fono, setFono] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  // Honeypot anti-bot
  const honeypotRef = useRef(null);

  const validar = () => {
    if (!nombre.trim()) return "Ingresa tu nombre.";
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Ingresa un email válido.";
    if (!mensaje.trim()) return "Escribe un mensaje.";
    if (fono && !/^\d{7,12}$/.test(fono.replace(/\s+/g, ""))) {
      return "Teléfono: usa solo números (7–12 dígitos).";
    }
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setOk(false);
    setErr("");

    if (honeypotRef.current?.value) return; // bot

    const v = validar();
    if (v) return setErr(v);

    try {
      setEnviando(true);
      const res = await fetch(`${API_BASE}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, fono, mensaje })
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (res.ok && data?.ok) {
        setOk(true);
        setNombre(""); setEmail(""); setFono(""); setMensaje("");
      } else {
        const niceMsg =
          data?.msg ||
          data?.detail?.message ||
          (Array.isArray(data?.detail?.errors?.to) && data.detail.errors.to[0]) ||
          data?.error ||
          "No se pudo enviar tu mensaje.";
        setErr(niceMsg);
      }
    } catch {
      setErr("Error de red. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  // Link de WhatsApp
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hola, soy ${nombre || "un interesado"} y quiero más información.`
  )}`;

  return (
    <>
      {/* HERO */}
      <section className="hero text-white py-5">
        <Container>
          <Row className="align-items-center text-center">
            <Col md={{ span: 10, offset: 1 }}>
              <h1 className="fw-bold">
                Ponte en <span className="text-gradient">contacto</span>
              </h1>
              <p className="lead mb-0">
                Conversemos sobre tu proyecto: te respondemos en menos de 24 horas hábiles.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FORM */}
      <section className="py-5 section-soft">
        <Container>
          <Row className="g-4">
            {/* Formulario */}
            <Col md={7}>
              <Card className="border-0 shadow-soft rounded-2xl">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <Card.Title className="mb-0">Escríbenos</Card.Title>
                    <Badge bg="secondary">InnovaTi</Badge>
                  </div>

                  {ok && <Alert variant="success">¡Gracias! Tu mensaje fue enviado correctamente.</Alert>}
                  {err && <Alert variant="warning">{err}</Alert>}

                  <Form onSubmit={onSubmit} noValidate>
                    {/* Honeypot */}
                    <input
                      ref={honeypotRef}
                      type="text"
                      name="company"
                      autoComplete="off"
                      style={{ display: "none" }}
                      tabIndex={-1}
                    />

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Tu nombre"
                          required
                          disabled={enviando}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Correo</Form.Label>
                        <Form.Control
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@correo.com"
                          required
                          disabled={enviando}
                        />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Teléfono</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>+56</InputGroup.Text>
                          <Form.Control
                            inputMode="numeric"
                            pattern="\d*"
                            value={fono}
                            onChange={(e) =>
                              setFono(e.target.value.replace(/[^\d\s]/g, ""))
                            }
                            placeholder="9 1234 5678"
                            disabled={enviando}
                          />
                        </InputGroup>
                      </Col>
                      <Col md={12}>
                        <Form.Label>Mensaje</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          value={mensaje}
                          onChange={(e) => setMensaje(e.target.value)}
                          placeholder="Cuéntanos brevemente tu proyecto"
                          required
                          disabled={enviando}
                        />
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-3 mt-4">
                      <Button type="submit" className="btn-gradient px-4" disabled={enviando}>
                        {enviando ? "Enviando..." : "Enviar"}
                      </Button>

                      {/* Botón WhatsApp mejorado */}
                      <Button
                        as="a"
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp d-inline-flex align-items-center gap-2"
                        aria-label="Hablar por WhatsApp"
                      >
                        <FaWhatsapp size={18} />
                        <span>Hablar por WhatsApp</span>
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Información de contacto */}
            <Col md={5}>
              <Card className="border-0 shadow-soft rounded-2xl mb-4">
                <Card.Body>
                  <Card.Title>Información de contacto</Card.Title>
                  <ListGroup variant="flush" className="mt-3">
                    <ListGroup.Item className="border-0 ps-0">
                      <div className="d-flex flex-column">
                        <span className="text-muted small">Correo</span>
                        <a href="mailto:innovaticl@outlook.com">innovaticl@outlook.com</a>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 ps-0">
                      <div className="d-flex flex-column">
                        <span className="text-muted small">Teléfono</span>
                        <a href="tel:+56900000000">+56 9 0000 0000</a>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 ps-0">
                      <div className="d-flex flex-column">
                        <span className="text-muted small">Horario</span>
                        <span>Lun a Vie, 09:00 a 18:00 (CLT)</span>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA final */}
      <section className="py-5 text-center">
        <Container>
          <h2 className="mb-2">¿Prefieres agendar una llamada?</h2>
          <p className="text-muted mb-4">Coordinamos una videollamada de 20 minutos y te mostramos opciones.</p>
          <div className="d-flex justify-content-center gap-3">
            <Button className="btn-gradient px-4" onClick={onSubmit} disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar desde aquí"}
            </Button>
            <Button
              as="a"
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp d-inline-flex align-items-center gap-2"
              aria-label="Hablar por WhatsApp"
            >
              <FaWhatsapp size={18} />
              <span>Hablar por WhatsApp</span>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Contacto;
