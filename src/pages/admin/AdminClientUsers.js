import React, { useEffect, useState } from "react";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/theme.css";

function AdminClientUsers() {
  const [rows, setRows] = useState([]);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ client_id: "", full_name: "", email: "", password: "", role: "client" });
  const [err, setErr] = useState("");

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const token = adminGetToken();
      const [u, c] = await Promise.all([
        apiFetch("/api/admin/client-users", { token }),
        apiFetch("/api/admin/clients", { token }),
      ]);
      setRows(u || []); setClients(c || []);
    } catch (e) { setErr(e.message); }
  }
  async function create(e) {
    e.preventDefault(); setErr("");
    try {
      const token = adminGetToken();
      await apiFetch("/api/admin/client-users", { method: "POST", token, body: form });
      setForm({ client_id: "", full_name: "", email: "", password: "", role: "client" });
      load();
    } catch (e) { setErr(e.message); }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container py-3">
        <h4 className="mb-3">Usuarios de Cliente</h4>
        {err && <div className="alert alert-danger">{err}</div>}
        <div className="row g-3">
          <div className="col-md-8">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr><th>ID</th><th>Cliente</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Activo</th></tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id}>
                      <td className="text-muted">{r.id}</td>
                      <td className="small">{r.client_name}</td>
                      <td className="fw-medium">{r.full_name}</td>
                      <td>{r.email}</td>
                      <td><span className="badge bg-info-soft">{r.role}</span></td>
                      <td>{r.is_active ? "Sí" : "No"}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">Sin usuarios</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white fw-semibold">Nuevo usuario</div>
              <div className="card-body">
                <form onSubmit={create} className="row g-2">
                  <div className="col-12">
                    <label className="form-label">Cliente</label>
                    <select className="form-select" value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} required>
                      <option value="">Selecciona…</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Nombre</label>
                    <input className="form-control" value={form.full_name}
                           onChange={e => setForm({ ...form, full_name: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email</label>
                    <input className="form-control" value={form.email}
                           onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Contraseña</label>
                    <input className="form-control" type="password" value={form.password}
                           onChange={e => setForm({ ...form, password: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Rol</label>
                    <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                      <option value="client">client</option>
                      <option value="client_admin">client_admin</option>
                    </select>
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

export default AdminClientUsers;
