import React, { useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/theme.css";
import "../../styles/admin-projects.css"; // 👈 hoja específica

// Normaliza <input type="date" />
const toISODate = (v) => {
  if (!v) return "";
  try {
    const d = new Date(v);
    if (!isNaN(d)) return d.toISOString().slice(0, 10);
  } catch (_) {}
  const s = String(v);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : s.slice(0, 10);
};

function AdminProjects() {
  const [rows, setRows] = useState([]);
  const [clients, setClients] = useState([]);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    client_id: "",
    code: "",
    name: "",
    status: "En curso",
    sla_level: "",
    pm_name: "",
    start_date: "",
    due_date: "",
    description: "",
  });

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("todos");
  const [clientFilter, setClientFilter] = useState("todos");

  const [showModal, setShowModal] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const token = adminGetToken();
      const [p, c] = await Promise.all([
        apiFetch("/api/admin/projects", { token }),
        apiFetch("/api/admin/clients", { token }),
      ]);
      setRows(p || []); setClients(c || []);
    } catch (e) { setErr(e.message || "No pudimos cargar proyectos"); }
  }

  // Autofocus cuando abre el modal
  useEffect(() => { if (showModal && codeRef.current) codeRef.current.focus(); }, [showModal]);

  // Cerrar modal con ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setShowModal(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function create(e) {
    e.preventDefault(); setErr("");
    try {
      const token = adminGetToken();
      await apiFetch("/api/admin/projects", {
        method: "POST",
        token,
        body: {
          client_id: form.client_id,
          code: form.code.trim(),
          name: form.name.trim(),
          status: form.status,
          sla_level: form.sla_level || null,
          pm_name: form.pm_name || null,
          start_date: form.start_date ? toISODate(form.start_date) : null,
          due_date: form.due_date ? toISODate(form.due_date) : null,
          description: form.description || null,
        }
      });
      setForm({
        client_id: "",
        code: "",
        name: "",
        status: "En curso",
        sla_level: "",
        pm_name: "",
        start_date: "",
        due_date: "",
        description: "",
      });
      setShowModal(false);
      load();
    } catch (e) { setErr(e.message || "No pudimos crear el proyecto"); }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows || []).filter(r => {
      const okSt = status === "todos" ? true : (r.status || "").toLowerCase().includes(status);
      const okCli = clientFilter === "todos" ? true : String(r.client_id) === String(clientFilter);
      const hay = `${r.code} ${r.name} ${r.client_name}`.toLowerCase();
      const okTxt = s ? hay.includes(s) : true;
      return okSt && okCli && okTxt;
    });
  }, [rows, q, status, clientFilter]);

  const kpi = useMemo(() => {
    const total = filtered.length;
    const enCurso = filtered.filter(r => /curso|progress/i.test(r.status || "")).length;
    const cerrados = filtered.filter(r => /cerrado|done/i.test(r.status || "")).length;
    const espera = filtered.filter(r => /espera|hold|pausa/i.test(r.status || "")).length;
    const avg = Math.round(filtered.reduce((a, r) => a + (r.progress || 0), 0) / (total || 1));
    return { total, enCurso, cerrados, espera, avg };
  }, [filtered]);

  const statusBadge = (st) => {
    const s = (st || "").toLowerCase();
    if (s.includes("curso"))   return "badge-st ok";
    if (s.includes("cerr"))    return "badge-st done";
    if (s.includes("esper"))   return "badge-st hold";
    return "badge-st muted";
  };

  return (
    <>
      <AdminNavbar />

      <div className="container py-3 admin-projects">
        {/* Toolbar compacta */}
        <div className="toolbar toolbar-compact shadow-sm mb-3">
          <h4 className="mb-0 fw-semibold">Proyectos</h4>

          <div className="search-wrap flex-grow-1">
            <span className="search-icon">🔎</span>
            <input
              className="form-control search-input w-100"
              placeholder="Buscar por código, nombre o cliente…"
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
            <option value="curso">En curso</option>
            <option value="espera">En espera</option>
            <option value="cerrado">Cerrado</option>
          </select>

          <select
            className="form-select filter"
            value={clientFilter}
            onChange={(e)=>setClientFilter(e.target.value)}
            title="Filtrar por cliente"
          >
            <option value="todos">Todos los clientes</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button className="btn btn-gradient btn-new" onClick={() => setShowModal(true)}>
            <span className="ico">＋</span> Nuevo proyecto
          </button>

        </div>

        {/* KPIs */}
        <div className="row g-3 mb-3">
          <div className="col-6 col-md-3 col-lg-2"><div className="kpi-card"><div className="kpi-title">Total</div><div className="kpi-value">{kpi.total}</div></div></div>
          <div className="col-6 col-md-3 col-lg-2"><div className="kpi-card"><div className="kpi-title">En curso</div><div className="kpi-value">{kpi.enCurso}</div></div></div>
          <div className="col-6 col-md-3 col-lg-2"><div className="kpi-card"><div className="kpi-title">En espera</div><div className="kpi-value">{kpi.espera}</div></div></div>
          <div className="col-6 col-md-3 col-lg-2"><div className="kpi-card"><div className="kpi-title">Cerrados</div><div className="kpi-value">{kpi.cerrados}</div></div></div>
          <div className="col-12 col-lg-4"><div className="kpi-card"><div className="kpi-title">Avance prom.</div><div className="kpi-value">{kpi.avg}%</div></div></div>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        {/* Tabla */}
        <div className="card table-card shadow-sm">
          <div className="card-body p-0 table-wrap">
            <table className="table table-hover align-middle mb-0 table-list">
              <thead className="table-light">
                <tr>
                  <th style={{width:72}}>ID</th>
                  <th>Cliente</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th style={{width:160}}>%</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? filtered.map(r => (
                  <tr key={r.id}>
                    <td className="text-muted">{r.id}</td>
                    <td className="small">{r.client_name}</td>
                    <td className="fw-semibold">{r.code}</td>
                    <td>{r.name}</td>
                    <td><span className={statusBadge(r.status)}>{r.status}</span></td>
                    <td>
                      <div className="progress brand h-8">
                        <div className="progress-bar" style={{width:`${r.progress || 0}%`}} />
                      </div>
                    </td>
                    <td className="text-end">
                      <a className="btn btn-sm btn-outline-primary" href={`/admin/projects/${r.id}`}>
                        Ver detalle
                      </a>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="py-5 text-center text-muted">
                      No hay resultados con los filtros actuales
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Nuevo proyecto */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-modal={showModal}
        style={{ background: showModal ? "rgba(0,0,0,.5)" : "transparent" }}
        onClick={(e) => { if (e.target.classList.contains("modal")) setShowModal(false); }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={create}>
              <div className="modal-header">
                <h5 className="modal-title">Nuevo proyecto</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-2">
                  <div className="col-12">
                    <label className="form-label">Cliente</label>
                    <select
                      className="form-select"
                      value={form.client_id}
                      onChange={e => setForm({ ...form, client_id: e.target.value })}
                      required
                    >
                      <option value="">Selecciona…</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="col-5">
                    <label className="form-label">Código</label>
                    <input
                      ref={codeRef}
                      className="form-control"
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-7">
                    <label className="form-label">Nombre</label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                    >
                      <option>En curso</option>
                      <option>En espera</option>
                      <option>Cerrado</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">SLA</label>
                    <input
                      className="form-control"
                      value={form.sla_level}
                      onChange={e => setForm({ ...form, sla_level: e.target.value })}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label">PM</label>
                    <input
                      className="form-control"
                      value={form.pm_name}
                      onChange={e => setForm({ ...form, pm_name: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.start_date}
                      onChange={e => setForm({ ...form, start_date: toISODate(e.target.value) })}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label">Entrega</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.due_date}
                      onChange={e => setForm({ ...form, due_date: toISODate(e.target.value) })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-dark" type="submit">Crear</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminProjects;
