import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../config/api";
import { getToken, getUser } from "../../config/auth";
import ClienteNavbar from "../../components/ClienteNavbar";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from "chart.js";
import "../../styles/theme.css";
import { fFecha, fFechaHora } from "../../utils/fecha";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Kpi({ title, value, to, icon }) {
  const content = (
    <div className="card card-elevated h-100 kpi-card">
      <div className="card-body d-flex align-items-center gap-3">
        {icon ? <div className="p-2 bg-light rounded">{icon}</div> : null}
        <div>
          <div className="kpi-title">{title}</div>
          <div className="kpi-value mt-1">{value}</div>
        </div>
      </div>
    </div>
  );
  return to ? (
    <Link to={to} className="text-decoration-none text-reset">{content}</Link>
  ) : content;
}

const daysUntil = (iso) => {
  if (!iso) return Infinity;
  const d = new Date(iso), now = new Date();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
};
const daysSince = (iso) => {
  if (!iso) return Infinity;
  const d = new Date(iso), now = new Date();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
};

export default function ClienteDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const user = getUser();

  useEffect(() => {
    (async () => {
      setErr(""); setLoading(true);
      try {
        const token = getToken();
        const [p, t, inv, d] = await Promise.all([
          apiFetch("/api/projects", { token }),
          apiFetch("/api/tickets", { token }),
          apiFetch("/api/invoices", { token }),
          apiFetch("/api/documents", { token }),
        ]);
        setProjects(p || []);
        setTickets((t || []).sort((a,b)=> new Date(b.created_at)-new Date(a.created_at)).slice(0,6));
        setInvoices(inv || []);
        setDocuments(d || []);
      } catch (e) { setErr(e.message || "Error cargando dashboard"); }
      finally { setLoading(false); }
    })();
  }, []);

  // --------- ALERTAS ----------
  const dueSoonInvoices = useMemo(
    () => invoices.filter(i => !String(i.status).toLowerCase().includes("pag")
      && daysUntil(i.due_date) <= 7),
    [invoices]
  );

  const overdueInvoices = useMemo(
    () => invoices.filter(i => !String(i.status).toLowerCase().includes("pag")
      && daysUntil(i.due_date) < 0),
    [invoices]
  );

  const staleTickets = useMemo(
    () => tickets.filter(t => daysSince(t.created_at) >= 7 && String(t.status).toLowerCase().includes("abierto")),
    [tickets]
  );

  const urgentMilestones = useMemo(() => {
    const mils = [];
    (projects || []).forEach(p => {
      (p.milestones || []).forEach(m => { if (daysUntil(m.due_date) <= 10) mils.push({ ...m, project: p }); });
    });
    return mils.slice(0, 5);
  }, [projects]);

  // --------- CHART (tickets últimos 6 meses) ----------
  const chartData = useMemo(() => {
    const counts = {}; // { '2025-05': {open:2, closed:4} }
    (tickets || []).forEach(t => {
      const d = new Date(t.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      counts[key] = counts[key] || { open: 0, closed: 0 };
      const closed = /cerr|resuelt/i.test(t.status || "");
      counts[key][closed ? "closed" : "open"]++;
    });
    const keys = Object.keys(counts).sort().slice(-6);
    return {
      labels: keys,
      datasets: [
        { label: "Abiertos", data: keys.map(k => counts[k].open), backgroundColor: "rgba(138,43,226,.6)" },
        { label: "Cerrados", data: keys.map(k => counts[k].closed), backgroundColor: "rgba(42,179,255,.6)" },
      ],
    };
  }, [tickets]);

  return (
    <>
      <ClienteNavbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="mb-1">Hola, {user?.full_name || "cliente"} 👋</h3>
            <div className="meta-muted">
              <span className="pill pill-sla">SLA {user?.sla_level || "Gold"}</span>
              <span className="ms-2">Empresa: <strong>{user?.client_name || "—"}</strong></span>
            </div>
          </div>
          <Link to="/cliente/tickets/nuevo" className="btn btn-gradient btn-sm">Nuevo ticket</Link>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}
        {loading && <div className="text-muted">Cargando…</div>}

        {!loading && !err && (
          <>
            {/* KPIs */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-3"><Kpi title="Proyectos activos" value={projects.length} to="/cliente/proyectos"/></div>
              <div className="col-12 col-md-3"><Kpi title="Tickets (últimos)" value={tickets.length} to="/cliente/proyectos"/></div>
              <div className="col-12 col-md-3">
                <Kpi title="Facturas pendientes" value={invoices.filter(i=>!String(i.status).toLowerCase().includes("pag")).length} to="/cliente/facturas"/>
              </div>
              <div className="col-12 col-md-3"><Kpi title="Documentos" value={documents.length} to="/cliente/proyectos"/></div>
            </div>

            {/* ALERTAS */}
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
                    <div className="mb-2">
                      <span className="pill pill-warn">Hitos próximos</span>{" "}
                      <span className="meta-muted">{urgentMilestones.length} hitos en ≤10 días.</span>
                    </div>
                  )}
                  {!(overdueInvoices.length || dueSoonInvoices.length || staleTickets.length || urgentMilestones.length) && (
                    <div className="text-muted">Sin alertas por ahora.</div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="row g-3">
              {/* TICKETS RECIENTES */}
              <div className="col-lg-7">
                <div className="card card-elevated h-100">
                  <div className="card-header brand">Últimos tickets</div>
                  <div className="card-body">
                    {tickets.length === 0 && <p className="mb-0 text-muted">Sin tickets recientes.</p>}
                    {tickets.map(t => (
                      <div key={t.id} className="mb-3">
                        <strong>{t.title}</strong>{" "}
                        <span className="badge badge-soft bg-light text-muted ms-1">{t.status}</span>{" "}
                        <span className="meta-muted">{t.severity}</span>
                        <div className="small meta-muted">
                          {fFechaHora(t.created_at)} · {t.project_code || `PRJ-${t.project_id}`}
                        </div>
                        <hr className="mt-2"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PANEL DERECHO: FACTURAS + GRÁFICO + AYUDA */}
              <div className="col-lg-5 d-flex flex-column gap-3">
                <div className="card card-elevated">
                  <div className="card-header brand">Facturas pendientes</div>
                  <div className="card-body">
                    {invoices.filter(i=>!String(i.status).toLowerCase().includes("pag")).slice(0,5).map(i => (
                      <div key={i.id} className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{i.number}</strong> · {i.project_code || "—"}
                          <div className="small meta-muted">Vence: {fFecha(i.due_date)}</div>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold">{Number(i.amount).toLocaleString()} {i.currency}</div>
                          <span className="badge badge-pendiente">Pendiente</span>
                        </div>
                      </div>
                    ))}
                    <Link to="/cliente/facturas" className="btn btn-sm btn-outline-primary mt-2">Ir a facturas</Link>
                  </div>
                </div>

                <div className="card card-elevated p-3">
                  <div className="subtitle-muted mb-2 fw-semibold">Actividad de tickets (últimos meses)</div>
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true, plugins: { legend: { position: "bottom" } },
                      scales: { y: { ticks: { precision:0 } } }
                    }}
                    height={160}
                  />
                </div>

                <div className="card card-elevated help-card p-3">
                  <div className="subtitle-muted fw-semibold mb-1">¿Necesitas ayuda?</div>
                  <ul className="list-dot ps-3 mb-2">
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
      </div>
    </>
  );
}
