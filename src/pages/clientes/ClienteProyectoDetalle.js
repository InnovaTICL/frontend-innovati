import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../config/api";
import { getToken } from "../../config/auth";
import ClienteNavbar from "../../components/ClienteNavbar";
import "../../styles/theme.css";
import { fFecha, fFechaHora } from "../../utils/fecha";

const daysUntil = (iso) => {
  if (!iso) return null;
  const d = new Date(iso), now = new Date();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
};

function Row({ label, children }) {
  return (
    <div className="d-flex mb-2">
      <div className="text-muted-2" style={{ minWidth: 140 }}>{label}</div>
      <div className="flex-grow-1">{children}</div>
    </div>
  );
}

function TimelineItem({ title, date, status, notes }) {
  const dueIn = daysUntil(date);
  const color = dueIn != null && dueIn < 0 ? "#ef4444" : dueIn != null && dueIn <= 7 ? "#f59e0b" : "#94a3b8";
  return (
    <div className="position-relative ps-4 pb-3">
      {/* línea vertical */}
      <div style={{ position: "absolute", left: 7, top: 0, bottom: -4, width: 2, background: "#e5e7eb" }} />
      {/* punto */}
      <div style={{
        position: "absolute", left: 0, top: 2, width: 14, height: 14,
        borderRadius: "50%", background: color, boxShadow: "0 0 0 3px #fff"
      }} />
      <div className="d-flex align-items-center gap-2">
        <strong>{title}</strong>
        <span className="badge badge-soft bg-light text-muted">{status}</span>
      </div>
      <div className="small text-muted-2">
        Venc.: {fFecha(date)} {dueIn != null && (dueIn < 0 ? "· Atrasado" : `· En ${dueIn} días`)}
      </div>
      {notes && <div className="small mt-1">{notes}</div>}
    </div>
  );
}

function ClienteProyectoDetalle() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = getToken();
    apiFetch(`/api/projects/${id}`, { token })
      .then((d) => setData(d))
      .catch((e) => setErr(e.message || "Error cargando proyecto"));
  }, [id]);

  const project = data?.project || {};
  const milestones = data?.milestones || [];
  const tasks = data?.tasks || [];
  const tickets = data?.tickets || [];
  const documents = data?.documents || [];

  const dueIn = useMemo(() => daysUntil(project?.due_date), [project?.due_date]);

  if (err)
    return (
      <>
        <ClienteNavbar />
        <div className="container py-4">
          <div className="alert alert-danger">{err}</div>
        </div>
      </>
    );

  if (!data)
    return (
      <>
        <ClienteNavbar />
        <div className="container py-4">Cargando…</div>
      </>
    );

  return (
    <>
      <ClienteNavbar />
      <div className="container pb-5">
        <div className="d-flex align-items-center justify-content-between my-3">
          <h3 className="mb-0">{project.code} — {project.name}</h3>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary"
              onClick={() => nav(`/cliente/tickets/nuevo?project_id=${project.id}`)}
            >
              Nuevo ticket
            </button>
            <Link to="/cliente/proyectos" className="btn btn-outline-secondary">Volver</Link>
          </div>
        </div>

        {/* Resumen */}
        <div className="card card-elevated mb-3">
          <div className="card-body">
            <Row label="Estado:">
              <span className="badge badge-soft bg-light text-muted">{project.status}</span>
            </Row>

            <Row label="Progreso:">
              <div style={{ maxWidth: 420 }}>
                <div className="progress brand" style={{ height: 10, borderRadius: 12 }}>
                  <div className="progress-bar" style={{ width: `${project.progress || 0}%` }} />
                </div>
                <div className="small text-muted-2 mt-1">{project.progress || 0}%</div>
              </div>
            </Row>

            <Row label="SLA:">
              <span className="pill pill-sla">{project.sla_level || "—"}</span>
            </Row>

            <Row label="PM:">{project.pm_name || "—"}</Row>
            <Row label="Inicio:">{fFechaHora(project.start_date)}</Row>
             <Row label="Entrega:">
              {fFechaHora(project.due_date)}{" "}
              {dueIn != null && (
                <span className={`ms-2 pill ${dueIn < 0 ? "pill-danger" : dueIn <= 10 ? "pill-warn" : ""}`}>
                  {dueIn < 0 ? "Atrasado" : `En ${dueIn} días`}
                </span>
              )}
            </Row>

            <Row label="Descripción:">{project.description || "—"}</Row>
          </div>
        </div>

        <div className="row g-3">
          {/* TIMELINE de Hitos */}
          <div className="col-md-6">
            <div className="card card-elevated h-100">
              <div className="card-header brand">Hitos (timeline)</div>
              <div className="card-body">
                {milestones.length === 0 && <p className="mb-0">Sin hitos.</p>}
                {milestones
                  .slice()
                  .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                  .map((h) => (
                    <TimelineItem
                      key={h.id}
                      title={h.title}
                      date={h.due_date}
                      status={h.status}
                      notes={h.notes}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* TAREAS */}
          <div className="col-md-6">
            <div className="card card-elevated h-100">
              <div className="card-header brand">Tareas</div>
              <div className="card-body">
                {tasks.length === 0 && <p className="mb-0">Sin tareas.</p>}
                {tasks.map((t) => {
                  const dIn = daysUntil(t.due_date);
                  const flagClass =
                    dIn != null && (dIn < 0 || dIn <= 3) ? (dIn < 0 ? "pill-danger" : "pill-warn") : "";
                  return (
                    <div key={t.id} className="mb-2">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <strong>{t.title}</strong>
                        <span className="badge badge-soft bg-light text-muted">{t.status}</span>
                        {flagClass && <span className={`pill ${flagClass}`}>{dIn < 0 ? "Atrasada" : `En ${dIn} d.`}</span>}
                      </div>
                      <div className="small text-muted-2">
                        Asignado: {t.assignee || "—"} · Prioridad: {t.priority || "—"} · Venc.: {fFecha(t.due_date)}
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TICKETS */}
          <div className="col-md-6">
            <div className="card card-elevated h-100">
              <div className="card-header brand">Tickets</div>
              <div className="card-body">
                {tickets.length === 0 && <p className="mb-0">Sin tickets.</p>}
                {tickets.map((t) => (
                  <div key={t.id} className="mb-2">
                    <strong>
                      <Link
                        to={`/cliente/tickets/${t.id}`}
                        className="link-underline link-underline-opacity-0"
                        title="Ver detalle del ticket"
                      >
                        {t.title}
                      </Link>
                    </strong>{" "}
                    <span className="badge badge-soft bg-light text-muted">{t.status}</span>{" "}
                    · {t.severity}
                    <div className="small text-muted-2">{fFechaHora(t.created_at)}</div>
                    <hr />
                  </div>
                ))}
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => nav(`/cliente/tickets/nuevo?project_id=${project.id}`)}
                >
                  Abrir nuevo ticket
                </button>
              </div>
            </div>
          </div>

          {/* DOCUMENTOS */}
          <div className="col-md-6">
            <div className="card card-elevated h-100">
              <div className="card-header brand">Documentos</div>
              <div className="card-body">
                {documents.length === 0 && <p className="mb-0">Sin documentos.</p>}
                {documents.map((d) => (
                  <div key={d.id} className="mb-2">
                    <strong>{d.doc_type || "Doc"}</strong>:{" "}
                    <a href={d.storage_url} target="_blank" rel="noreferrer">
                      {d.title}
                    </a>
                    <div className="small text-muted-2">{fFechaHora(d.uploaded_at)}</div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClienteProyectoDetalle;
