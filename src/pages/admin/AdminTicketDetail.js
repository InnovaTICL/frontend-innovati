import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";

function AdminTicketDetail() {
  const { id } = useParams();
  const [t, setT] = useState(null);
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // Carga inicial (sin dependencia de 'load' para evitar warning)
  useEffect(() => {
    async function fetchTicket() {
      try {
        const token = adminGetToken();
        const data = await apiFetch(`/api/admin/tickets/${id}`, { token });
        setT(data.ticket);
        setStatus(data.ticket?.status || "");
        setComments(data.comments || []);
        setErr("");
      } catch (e) {
        setErr(e.message || "Error cargando ticket");
      }
    }
    fetchTicket();
  }, [id]);

  async function refresh() {
    try {
      const token = adminGetToken();
      const data = await apiFetch(`/api/admin/tickets/${id}`, { token });
      setT(data.ticket);
      setStatus(data.ticket?.status || "");
      setComments(data.comments || []);
    } catch (e) {
      setErr(e.message || "Error recargando ticket");
    }
  }

  async function changeStatus(v) {
    if (!t) return;
    setSaving(true);
    setOkMsg("");
    setErr("");
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/tickets/${id}`, {
        method: "PUT",
        token,
        body: { status: v }
      });
      setStatus(v);
      setT({ ...t, status: v }); // reflejar de inmediato
      setOkMsg("Estado actualizado.");
    } catch (e) {
      setErr(e.message || "No se pudo actualizar el estado");
    } finally {
      setSaving(false);
      setTimeout(() => setOkMsg(""), 2500);
    }
  }

  async function sendComment(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/tickets/${id}/comments`, {
        method: "POST",
        token,
        body: { message: msg.trim(), is_internal: !!isInternal },
      });
      setMsg("");
      setIsInternal(false);
      refresh(); // recargar comentarios
    } catch (e) {
      setErr(e.message || "No se pudo enviar el comentario");
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container py-3" style={{maxWidth: 1000}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Ticket #{id}</h4>
          <div className="text-muted small">
            <Link to="/admin/tickets">← Volver</Link>
          </div>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}
        {okMsg && <div className="alert alert-success py-2">{okMsg}</div>}

        {!t ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <>
            <div className="card card-elevated mb-3">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1">{t.title}</h5>
                  <div className="small text-muted">
                    Cliente: <strong>{t.client_name}</strong> · Proyecto {t.project_code} · {new Date(t.created_at).toLocaleString()}
                  </div>
                  {t.description && <p className="mt-3 mb-0">{t.description}</p>}
                </div>
                <div className="text-end">
                  <div className="mb-2">
                    <span className={`badge ${/Alta/i.test(t.severity) ? "bg-danger-soft" : /Media/i.test(t.severity) ? "bg-warning-soft" : "bg-info-soft"}`}>
                      {t.severity}
                    </span>
                  </div>
                  <select
                    className="form-select form-select-sm"
                    value={status}
                    onChange={(e)=>changeStatus(e.target.value)}
                    disabled={saving}
                    title={saving ? "Guardando…" : "Cambiar estado"}
                  >
                    <option value="Abierto">Abierto</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Resuelto">Resuelto</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header fw-medium">Comentarios</div>
              <div className="card-body">
                {comments.length === 0 && <div className="text-muted">Sin comentarios.</div>}
                <ul className="list-unstyled mb-3">
                  {comments.map(c => (
                    <li key={c.id} className="mb-3">
                      <div className="small text-muted">
                        <strong>{c.author_name}</strong> · {new Date(c.created_at).toLocaleString()}
                        {c.is_internal ? <span className="badge bg-secondary ms-2">Interno</span> : null}
                      </div>
                      <div>{c.message}</div>
                    </li>
                  ))}
                </ul>

                <form onSubmit={sendComment}>
                  <div className="mb-2">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Escriba una actualización…"
                      value={msg}
                      onChange={(e)=>setMsg(e.target.value)}
                    />
                  </div>
                  <div className="form-check mb-2">
                    <input
                      id="cint"
                      type="checkbox"
                      className="form-check-input"
                      checked={isInternal}
                      onChange={(e)=>setIsInternal(e.target.checked)}
                    />
                    <label htmlFor="cint" className="form-check-label">
                      Marcar como comentario interno (no visible al cliente)
                    </label>
                  </div>
                  <button className="btn btn-dark" disabled={!msg.trim()}>Publicar</button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AdminTicketDetail;
