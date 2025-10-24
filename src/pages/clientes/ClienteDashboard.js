import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../config/api";
import { getToken, getUser } from "../../config/auth";
import ClienteNavbar from "../../components/ClienteNavbar";
import "../../styles/theme.css";
import "../../styles/client-dashboard.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/* ---------- Utils ---------- */
const fMonto = (v, cur = "CLP") => `${Number(v || 0).toLocaleString()} ${cur}`;
const fFecha = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleDateString();
};
const fFechaHora = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "—" : d.toLocaleString();
};
const daysUntil = (iso) => {
  if (!iso) return Infinity;
  const d = new Date(iso), now = new Date();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
};
const daysSince = (iso) => {
  if (!iso) return -Infinity;
  const d = new Date(iso), now = new Date();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
};

/* ---------- Pequeño KPI ---------- */
function Kpi({ title, value, to, icon }) {
  const card = (
    <div className="card card-elevated kpi">
      <div className="card-body d-flex align-items-center gap-3">
        {icon ? <div className="kpi-ico">{icon}</div> : null}
        <div>
          <div className="kpi-title">{title}</div>
          <div className="kpi-value">{value}</div>
        </div>
      </div>
    </div>
  );
  return to ? (
    <Link to={to} className="text-decoration-none text-reset">{card}</Link>
  ) : card;
}

export default function ClienteDashboard() {
  const user = getUser();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setErr("");
        const token = getToken();
        const [p, t, inv, d] = await Promise.all([
          apiFetch("/api/projects", { token }),
          apiFetch("/api/tickets", { token }),
          apiFetch("/api/invoices", { token }),
          apiFetch("/api/documents", { token }),
        ]);
        setProjects(p || []);
        setTickets(
          (t || [])
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 6)
        );
        setInvoices(inv || []);
        setDocuments(d || []);
      } catch (e) {
        setErr(e.message || "Error cargando dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- Alertas (dinámicas) ---------- */
  const noPagadas = useMemo(
    () => invoices.filter(i => !String(i.status).toLowerCase().includes("pag")),
    [invoices]
  );
  const overdueInvoices = useMemo(
    () => noPagadas.filter(i => daysUntil(i.due_date) < 0),
    [noPagadas]
  );
  const dueSoonInvoices = useMemo(
    () => noPagadas.filter(i => daysUntil(i.due_date) <= 7 && daysUntil(i.due_date) >= 0),
    [noPagadas]
  );
  const staleTickets = useMemo(
    () => tickets.filter(t => /abierto/i.test(t.status || "") && daysSince(t.created_at) >= 7),
    [tickets]
  );
  const urgentMilestones = useMemo(() => {
    const mils = [];
    (projects || []).forEach(p => (p.milestones || []).forEach(m => {
      if (daysUntil(m.due_date) <= 10) mils.push({ ...m, project: p });
    }));
    return mils.slice(0, 5);
  }, [projects]);

  /* ---------- Chart tickets últimos 6 meses ---------- */
  const chartData = useMemo(() => {
    const counts = {};
    (tickets || []).forEach(t => {
      const d = new Date(t.created_at);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      counts[key] = counts[key] || { open: 0, closed: 0 };
      const closed = /cerr|resuelt/i.test(t.status || "");
      counts[key][closed ? "closed" : "open"]++;
    });
    const keys = Object.keys(counts).sort().slice(-6);
    return {
      labels: keys,
      datasets: [
        { label: "Abiertos", data: keys.map(k => counts[k].open), backgroundColor: "rgba(138,43,226,.65)" },
        { label: "Cerrados", data: keys.map(k => counts[k].closed), backgroundColor: "rgba(42,179,255,.65)" },
      ],
    };
  }, [tickets]);

  return (
    <>
      <ClienteNavbar />
      <main className="container py-4 client-dashboard">
        {/* ===== HERO ENCAPSULADO ===== */}
        <section className="hero-wrap card-elevated">
          <div className="hero-top d-flex flex-wrap justify-content-between align-items-center">
            <div className="pe-3">
              <h3 className="mb-1">Hola, {user?.full_name || "cliente"} 👋</h3>
              <div className="meta-muted d-flex align-items-center gap-2 flex-wrap">
                <span className="pill pill-sla">SLA {user?.sla_level || "Gold"}</span>
                <span>Empresa: <strong>{user?.client_name || "—"}</strong></span>
              </div>
            </div>

            <Link to="/cliente/tickets/nuevo" className="btn btn-gradient btn-sm hero-cta">
              Nuevo ticket
            </Link>
          </div>

          <div className="row g-3 hero-kpis">
            <div className="col-12 col-md-3">
              <Kpi title="Proyectos activos" value={projects.length} to="/cliente/proyectos" icon={<span>📦</span>} />
            </div>
            <div className="col-12 col-md-3">
              <Kpi title="Tickets (últimos)" value={tickets.length} to="/cliente/proyectos" icon={<span>🎫</span>} />
            </div>
            <div className="col-12 col-md-3">
              <Kpi title="Facturas pendientes" value={noPagadas.length} to="/cliente/facturas" icon={<span>🧾</span>} />
            </div>
            <div className="col-12 col-md-3">
              <Kpi title="Documentos" value={documents.length} to="/cliente/proyectos" icon={<span>📁</span>} />
            </div>
          </div>
        </section>

        {err && <div className="alert alert-danger">{err}</div>}
        {loading && <div className="text-muted">Cargando…</div>}

        {!loading && !err && (
          <>
            {/* Alertas */}
            {(overdueInvoices.length || dueSoonInvoices.length || staleTickets.length || urgentMilestones.length) ? (
              <div className="card card-elevated mb-4">
                <div className="card-header strip">Alertas</div>
                <div className="card-body">
                  {overdueInvoices.length > 0 && (
                    <div className="mb-2">
                      <span className="pill pill-danger">Facturas vencidas</span>{" "}
                      <span className="meta-muted">Tienes {overdueInvoices.length}. </span>
                      <Link to="/cliente/facturas" className="btn-link-primary">Ver y pagar →</Link>
                    </div>
                  )}
                  {dueSoonInvoices.length > 0 && (
                    <div className="mb-2">
                      <span className="pill pill-warn">Facturas por vencer</span>{" "}
                      <span className="meta-muted">{dueSoonInvoices.length} vencen en ≤7 días.</span>
                    </div>
                  )}
                  {staleTickets.length > 0 && (
                    <div className="mb-2">
                      <span className="pill pill-warn">Tickets sin resolución</span>{" "}
                      <span className="meta-muted">{staleTickets.length} abiertos hace ≥7 días.</span>
                    </div>
                  )}
                  {urgentMilestones.length > 0 && (
                    <div className="mb-1">
                      <span className="pill pill-warn">Hitos próximos</span>{" "}
                      <span className="meta-muted">{urgentMilestones.length} en ≤10 días.</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="row g-3">
              {/* Últimos tickets */}
              <div className="col-lg-7">
                <div className="card card-elevated h-100">
                  <div className="card-header brand">Últimos tickets</div>
                  <div className="card-body">
                    {tickets.length === 0 && (
                      <p className="mb-0 text-muted">Sin tickets recientes.</p>
                    )}
                    {tickets.map((t, i) => (
                      <div key={t.id || i} className="recent-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{t.title}</strong>{" "}
                            <span className="badge-soft ms-1">{t.status}</span>{" "}
                            <span className="meta-muted">{t.severity}</span>
                            <div className="small meta-muted">
                              {fFechaHora(t.created_at)} · {t.project_code || `PRJ-${t.project_id}`}
                            </div>
                          </div>
                          <Link className="btn btn-sm btn-outline-primary" to={`/cliente/tickets/${t.id}`}>Ver</Link>
                        </div>
                        <hr className="my-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Derecha: facturas + gráfico + ayuda */}
              <div className="col-lg-5 d-flex flex-column gap-3">
                <div className="card card-elevated">
                  <div className="card-header brand">Facturas pendientes</div>
                  <div className="card-body">
                    {noPagadas.slice(0, 5).map(inv => (
                      <div key={inv.id} className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{inv.number}</strong> · {inv.project_code || "—"}
                          <div className="small meta-muted">Vence: {fFecha(inv.due_date)}</div>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold">{fMonto(inv.amount, inv.currency)}</div>
                          <span className="badge-pendiente">Pendiente</span>
                        </div>
                      </div>
                    ))}
                    {noPagadas.length === 0 && <div className="text-muted">No hay facturas pendientes.</div>}
                    <Link to="/cliente/facturas" className="btn btn-sm btn-outline-primary mt-2">Ir a facturas</Link>
                  </div>
                </div>

                <div className="card card-elevated p-3">
                  <div className="subtitle-muted mb-2 fw-semibold">Actividad de tickets (últimos meses)</div>
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: "bottom" } },
                      scales: { y: { ticks: { precision: 0 } } },
                    }}
                    height={160}
                  />
                </div>

                <div className="card card-elevated p-3 help-block">
                  <div className="subtitle-muted fw-semibold mb-2">¿Necesitas ayuda?</div>
                  <ul className="list-dot ps-3 mb-3">
                    <li>Guía rápida de tickets</li>
                    <li>Buenas prácticas para adjuntar evidencias</li>
                    <li>Acuerdos de nivel de servicio (SLA)</li>
                  </ul>
                  <Link to="/cliente/tickets/nuevo" className="btn btn-gradient btn-sm">Abrir ticket</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
