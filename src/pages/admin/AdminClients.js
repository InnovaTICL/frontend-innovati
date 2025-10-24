import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/theme.css";
import "../../styles/admin-clients.css";

function AdminClients() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", tax_id: "", phone: "" });
  const [q, setQ] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true); setErr("");
    try {
      const token = adminGetToken();
      const data = await apiFetch("/api/admin/clients", { token });
      setRows(data || []);
    } catch (e) {
      setErr(e.message || "No pudimos cargar clientes");
    } finally {
      setLoading(false);
    }
  }

  async function create(e) {
    e.preventDefault(); setErr(""); setOk("");
    if (!form.name.trim()) { setErr("El nombre es obligatorio"); return; }
    setSaving(true);
    try {
      const token = adminGetToken();
      await apiFetch("/api/admin/clients", { method: "POST", token, body: form });
      setForm({ name: "", email: "", tax_id: "", phone: "" });
      setOk("Cliente creado correctamente");
      setShowModal(false);
      load();
      setTimeout(() => setOk(""), 2200);
    } catch (e) {
      setErr(e.message || "No pudimos crear el cliente");
    } finally {
      setSaving(false);
    }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows || []).filter(r =>
      !s ||
      (r.name || "").toLowerCase().includes(s) ||
      (r.email || "").toLowerCase().includes(s) ||
      (r.tax_id || "").toLowerCase().includes(s)
    );
  }, [rows, q]);

  return (
    <>
      <AdminNavbar />

      <div className="container py-4 admin-clients">
        {/* Toolbar compacta tipo SaaS */}
        <div className="toolbar toolbar-compact shadow-sm mb-3">
          <h4 className="mb-0 fw-semibold">Clientes</h4>

          <div className="search-wrap flex-grow-1">
            <span className="search-icon">🔎</span>
            <input
              className="form-control search-input w-100"
              placeholder="Buscar por nombre, email o RUT…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button
                className="btn btn-clear"
                type="button"
                onClick={() => setQ("")}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>

          <div className="actions">
            <button
              className="btn btn-gradient"
              onClick={() => setShowModal(true)}
            >
              + Nuevo Cliente
            </button>
          </div>
        </div>

        {err && <div className="alert alert-danger mb-3" role="alert">{err}</div>}
        {ok && <div className="alert alert-success-soft mb-3" role="status">{ok}</div>}

        {/* Tabla */}
        <div className="card table-card shadow-sm">
          <div className="card-body p-0 table-wrap">
            <table className="table table-hover align-middle mb-0 table-list">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 72 }}>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>RUT</th>
                  <th>Teléfono</th>
                  <th style={{ width: 110 }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="py-5 text-center text-muted">Cargando…</td></tr>
                ) : filtered.length ? (
                  filtered.map((r) => (
                    <tr key={r.id}>
                      <td className="text-muted">{r.id}</td>
                      <td className="fw-medium">{r.name}</td>
                      <td>{r.email || "—"}</td>
                      <td>{r.tax_id || "—"}</td>
                      <td>{r.phone || "—"}</td>
                      <td>
                        <span className={`badge badge-soft ${r.is_active ? "ok" : "muted"}`}>
                          {r.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-5">
                      <div className="empty-state text-center">
                        <div className="empty-icon">👥</div>
                        <h6 className="mb-1">Sin resultados</h6>
                        <p className="text-muted mb-0">Intenta con otro término o crea un nuevo cliente.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal nuevo cliente */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="mb-0">Nuevo cliente</h5>
              <button className="btn-close" onClick={() => setShowModal(false)} aria-label="Cerrar">×</button>
            </div>
            <form onSubmit={create} className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label">RUT / Tax ID</label>
                  <input
                    className="form-control"
                    value={form.tax_id}
                    onChange={(e) => setForm({ ...form, tax_id: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <button className="btn btn-gradient w-100" disabled={saving} type="submit">
                {saving ? "Guardando…" : "Crear cliente"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminClients;
