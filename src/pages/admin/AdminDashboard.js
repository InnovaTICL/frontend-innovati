import React, { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";
import "../../styles/theme.css";
import "../../styles/admin-dashboard.css";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [clients, setClients] = useState([]);
  const [clientUsers, setClientUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const token = adminGetToken();
      const [c, u, p, t] = await Promise.all([
        apiFetch("/api/admin/clients", { token }),
        apiFetch("/api/admin/client-users", { token }),
        apiFetch("/api/admin/projects", { token }),
        apiFetch("/api/admin/tickets", { token }),
      ]);
      setClients(c || []);
      setClientUsers(u || []);
      setProjects(p || []);
      setTickets(t || []);
    } catch (e) {
      setErr(e.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  // ===== Helpers
  const parseDate = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d) ? null : d;
  };
  const fmt = (v) => {
    const d = parseDate(v);
    return d ? d.toLocaleString() : "—";
  };

  // ===== Derivados (contadores y resúmenes)
  const counts = useMemo(() => {
    const ticketsOpen = (tickets || []).filter(t => /abierto|progreso/i.test(t.status || "")).length;
    return {
      clients: clients.length,
      clientUsers: clientUsers.length,
      projects: projects.length,
      ticketsOpen
    };
  }, [clients, clientUsers, projects, tickets]);

  const projSummary = useMemo(() => {
    const enCurso  = projects.filter(p => /curso/i.test(p.status || "")).length;
    const enEspera = projects.filter(p => /espera|hold|pausa/i.test(p.status || "")).length;
    const cerrados = projects.filter(p => /cerrad/i.test(p.status || "")).length;
    const avg = Math.round(projects.reduce((a, r) => a + (r.progress || 0), 0) / (projects.length || 1));
    return { enCurso, enEspera, cerrados, avg };
  }, [projects]);

  const ticketsSummary = useMemo(() => {
    const abierto   = tickets.filter(t => /abierto/i.test(t.status || "")).length;
    const progreso  = tickets.filter(t => /progreso/i.test(t.status || "")).length;
    const resuelto  = tickets.filter(t => /resuelto/i.test(t.status || "")).length;
    const cerrado   = tickets.filter(t => /cerrado/i.test(t.status || "")).length;
    return { abierto, progreso, resuelto, cerrado };
  }, [tickets]);

  // ===== Top recientes (orden por updated_at o created_at)
  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => (parseDate(b.updated_at || b.created_at) - parseDate(a.updated_at || a.created_at)))
      .slice(0, 5);
  }, [projects]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => (parseDate(b.updated_at || b.created_at) - parseDate(a.updated_at || a.created_at)))
      .slice(0, 5);
  }, [tickets]);

  // ===== Badges
  const projStatusBadge = (st) => {
    const s = (st || "").toLowerCase();
    if (s.includes("curso"))   return "badge-st ok";
    if (s.includes("cerr"))    return "badge-st done";
    if (s.includes("esper"))   return "badge-st hold";
    return "badge-st muted";
  };
  const sevBadge = (sev) => {
    const s = (sev || "").toLowerCase();
    if (s.includes("alta"))  return "sev sev-high";
    if (s.includes("media")) return "sev sev-mid";
    return "sev sev-low";
  };
  const tktStatus = (st) => {
    const s = (st || "").toLowerCase();
    if (s.includes("abierto"))     return "st st-open";
    if (s.includes("progreso"))    return "st st-progress";
    if (s.includes("resuelto"))    return "st st-done";
    if (s.includes("cerrado"))     return "st st-closed";
    return "st";
  };

  return (
    <>
      <AdminNavbar />

      <div className="container py-3 admin-dashboard">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0 fw-bold">Dashboard</h3>
          <button
            className={`btn btn-light btn-sm btn-refresh ${loading ? "loading" : ""}`}
            onClick={load}
            disabled={loading}
            title="Actualizar datos"
          >
            <span className="ico">⟳</span>
            {loading ? "Actualizando…" : "Actualizar"}
          </button>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        {/* KPIs */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-with-ico">
              <div className="kpi-ico">🏢</div>
              <div>
                <div className="kpi-title">Clientes</div>
                <div className="kpi-value">{counts.clients}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-with-ico">
              <div className="kpi-ico">👥</div>
              <div>
                <div className="kpi-title">Usuarios cliente</div>
                <div className="kpi-value">{counts.clientUsers}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-with-ico">
              <div className="kpi-ico">📦</div>
              <div>
                <div className="kpi-title">Proyectos</div>
                <div className="kpi-value">{projects.length}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card kpi-with-ico">
              <div className="kpi-ico">🎫</div>
              <div>
                <div className="kpi-title">Tickets abiertos</div>
                <div className="kpi-value">{counts.ticketsOpen}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Resúmenes rápidos */}
        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">Proyectos</h5>
                  <a href="/admin/projects" className="btn btn-link p-0">Ver todos →</a>
                </div>

                <div className="row g-3">
                  <div className="col-4"><div className="mini-kpi"><div className="label">En curso</div><div className="val">{projSummary.enCurso}</div></div></div>
                  <div className="col-4"><div className="mini-kpi"><div className="label">En espera</div><div className="val">{projSummary.enEspera}</div></div></div>
                  <div className="col-4"><div className="mini-kpi"><div className="label">Cerrados</div><div className="val">{projSummary.cerrados}</div></div></div>
                </div>

                <div className="mt-3">
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Avance promedio</span><span>{projSummary.avg}%</span>
                  </div>
                  <div className="progress h-10 mt-1">
                    <div className="progress-bar" style={{ width: `${projSummary.avg}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">Tickets</h5>
                  <a href="/admin/tickets" className="btn btn-link p-0">Ver todos →</a>
                </div>

                <div className="row g-2">
                  <div className="col-6"><div className="pill pill-blue">Abiertos <span>{ticketsSummary.abierto}</span></div></div>
                  <div className="col-6"><div className="pill pill-info">En Progreso <span>{ticketsSummary.progreso}</span></div></div>
                  <div className="col-6"><div className="pill pill-success">Resueltos <span>{ticketsSummary.resuelto}</span></div></div>
                  <div className="col-6"><div className="pill pill-muted">Cerrados <span>{ticketsSummary.cerrado}</span></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listas recientes */}
        <div className="row g-3 mt-2">
          <div className="col-12 col-lg-7">
            <div className="card shadow-soft">
              <div className="card-body recent">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Últimos proyectos</h6>
                  <a href="/admin/projects" className="btn btn-link p-0 small">Ver todos</a>
                </div>
                <ul className="recent-list">
                  {recentProjects.length ? recentProjects.map(p => (
                    <li key={p.id} className="recent-item">
                      <div className="left">
                        <div className="title">{p.name}</div>
                        <div className="meta small text-muted">
                          {p.client_name} · {p.code} · {fmt(p.updated_at || p.created_at)}
                        </div>
                      </div>
                      <div className="right">
                        <span className={projStatusBadge(p.status)}>{p.status || "—"}</span>
                      </div>
                    </li>
                  )) : <li className="recent-empty">No hay proyectos recientes.</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card shadow-soft">
              <div className="card-body recent">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Últimos tickets</h6>
                  <a href="/admin/tickets" className="btn btn-link p-0 small">Ver todos</a>
                </div>
                <ul className="recent-list">
                  {recentTickets.length ? recentTickets.map(t => (
                    <li key={t.id} className="recent-item">
                      <div className="left">
                        <a className="title link" href={`/admin/tickets/${t.id}`}>{t.title}</a>
                        <div className="meta small text-muted">
                          {t.client_name} · {t.project_code} · {fmt(t.updated_at || t.created_at)}
                        </div>
                      </div>
                      <div className="right stack">
                        <span className={sevBadge(t.severity)}>{t.severity}</span>
                        <span className={tktStatus(t.status)}>{t.status}</span>
                      </div>
                    </li>
                  )) : <li className="recent-empty">No hay tickets recientes.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Atajos rápidos */}
        <div className="card shadow-soft mt-4">
          <div className="card-body quick-actions">
            <a href="/admin/clients" className="qa btn-ghost">
              <span className="ico">👥</span><span>Gestionar Clientes</span>
            </a>
            <a href="/admin/client-users" className="qa btn-ghost">
              <span className="ico">🧑‍💻</span><span>Usuarios Cliente</span>
            </a>
            <a href="/admin/projects" className="qa btn-ghost">
              <span className="ico">📦</span><span>Proyectos</span>
            </a>
            <a href="/admin/tickets" className="qa btn-ghost">
              <span className="ico">🎫</span><span>Tickets</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
