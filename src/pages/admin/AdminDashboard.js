import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";
import "../../styles/theme.css";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [counts, setCounts] = useState({
    clients: 0, clientUsers: 0, projects: 0, tickets: 0, ticketsOpen: 0
  });

  async function load() {
    try {
      setLoading(true);
      const token = adminGetToken();
      const [clients, users, projects, tickets] = await Promise.all([
        apiFetch("/api/admin/clients", { token }),
        apiFetch("/api/admin/client-users", { token }),
        apiFetch("/api/admin/projects", { token }),
        apiFetch("/api/admin/tickets", { token }),
      ]);
      setCounts({
        clients: clients.length,
        clientUsers: users.length,
        projects: projects.length,
        tickets: tickets.length,
        ticketsOpen: tickets.filter(t => /abierto|progreso/i.test(t.status||"")).length,
      });
    } catch (e) { setErr(e.message || "Error cargando datos"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  return (
    <>
      <AdminNavbar />
      <div className="container py-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Dashboard</h3>
          <button className="btn btn-light btn-sm" onClick={load} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        <div className="row g-3">
          <div className="col-12 col-sm-6 col-lg-3"><div className="kpi-card"><div className="kpi-title">Clientes</div><div className="kpi-value">{counts.clients}</div></div></div>
          <div className="col-12 col-sm-6 col-lg-3"><div className="kpi-card"><div className="kpi-title">Usuarios cliente</div><div className="kpi-value">{counts.clientUsers}</div></div></div>
          <div className="col-12 col-sm-6 col-lg-3"><div className="kpi-card"><div className="kpi-title">Proyectos</div><div className="kpi-value">{counts.projects}</div></div></div>
          <div className="col-12 col-sm-6 col-lg-3"><div className="kpi-card"><div className="kpi-title">Tickets abiertos</div><div className="kpi-value">{counts.ticketsOpen}</div></div></div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body d-flex flex-wrap gap-2">
            <a href="/admin/clients" className="btn btn-dark">Gestionar Clientes</a>
            <a href="/admin/client-users" className="btn btn-outline-dark">Usuarios Cliente</a>
            <a href="/admin/projects" className="btn btn-outline-dark">Proyectos</a>
            <a href="/admin/tickets" className="btn btn-outline-dark">Tickets</a>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminDashboard;
