import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ClienteNavbar from "../../components/ClienteNavbar";
import { apiFetch } from "../../config/api";
import { getToken } from "../../config/auth";
import { fFechaHora } from "../../utils/fecha";

function ClienteTicketDetalle() {
  const { id } = useParams();
  const [t, setT] = useState(null);
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Carga inicial sin depender de 'load'
  useEffect(() => {
    async function fetchTicket() {
      try {
        const token = getToken();
        const data = await apiFetch(`/api/tickets/${id}`, { token });
        setT(data.ticket);
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
      const token = getToken();
      const data = await apiFetch(`/api/tickets/${id}`, { token });
      setT(data.ticket);
      setComments(data.comments || []);
    } catch (e) {
      setErr(e.message || "Error recargando ticket");
    }
  }

  async function sendComment(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    try {
      const token = getToken();
      await apiFetch(`/api/tickets/${id}/comments`, {
        method: "POST",
        token,
        body: { message: msg.trim() },
      });
      setMsg("");
      refresh(); // recargar hilo
    } catch (e) {
      setErr(e.message || "No se pudo enviar el comentario");
    }
  }

  return (
    <>
      <ClienteNavbar />
      <div className="container py-3" style={{maxWidth: 900}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Detalle de Ticket</h4>
          <div className="text-muted small">
            <Link to="/cliente/proyectos">← Volver a proyectos</Link>
          </div>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}
        {!t ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="row g-3">
            <div className="col-12">
              <div className="card card-elevated">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="mb-1">{t.title}</h5>
                      <div className="small text-muted">
                        Ticket #{t.id} · Proyecto {t.project_code} · {fFechaHora(t.created_at)}
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-light text-muted me-2">{t.status}</span>
                      <span className={`badge ${/Alta/i.test(t.severity) ? "bg-danger-soft" : /Media/i.test(t.severity) ? "bg-warning-soft" : "bg-info-soft"}`}>
                        {t.severity}
                      </span>
                    </div>
                  </div>
                  {t.description && <p className="mt-3 mb-0">{t.description}</p>}
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-header fw-medium">Comentarios</div>
                <div className="card-body">
                  {comments.length === 0 && <div className="text-muted">Aún no hay comentarios.</div>}
                  <ul className="list-unstyled mb-3">
                    {comments.map(c => (
                      <li key={c.id} className="mb-3">
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <div className="small text-muted">
                              <strong>{c.author_name}</strong> · {fFechaHora(c.created_at)}
                            </div>
                            <div>{c.message}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <form onSubmit={sendComment}>
                    <div className="mb-2">
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Escriba su comentario…"
                        value={msg}
                        onChange={(e)=>setMsg(e.target.value)}
                      />
                    </div>
                    <button className="btn btn-gradient" disabled={!msg.trim()}>Enviar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ClienteTicketDetalle;
