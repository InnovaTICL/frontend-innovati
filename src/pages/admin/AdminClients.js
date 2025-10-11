import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/theme.css";

function AdminClients() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", email: "", tax_id: "", phone: "" });
  const [q, setQ] = useState("");

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const token = adminGetToken();
      const data = await apiFetch("/api/admin/clients", { token });
      setRows(data || []);
    } catch (e) { setErr(e.message); }
  }
  async function create(e) {
    e.preventDefault(); setErr("");
    try {
      const token = adminGetToken();
      await apiFetch("/api/admin/clients", { method: "POST", token, body: form });
      setForm({ name: "", email: "", tax_id: "", phone: "" });
      load();
    } catch (e) { setErr(e.message); }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows || []).filter(r =>
      !s || (r.name||"").toLowerCase().includes(s) || (r.email||"").toLowerCase().includes(s) || (r.tax_id||"").toLowerCase().includes(s)
    );
  }, [rows, q]);

  return (
    <>
      <AdminNavbar />
      <div className="container py-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h4 className="mb-0">Clientes</h4>
          <input className="form-control" style={{maxWidth: 320}} placeholder="Buscar por nombre, email o RUT…"
                 value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
        {err && <div className="alert alert-danger">{err}</div>}

        <div className="row g-3">
          <div className="col-lg-7">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr><th>ID</th><th>Nombre</th><th>Email</th><th>RUT</th><th>Teléfono</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td className="text-muted">{r.id}</td>
                      <td className="fw-medium">{r.name}</td>
                      <td>{r.email || "—"}</td>
                      <td>{r.tax_id || "—"}</td>
                      <td>{r.phone || "—"}</td>
                      <td>
                        <span className={`badge ${r.is_active ? "bg-success-soft" : "bg-secondary-soft"}`}>
                          {r.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan="6" className="text-center text-muted py-4">Sin resultados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm">
              <div className="card-header bg-white fw-semibold">Nuevo cliente</div>
              <div className="card-body">
                <form onSubmit={create} className="row g-2">
                  <div className="col-12">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" value={form.name}
                           onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input className="form-control" value={form.email}
                           onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">RUT / Tax ID</label>
                    <input className="form-control" value={form.tax_id}
                           onChange={e => setForm({ ...form, tax_id: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input className="form-control" value={form.phone}
                           onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <button className="btn btn-dark w-100">Crear</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
export default AdminClients;
