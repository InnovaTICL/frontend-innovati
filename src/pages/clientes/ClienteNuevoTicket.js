import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../config/api";
import { getToken } from "../../config/auth";
import { useNavigate, useLocation } from "react-router-dom";
import ClienteNavbar from "../../components/ClienteNavbar";
import "../../styles/theme.css";

const MAX_DESC = 1000;

function ClienteNuevoTicket() {
  const [proyectos, setProyectos] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Media");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [sending, setSending] = useState(false);

  const nav = useNavigate();
  const { search } = useLocation();

  // Preseleccionar proyecto desde query ?project_id=123
  useEffect(() => {
    const params = new URLSearchParams(search);
    const pre = params.get("project_id");
    if (pre) setProjectId(String(pre));
  }, [search]);

  // Cargar proyectos
  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const list = await apiFetch("/api/projects", { token });
        setProyectos(list || []);
      } catch (e) {
        setErr(e.message || "Error cargando proyectos");
      }
    })();
  }, []);

  const remaining = useMemo(() => Math.max(0, MAX_DESC - description.length), [description]);
  const canSubmit = useMemo(() => projectId && title.trim().length >= 4 && description.trim().length >= 10 && !sending, [projectId, title, description, sending]);

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setErr("");
    setOk(false);
    setSending(true);
    try {
      const token = getToken();
      await apiFetch("/api/tickets", {
        method: "POST",
        token,
        body: {
          project_id: Number(projectId),
          title: title.trim(),
          description: description.trim(),
          severity,
        },
      });
      setOk(true);
      setTimeout(() => nav("/cliente/proyectos"), 900);
    } catch (e) {
      setErr(e.message || "No se pudo crear el ticket");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <ClienteNavbar />
      <div className="container py-3" style={{ maxWidth: 760 }}>
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="mb-3">Nuevo Ticket</h3>
        </div>

        <div className="card card-elevated">
          <div className="card-body">
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Proyecto</label>
                <select
                  className="form-select"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                >
                  <option value="">Selecciona…</option>
                  {proyectos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
                <div className="form-text">Elige el proyecto asociado al ticket.</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Error de autenticación SSO"
                  required
                />
                <div className="form-text">Sé específico y usa palabras clave.</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="5"
                  value={description}
                  maxLength={MAX_DESC}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`Describe el problema, pasos para reproducir, impacto y adjunta enlaces si corresponde (máximo ${MAX_DESC} caracteres).`}
                />
                <div className="d-flex justify-content-between">
                  <div className="form-text">Incluye pasos, errores y contexto.</div>
                  <small className={`text-${remaining < 60 ? "danger" : "muted"}`}>
                    {remaining} caracteres
                  </small>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Severidad</label>
                <select
                  className="form-select"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option>Alta</option>
                  <option>Media</option>
                  <option>Baja</option>
                </select>
                <div className="form-text">
                  Alta: servicio caído / impacto alto · Media: afecta a varios usuarios · Baja: consulta o mejora.
                </div>
              </div>

              {err && <div className="alert alert-danger">{err}</div>}
              {ok && <div className="alert alert-success">Ticket creado correctamente</div>}

              <button className="btn btn-gradient" disabled={!canSubmit}>
                {sending ? "Enviando…" : "Crear ticket"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClienteNuevoTicket;
