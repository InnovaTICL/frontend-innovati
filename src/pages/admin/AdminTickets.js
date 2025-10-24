import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/theme.css";
import "../../styles/admin-tickets.css"; // 👈 estilos específicos

function AdminTickets() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("todos");
  const [sev, setSev] = useState("todas");

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const token = adminGetToken();
      const data = await apiFetch("/api/admin/tickets", { token });
      setRows(data || []);
    } catch (e) { setErr(e.message || "No pudimos cargar los tickets"); }
  }

  async function updateStatus(id, next) {
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/tickets/${id}`, { method: "PUT", token, body: { status: next } });
      load();
    } catch (e) { setErr(e.message || "No pudimos actualizar el ticket"); }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows || []).filter(t => {
      const okSt  = status === "todos" ? true : (t.status || "") === status;
      const okSev = sev === "todas"   ? true : (t.severity || "") === sev;
      const hay = `${t.title} ${t.client_name} ${t.project_code}`.toLowerCase();
      return okSt && okSev && (s ? hay.includes(s) : true);
    });
  }, [rows, q, status, sev]);

  const sevBadge = (sev) => {
    const s = (sev || "").toLowerCase();
    if (s.includes("alta"))  return "sev sev-high";
    if (s.includes("media")) return "sev sev-mid";
    return "sev sev-low";
  };

  const stBadge = (st) => {
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

      <div className="container py-4 admin-tickets">
        {/* Toolbar */}
        <div className="toolbar toolbar-compact shadow-sm mb-3">
          <h4 className="mb-0 fw-semibold">Tickets</h4>

          <div className="search-wrap flex-grow-1">
            <span className="search-icon">🔎</span>
            <input
              className="form-control search-input w-100"
              placeholder="Buscar por título, cliente o proyecto…"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
            />
            {q && (
              <button className="btn btn-clear" type="button" onClick={()=>setQ("")} aria-label="Limpiar">×</button>
            )}
          </div>

          <select
            className="form-select filter"
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            title="Filtrar por estado"
          >
            <option value="todos">Todos</option>
            <option value="Abierto">Abierto</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Resuelto">Resuelto</option>
            <option value="Cerrado">Cerrado</option>
          </select>

          <select
            className="form-select filter"
            value={sev}
            onChange={(e)=>setSev(e.target.value)}
            title="Filtrar por severidad"
          >
            <option value="todas">Severidad</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        {/* Tabla */}
        <div className="card table-card shadow-sm">
          <div className="card-body p-0 table-wrap">
            <table className="table table-hover align-middle mb-0 table-list">
              <thead className="table-light">
                <tr>
                  <th style={{width: 72}}>ID</th>
                  <th>Cliente</th>
                  <th>Proyecto</th>
                  <th>Título</th>
                  <th>Severidad</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? filtered.map(t => (
                  <tr key={t.id}>
                    <td className="text-muted">{t.id}</td>
                    <td className="small">{t.client_name}</td>
                    <td className="small fw-semibold">{t.project_code}</td>
                    <td className="fw-medium">
                      <Link
                        to={`/admin/tickets/${t.id}`}
                        className="ticket-title"
                        title="Ver detalle del ticket"
                      >
                        {t.title}
                      </Link>
                    </td>
                    <td><span className={sevBadge(t.severity)}>{t.severity}</span></td>
                    <td><span className={stBadge(t.status)}>{t.status}</span></td>
                    <td>
                      <div className="d-flex gap-2 justify-content-end">
                        <Link to={`/admin/tickets/${t.id}`} className="btn btn-sm btn-primary-soft">Ver</Link>
                        <div className="btn-group-actions">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => updateStatus(t.id, "En Progreso")}>Progreso</button>
                          <button className="btn btn-sm btn-outline-success"   onClick={() => updateStatus(t.id, "Resuelto")}>Resuelto</button>
                          <button className="btn btn-sm btn-outline-dark"      onClick={() => updateStatus(t.id, "Cerrado")}>Cerrado</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="py-5 text-center text-muted">Sin tickets</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminTickets;
