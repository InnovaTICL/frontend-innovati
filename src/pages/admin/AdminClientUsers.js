import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/theme.css";
import "../../styles/admin-client-users.css"; // hoja específica

function AdminClientUsers() {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [q, setQ] = useState("");

  const [form, setForm] = useState({
    client_id: "",
    full_name: "",
    email: "",
    password: "",
    role: "client",
  });

  // 🔹 Cargar clientes al montar
  useEffect(() => {
    (async () => {
      try {
        const token = adminGetToken();
        const list = await apiFetch("/api/admin/clients", { token });
        setClients(list || []);
        if ((list || []).length && !selectedClientId) {
          setSelectedClientId(String(list[0].id));
        }
      } catch (e) {
        setErr(e.message || "No pudimos cargar clientes");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Cargar usuarios cuando cambia el cliente seleccionado
  useEffect(() => {
    if (!selectedClientId) { setRows([]); return; }
    loadUsers(selectedClientId);
  }, [selectedClientId]);

  async function loadUsers(clientId) {
    setLoading(true); setErr("");
    try {
      const token = adminGetToken();
      const data = await apiFetch(`/api/admin/client-users?client_id=${clientId}`, { token });
      setRows(data || []);
    } catch (e) {
      setErr(e.message || "No pudimos cargar usuarios");
    } finally {
      setLoading(false);
    }
  }

  async function create(e) {
    e.preventDefault(); setErr(""); setOk("");
    const payload = {
      ...form,
      client_id: form.client_id || selectedClientId,
    };
    if (!payload.client_id || !payload.full_name || !payload.email || !payload.password) {
      setErr("Completa cliente, nombre, email y contraseña.");
      return;
    }
    setSaving(true);
    try {
      const token = adminGetToken();
      await apiFetch("/api/admin/client-users", { method: "POST", token, body: payload });
      setShowModal(false);
      setForm({ client_id: "", full_name: "", email: "", password: "", role: "client" });
      setOk("Usuario creado correctamente");
      await loadUsers(payload.client_id);
      setTimeout(() => setOk(""), 2200);
    } catch (e) {
      setErr(e.message || "No pudimos crear el usuario");
    } finally {
      setSaving(false);
    }
  }

  // 🔹 Filtrar dentro del cliente seleccionado
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return (rows || []).filter(r =>
      (r.full_name || "").toLowerCase().includes(s) ||
      (r.email || "").toLowerCase().includes(s) ||
      (r.role || "").toLowerCase().includes(s)
    );
  }, [rows, q]);

  const clientName = useMemo(() => {
    const c = clients.find(x => String(x.id) === String(selectedClientId));
    return c?.name || "Selecciona un cliente";
  }, [clients, selectedClientId]);

  return (
    <>
      <AdminNavbar />

      <div className="container py-4 admin-client-users">
        {/* Toolbar maestro → detalle */}
        <div className="toolbar toolbar-compact shadow-sm mb-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <h4 className="mb-0 fw-semibold">Usuarios de Cliente</h4>

            <div className="client-select-wrap">
              <select
                className="form-select client-select"
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  setQ("");
                }}
              >
                {clients.length === 0 && <option value="">Cargando clientes…</option>}
                {clients.length > 0 && <option value="">Selecciona un cliente…</option>}
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="search-wrap flex-grow-1">
            <span className="search-icon">🔎</span>
            <input
              className="form-control search-input w-100"
              placeholder={`Buscar en: ${clientName}`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              disabled={!selectedClientId}
            />
            {q && (
              <button className="btn btn-clear" type="button" onClick={() => setQ("")} aria-label="Limpiar">×</button>
            )}
          </div>

          <div className="actions">
            <button
              className="btn btn-gradient"
              onClick={() => setShowModal(true)}
              disabled={!selectedClientId}
              title={!selectedClientId ? "Selecciona un cliente" : "Nuevo usuario"}
            >
              + Nuevo Usuario
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
                  <th>Rol</th>
                  <th style={{ width: 90 }}>Activo</th>
                </tr>
              </thead>
              <tbody>
                {!selectedClientId ? (
                  <tr><td colSpan="5" className="py-5 text-center text-muted">Selecciona un cliente para ver sus usuarios.</td></tr>
                ) : loading ? (
                  <tr><td colSpan="5" className="py-5 text-center text-muted">Cargando…</td></tr>
                ) : filtered.length ? (
                  filtered.map((r) => (
                    <tr key={r.id}>
                      <td className="text-muted">{r.id}</td>
                      <td className="fw-medium">{r.full_name}</td>
                      <td>{r.email}</td>
                      <td>
                        <span className={`badge badge-role ${r.role === "client_admin" ? "admin" : "client"}`}>
                          {r.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-soft ${r.is_active ? "ok" : "muted"}`}>
                          {r.is_active ? "Sí" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-5">
                      <div className="empty-state text-center">
                        <div className="empty-icon">👤</div>
                        <h6 className="mb-1">Sin usuarios</h6>
                        <p className="text-muted mb-0">Crea un nuevo usuario para “{clientName}”.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="mb-0">Nuevo usuario · {clientName}</h5>
              <button className="btn-close" onClick={() => setShowModal(false)} aria-label="Cerrar">×</button>
            </div>

            <form className="modal-body" onSubmit={create}>
              <div className="mb-3">
                <label className="form-label">Cliente <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  value={form.client_id || selectedClientId}
                  onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                  required
                >
                  <option value="">Selecciona…</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email <span className="text-danger">*</span></label>
                <input
                  className="form-control"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Contraseña <span className="text-danger">*</span></label>
                  <input
                    className="form-control"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-select"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="client">client</option>
                    <option value="client_admin">client_admin</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-gradient w-100" disabled={saving} type="submit">
                {saving ? "Creando…" : "Crear usuario"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminClientUsers;
