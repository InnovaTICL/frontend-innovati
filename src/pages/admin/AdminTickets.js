import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/theme.css";

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
    } catch (e) { setErr(e.message); }
  }

  async function updateStatus(id, status) {
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/tickets/${id}`, { method: "PUT", token, body: { status } });
      load();
    } catch (e) { setErr(e.message); }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows || []).filter(t => {
      const okSt = status === "todos" ? true : (t.status || "") === status;
      const okSev = sev === "todas" ? true : (t.severity || "") === sev;
      const hay = `${t.title} ${t.client_name} ${t.project_code}`.toLowerCase();
      return okSt && okSev && (s ? hay.includes(s) : true);
    });
  }, [rows, q, status, sev]);

  return (
    <>
      <AdminNavbar />
      <div className="container py-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h4 className="mb-0">Tickets</h4>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              style={{maxWidth:320}}
              placeholder="Buscar por título/cliente/proyecto…"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
            />
            <select
              className="form-select"
              value={status}
              onChange={(e)=>setStatus(e.target.value)}
              style={{maxWidth:160}}
            >
              <option value="todos">Todos</option>
              <option value="Abierto">Abierto</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Resuelto">Resuelto</option>
              <option value="Cerrado">Cerrado</option>
            </select>
            <select
              className="form-select"
              value={sev}
              onChange={(e)=>setSev(e.target.value)}
              style={{maxWidth:160}}
            >
              <option value="todas">Severidad</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Proyecto</th>
                <th>Título</th>
                <th>Severidad</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td className="text-muted">{t.id}</td>
                  <td>{t.client_name}</td>
                  <td className="small">{t.project_code}</td>
                  <td className="fw-medium">
                    <Link
                      to={`/admin/tickets/${t.id}`}
                      className="link-underline link-underline-opacity-0"
                      title="Ver detalle del ticket"
                    >
                      {t.title}
                    </Link>
                  </td>
                  <td>
                    <span className={`badge ${/Alta/i.test(t.severity) ? "bg-danger-soft" : /Media/i.test(t.severity) ? "bg-warning-soft" : "bg-info-soft"}`}>
                      {t.severity}
                    </span>
                  </td>
                  <td><span className="badge badge-soft bg-light text-muted">{t.status}</span></td>
                  <td>
                    <div className="d-flex gap-2 justify-content-end">
                      <Link to={`/admin/tickets/${t.id}`} className="btn btn-sm btn-primary">
                        Ver
                      </Link>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateStatus(t.id, "En Progreso")}>Progreso</button>
                        <button className="btn btn-sm btn-outline-success" onClick={() => updateStatus(t.id, "Resuelto")}>Resuelto</button>
                        <button className="btn btn-sm btn-outline-dark" onClick={() => updateStatus(t.id, "Cerrado")}>Cerrado</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">Sin tickets</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminTickets;
