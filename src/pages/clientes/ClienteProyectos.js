import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ClienteNavbar from "../../components/ClienteNavbar";
import { apiFetch } from "../../config/api";
import { getToken } from "../../config/auth";
import "../../styles/theme.css";
import { fFechaHora } from "../../utils/fecha";

function kDaysDiff(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
}

function ProjCard({ p }) {
  const dueIn = kDaysDiff(p?.due_date);
  const dueClass =
    dueIn == null ? "" : dueIn < 0 ? "pill-danger" : dueIn <= 10 ? "pill-warn" : "";
  return (
    <div className="card card-elevated proj-card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h6 className="mb-1">{p.code} — {p.name}</h6>
          <span className="badge badge-soft bg-light text-muted">{p.status}</span>
        </div>
        <div className="small meta-muted mb-2">PM: {p.pm_name || "—"} · SLA: {p.sla_level || "—"}</div>

        <div className="progress brand mb-2" style={{height:10, borderRadius:12}}>
          <div className="progress-bar" style={{ width: `${p.progress || 0}%` }} />
        </div>
        <div className="small text-muted-2">{p.progress || 0}%</div>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="small">
             {p.due_date
              ? <>Entrega: {fFechaHora(p.due_date)} {dueIn != null && <span className={`ms-1 pill ${dueClass}`}>{dueIn < 0 ? "Atrasado" : `En ${dueIn} d.`}</span>}</>
              : "Entrega: —"}
          </div>
          <Link to={`/cliente/proyectos/${p.id}`} className="btn btn-sm btn-gradient">Detalle</Link>
        </div>
      </div>
    </div>
  );
}

function ClienteProyectos() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [view, setView] = useState("kanban"); // 'kanban' | 'cards'
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const data = await apiFetch("/api/projects", { token });
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || "Error cargando proyectos");
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (items || []).filter(p => {
      const hay = `${p.code} ${p.name} ${p.status} ${p.pm_name}`.toLowerCase();
      return s ? hay.includes(s) : true;
    });
  }, [items, q]);

  // KPIs
  const kpis = useMemo(() => {
    const total = filtered.length;
    const enCurso = filtered.filter(p => /curso|progress|in progress/i.test(p.status || "")).length;
    const dueSoon = filtered.filter(p => {
      const d = kDaysDiff(p.due_date);
      return typeof d === "number" && d <= 10;
    }).length;
    const avg = filtered.reduce((a, p) => a + (p.progress || 0), 0) / (total || 1);
    return { total, enCurso, dueSoon, avg: Math.round(avg) };
  }, [filtered]);

  // Kanban por estado “macro”
  const columns = useMemo(() => {
    const groups = {
      plan: { title: "Planificado", key: "plan" },
      run: { title: "En curso", key: "run" },
      hold: { title: "En pausa", key: "hold" },
      done: { title: "Completado", key: "done" },
    };
    const pick = (s = "") => {
      const v = s.toLowerCase();
      if (/(done|complet|cerrado)/.test(v)) return "done";
      if (/(pause|pausa|hold|blocked|bloqueado)/.test(v)) return "hold";
      if (/(curso|progress|activo|implement)/.test(v)) return "run";
      return "plan";
    };
    const map = { plan: [], run: [], hold: [], done: [] };
    filtered.forEach(p => map[pick(p.status || "")].push(p));
    return { groups, map };
  }, [filtered]);

  return (
    <>
      <ClienteNavbar />
      <div className="container pb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="mb-0">Mis Proyectos</h3>
          <div className="d-flex gap-2">
            <input
              placeholder="Buscar por código, nombre, PM…"
              className="form-control"
              style={{ maxWidth: 340 }}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="btn-group">
              <button className={`btn btn-sm ${view === "kanban" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("kanban")}>Kanban</button>
              <button className={`btn btn-sm ${view === "cards" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("cards")}>Tarjetas</button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="row g-3 mb-3">
          <div className="col-sm-6 col-md-3">
            <div className="kpi-tile">
              <div className="kpi-label">Proyectos</div>
              <div className="kpi-value">{kpis.total}</div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="kpi-tile">
              <div className="kpi-label">En curso</div>
              <div className="kpi-value">{kpis.enCurso}</div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="kpi-tile">
              <div className="kpi-label">Vence ≤ 10 días</div>
              <div className="kpi-value">{kpis.dueSoon}</div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="kpi-tile">
              <div className="kpi-label">Avance promedio</div>
              <div className="kpi-value">{kpis.avg}%</div>
            </div>
          </div>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        {/* Vista Kanban */}
        {view === "kanban" && (
          <div className="kanban-grid">
            {Object.values(columns.groups).map(col => (
              <div className="kanban-col" key={col.key}>
                <div className="kanban-col-header">
                  {col.title}
                  <span className="count">{columns.map[col.key].length}</span>
                </div>
                <div className="kanban-col-body">
                  {columns.map[col.key].map(p => (
                    <ProjCard key={p.id} p={p} />
                  ))}
                  {columns.map[col.key].length === 0 && (
                    <div className="empty muted">Sin proyectos</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista Cards */}
        {view === "cards" && (
          <div className="row g-3">
            {filtered.map(p => (
              <div className="col-md-6 col-lg-4" key={p.id}>
                <ProjCard p={p} />
              </div>
            ))}
            {filtered.length === 0 && <p className="text-muted">No hay proyectos.</p>}
          </div>
        )}
      </div>
    </>
  );
}

export default ClienteProyectos;
