import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { apiFetch } from "../../config/api";
import { adminGetToken } from "../../config/adminAuth";
import AdminNavbar from "../../components/AdminNavbar";
import { Link } from "react-router-dom";

/* ============== Helpers ============== */
const toISODate = (v) => {
  if (!v) return "";
  try {
    const d = new Date(v);
    if (!isNaN(d)) return d.toISOString().slice(0, 10);
  } catch (_) {}
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return s.slice(0, 10);
};
const noneIfEmpty = (s) => (s && String(s).trim() !== "" ? s : null);

/* Badge simple */
const Pill = ({ text }) => <span className="badge text-bg-secondary">{text}</span>;

export default function AdminProjectDetail() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [pid, setPid] = useState(null);

  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Crear (estado de formularios)
  const [mNew, setMNew] = useState({ title: "", status: "Pendiente", due_date: "", notes: "" });
  const [tNew, setTNew] = useState({ title: "", assignee: "", status: "Pendiente", priority: "Media", due_date: "" });

  // Modales
  const [showHitoModal, setShowHitoModal] = useState(false);
  const [showTareaModal, setShowTareaModal] = useState(false);
  const hitoTitleRef = useRef(null);
  const tareaTitleRef = useRef(null);

  // Cabecera
  const [editTop, setEditTop] = useState({
    status: "En curso",
    progress: 0,
    sla_level: "",
    pm_name: "",
    start_date: "",
    due_date: "",
    description: "",
  });
  const [savingTop, setSavingTop] = useState(false);

  // Edición por fila
  const [mEdit, setMEdit] = useState({});
  const [tEdit, setTEdit] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const idFromUrl = Number(window.location.pathname.split("/").pop());
    setPid(idFromUrl || null);
  }, []);

  const reload = useCallback(async () => {
    if (!pid) return;
    setLoading(true);
    setErr("");
    try {
      const token = adminGetToken();
      const data = await apiFetch(`/api/admin/projects/${pid}`, { token });

      setProject(data.project || null);
      setEditTop({
        status: data.project?.status || "En curso",
        progress: Number(data.project?.progress || 0),
        sla_level: data.project?.sla_level || "",
        pm_name: data.project?.pm_name || "",
        start_date: toISODate(data.project?.start_date),
        due_date: toISODate(data.project?.due_date),
        description: data.project?.description || "",
      });

      setMilestones((data.milestones || []).map(m => ({ ...m, due_date: toISODate(m.due_date) })));
      setTasks((data.tasks || []).map(t => ({ ...t, due_date: toISODate(t.due_date) })));
      setTickets(data.tickets || []);
      setDocuments(data.documents || []);
      setMEdit({}); setTEdit({});
    } catch (e) {
      setErr(e.message || "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, [pid]);
  useEffect(() => { reload(); }, [reload]);

  // Autofocus modal + cerrar por ESC
  useEffect(() => {
    if (showHitoModal && hitoTitleRef.current) hitoTitleRef.current.focus();
  }, [showHitoModal]);
  useEffect(() => {
    if (showTareaModal && tareaTitleRef.current) tareaTitleRef.current.focus();
  }, [showTareaModal]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setShowHitoModal(false); setShowTareaModal(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ======= Guardar cabecera ======= */
  async function saveTop() {
    if (!project) return;
    setSavingTop(true); setErr("");
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/projects/${project.id}`, {
        token, method: "PUT",
        body: {
          status: editTop.status,
          progress: Number(editTop.progress || 0),
          sla_level: noneIfEmpty(editTop.sla_level),
          pm_name: noneIfEmpty(editTop.pm_name),
          start_date: noneIfEmpty(editTop.start_date),
          due_date: noneIfEmpty(editTop.due_date),
          description: noneIfEmpty(editTop.description),
        }
      });
      await reload();
    } catch (e) {
      setErr(e.message || "No fue posible guardar");
    } finally {
      setSavingTop(false);
    }
  }

  /* ======= Hitos CRUD ======= */
  function beginEditMilestone(m) {
    setMEdit(prev => ({ ...prev, [m.id]: { title: m.title || "", status: m.status || "Pendiente", due_date: m.due_date || "", notes: m.notes || "" } }));
  }
  function cancelEditMilestone(id) {
    setMEdit(prev => { const cp = { ...prev }; delete cp[id]; return cp; });
  }
  async function saveMilestone(id) {
    if (!mEdit[id] || busy) return;
    setBusy(true); setErr("");
    const payload = {
      title: mEdit[id].title,
      status: mEdit[id].status,
      notes: mEdit[id].notes,
      due_date: noneIfEmpty(toISODate(mEdit[id].due_date)),
    };
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/milestones/${id}`, { token, method: "PUT", body: payload });
      await reload();
    } catch (e) {
      setErr(e.message || "No fue posible actualizar el hito");
    } finally { setBusy(false); }
  }
  async function deleteMilestone(id) {
    if (!window.confirm("¿Eliminar hito?")) return;
    setBusy(true); setErr("");
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/milestones/${id}`, { token, method: "DELETE" });
      setMilestones(prev => prev.filter(x => x.id !== id));
      cancelEditMilestone(id);
    } catch (e) {
      setErr(e.message || "No fue posible eliminar el hito");
    } finally { setBusy(false); }
  }
  async function createMilestone(e) {
    e.preventDefault();
    if (busy) return;
    if (!mNew.title.trim()) { setErr("El título del hito es obligatorio."); return; }
    setBusy(true); setErr("");
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/projects/${project.id}/milestones`, {
        token, method: "POST",
        body: {
          title: mNew.title.trim(),
          status: mNew.status,
          notes: noneIfEmpty(mNew.notes),
          due_date: noneIfEmpty(toISODate(mNew.due_date)),
        }
      });
      setMNew({ title: "", status: "Pendiente", due_date: "", notes: "" });
      setShowHitoModal(false);
      await reload();
    } catch (e) {
      setErr(e.message || "No fue posible crear el hito");
    } finally { setBusy(false); }
  }

  /* ======= Tareas CRUD ======= */
  function beginEditTask(t) {
    setTEdit(prev => ({ ...prev, [t.id]: { title: t.title || "", assignee: t.assignee || "", status: t.status || "Pendiente", priority: t.priority || "Media", due_date: t.due_date || "" } }));
  }
  function cancelEditTask(id) {
    setTEdit(prev => { const cp = { ...prev }; delete cp[id]; return cp; });
  }
  async function saveTask(id) {
    if (!tEdit[id] || busy) return;
    setBusy(true); setErr("");
    const payload = {
      title: tEdit[id].title,
      assignee: noneIfEmpty(tEdit[id].assignee),
      status: tEdit[id].status,
      priority: tEdit[id].priority,
      due_date: noneIfEmpty(toISODate(tEdit[id].due_date)),
    };
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/tasks/${id}`, { token, method: "PUT", body: payload });
      await reload();
    } catch (e) {
      setErr(e.message || "No fue posible actualizar la tarea");
    } finally { setBusy(false); }
  }
  async function deleteTask(id) {
    if (!window.confirm("¿Eliminar tarea?")) return;
    setBusy(true); setErr("");
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/tasks/${id}`, { token, method: "DELETE" });
      setTasks(prev => prev.filter(x => x.id !== id));
      cancelEditTask(id);
    } catch (e) {
      setErr(e.message || "No fue posible eliminar la tarea");
    } finally { setBusy(false); }
  }
  async function createTask(e) {
    e.preventDefault();
    if (busy) return;
    if (!tNew.title.trim()) { setErr("El título de la tarea es obligatorio."); return; }
    setBusy(true); setErr("");
    try {
      const token = adminGetToken();
      await apiFetch(`/api/admin/projects/${project.id}/tasks`, {
        token, method: "POST",
        body: {
          title: tNew.title.trim(),
          assignee: noneIfEmpty(tNew.assignee),
          status: tNew.status,
          priority: tNew.priority,
          due_date: noneIfEmpty(toISODate(tNew.due_date)),
        }
      });
      setTNew({ title: "", assignee: "", status: "Pendiente", priority: "Media", due_date: "" });
      setShowTareaModal(false);
      await reload();
    } catch (e) {
      setErr(e.message || "No fue posible crear la tarea");
    } finally { setBusy(false); }
  }

  const statusTone = useMemo(() => {
    const s = (editTop.status || "").toLowerCase();
    if (s.includes("cerr")) return "success";
    if (s.includes("esper")) return "warning";
    return "info";
  }, [editTop.status]);

  /* ================== Render ================== */
  if (loading) return (<><AdminNavbar /><div className="container py-4">Cargando…</div></>);
  if (err) return (<><AdminNavbar /><div className="container py-4"><div className="alert alert-danger">{err}</div></div></>);
  if (!project) return (<><AdminNavbar /><div className="container py-4">No encontrado</div></>);

  return (
    <>
      <AdminNavbar />
      <div className="container py-4">

        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">{project.code} — {project.name}</h4>
          <div className="d-flex gap-2">
            <a className="btn btn-primary" href="/admin/projects">Volver</a>
          </div>
        </div>

        {/* Panel principal */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-2">
                  <div className="text-secondary mb-1">Estado</div>
                  <select className="form-select" value={editTop.status} onChange={e => setEditTop(v => ({ ...v, status: e.target.value }))}>
                    <option>En curso</option><option>En espera</option><option>Cerrado</option>
                  </select>
                </div>
                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <div className="text-secondary">Progreso</div>
                    <Pill text={`${editTop.progress}%`} tone={statusTone} />
                  </div>
                  <input type="range" min="0" max="100" className="form-range"
                    value={editTop.progress} onChange={e => setEditTop(v => ({ ...v, progress: Number(e.target.value) }))} />
                  <div className="progress brand" style={{ height: 8 }}>
                    <div className="progress-bar" style={{ width: `${editTop.progress}%` }} />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-secondary mb-1">SLA</div>
                  <input className="form-control" value={editTop.sla_level} onChange={(e) => setEditTop(v => ({ ...v, sla_level: e.target.value }))} />
                </div>
                <div className="mb-2">
                  <div className="text-secondary mb-1">PM</div>
                  <input className="form-control" value={editTop.pm_name} onChange={(e) => setEditTop(v => ({ ...v, pm_name: e.target.value }))} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-2">
                  <div className="text-secondary mb-1">Inicio</div>
                  <input type="date" className="form-control" value={editTop.start_date || ""} onChange={(e) => setEditTop(v => ({ ...v, start_date: toISODate(e.target.value) }))} />
                </div>
                <div className="mb-2">
                  <div className="text-secondary mb-1">Entrega</div>
                  <input type="date" className="form-control" value={editTop.due_date || ""} onChange={(e) => setEditTop(v => ({ ...v, due_date: toISODate(e.target.value) }))} />
                </div>
                <div className="mb-2">
                  <div className="text-secondary mb-1">Descripción</div>
                  <textarea rows={3} className="form-control" value={editTop.description} onChange={(e) => setEditTop(v => ({ ...v, description: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="text-end mt-2">
              <button className="btn btn-primary" onClick={saveTop} disabled={savingTop}>
                {savingTop ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>

        <div className="row g-3">

          {/* Hitos */}
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <div className="fw-semibold">Hitos (timeline)</div>
                <button className="btn btn-sm btn-primary" onClick={() => setShowHitoModal(true)}>Agregar hito</button>
              </div>
              <div className="card-body">
                {milestones.length === 0 && <div className="text-secondary">Sin hitos</div>}
                {milestones.map(m => {
                  const e = mEdit[m.id];
                  const editing = !!e;
                  return (
                    <div key={m.id} className="border-bottom py-2">
                      {!editing ? (
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-semibold">{m.title}</div>
                            <div className="small text-secondary">
                              {m.status} {m.due_date ? `· Vence: ${m.due_date}` : ""} {m.notes ? `· ${m.notes}` : ""}
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => beginEditMilestone(m)}>Editar</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteMilestone(m.id)} disabled={busy}>Eliminar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          <input className="form-control" value={e.title} onChange={(ev) => setMEdit(prev => ({ ...prev, [m.id]: { ...e, title: ev.target.value } }))} />
                          <div className="d-flex gap-2">
                            <select className="form-select" value={e.status} onChange={(ev) => setMEdit(prev => ({ ...prev, [m.id]: { ...e, status: ev.target.value } }))}>
                              <option>Pendiente</option><option>En progreso</option><option>Completo</option>
                            </select>
                            <input type="date" className="form-control" value={e.due_date || ""} onChange={(ev) => setMEdit(prev => ({ ...prev, [m.id]: { ...e, due_date: toISODate(ev.target.value) } }))} />
                          </div>
                          <input className="form-control" placeholder="Notas" value={e.notes || ""} onChange={(ev) => setMEdit(prev => ({ ...prev, [m.id]: { ...e, notes: ev.target.value } }))} />
                          <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-sm btn-light" onClick={() => cancelEditMilestone(m.id)}>Cancelar</button>
                            <button className="btn btn-sm btn-primary" onClick={() => saveMilestone(m.id)} disabled={busy || !e.title.trim()}>Guardar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tareas */}
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <div className="fw-semibold">Tareas</div>
                <button className="btn btn-sm btn-primary" onClick={() => setShowTareaModal(true)}>Agregar tarea</button>
              </div>
              <div className="card-body">
                {tasks.length === 0 && <div className="text-secondary">Sin tareas</div>}
                {tasks.map(t => {
                  const e = tEdit[t.id];
                  const editing = !!e;
                  return (
                    <div key={t.id} className="border-bottom py-2">
                      {!editing ? (
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-semibold">{t.title}</div>
                            <div className="small text-secondary">
                              {t.status} · {t.priority}
                              {t.assignee ? ` · ${t.assignee}` : ""}
                              {t.due_date ? ` · Vence: ${t.due_date}` : ""}
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => beginEditTask(t)}>Editar</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTask(t.id)} disabled={busy}>Eliminar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          <input className="form-control" value={e.title} onChange={(ev) => setTEdit(prev => ({ ...prev, [t.id]: { ...e, title: ev.target.value } }))} />
                          <div className="d-flex gap-2">
                            <select className="form-select" value={e.status} onChange={(ev) => setTEdit(prev => ({ ...prev, [t.id]: { ...e, status: ev.target.value } }))}>
                              <option>Pendiente</option><option>En progreso</option><option>Bloqueada</option><option>Completa</option>
                            </select>
                            <select className="form-select" value={e.priority} onChange={(ev) => setTEdit(prev => ({ ...prev, [t.id]: { ...e, priority: ev.target.value } }))}>
                              <option>Baja</option><option>Media</option><option>Alta</option>
                            </select>
                            <input className="form-control" placeholder="Asignado a" value={e.assignee || ""} onChange={(ev) => setTEdit(prev => ({ ...prev, [t.id]: { ...e, assignee: ev.target.value } }))} />
                            <input type="date" className="form-control" value={e.due_date || ""} onChange={(ev) => setTEdit(prev => ({ ...prev, [t.id]: { ...e, due_date: toISODate(ev.target.value) } }))} />
                          </div>
                          <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-sm btn-light" onClick={() => cancelEditTask(t.id)}>Cancelar</button>
                            <button className="btn btn-sm btn-primary" onClick={() => saveTask(t.id)} disabled={busy || !e.title.trim()}>Guardar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-header bg-white fw-semibold">Tickets</div>
              <div className="card-body">
                {tickets.length === 0 && <div className="text-secondary">Sin tickets</div>}
                {tickets.map((t) => (
                  <div key={t.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                      <div className="fw-semibold">#{t.id} — {t.title}</div>
                      <div className="small text-secondary">{t.status} · {t.severity}</div>
                    </div>
                    <Link className="btn btn-sm btn-outline-primary" to={`/admin/tickets/${t.id}`}>
                      Ver
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-header bg-white fw-semibold">Documentos</div>
              <div className="card-body">
                {documents.length === 0 && <div className="text-secondary">Sin documentos</div>}
                {documents.slice(0, 10).map((d) => (
                  <div key={d.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                      <div className="fw-semibold">{d.title}</div>
                      <div className="small text-secondary">
                        {d.doc_type} · {new Date(d.uploaded_at).toLocaleString()}
                      </div>
                    </div>
                    {d.storage_url && (
                      <a className="btn btn-sm btn-outline-secondary" href={d.storage_url} target="_blank" rel="noreferrer">Abrir</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ===== Modal: Nuevo Hito ===== */}
      <div
        className={`modal fade ${showHitoModal ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-modal={showHitoModal}
        style={{ background: showHitoModal ? "rgba(0,0,0,.5)" : "transparent" }}
        onClick={(e) => { if (e.target.classList.contains("modal")) setShowHitoModal(false); }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={createMilestone}>
              <div className="modal-header">
                <h5 className="modal-title">Nuevo hito</h5>
                <button type="button" className="btn-close" onClick={() => setShowHitoModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Título</label>
                  <input ref={hitoTitleRef} className="form-control" value={mNew.title} onChange={(e)=>setMNew(s=>({...s,title:e.target.value}))} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Estado</label>
                  <select className="form-select" value={mNew.status} onChange={(e)=>setMNew(s=>({...s,status:e.target.value}))}>
                    <option>Pendiente</option><option>En progreso</option><option>Completo</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Vence</label>
                  <input type="date" className="form-control" value={mNew.due_date} onChange={(e)=>setMNew(s=>({...s,due_date:toISODate(e.target.value)}))} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Notas</label>
                  <input className="form-control" value={mNew.notes} onChange={(e)=>setMNew(s=>({...s,notes:e.target.value}))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setShowHitoModal(false)}>Cancelar</button>
                <button className="btn btn-dark" disabled={!mNew.title.trim() || busy}>Agregar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ===== Modal: Nueva Tarea ===== */}
      <div
        className={`modal fade ${showTareaModal ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-modal={showTareaModal}
        style={{ background: showTareaModal ? "rgba(0,0,0,.5)" : "transparent" }}
        onClick={(e) => { if (e.target.classList.contains("modal")) setShowTareaModal(false); }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={createTask}>
              <div className="modal-header">
                <h5 className="modal-title">Nueva tarea</h5>
                <button type="button" className="btn-close" onClick={() => setShowTareaModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Título</label>
                  <input ref={tareaTitleRef} className="form-control" value={tNew.title} onChange={(e)=>setTNew(s=>({...s,title:e.target.value}))} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Asignado a</label>
                  <input className="form-control" value={tNew.assignee} onChange={(e)=>setTNew(s=>({...s,assignee:e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Estado</label>
                  <select className="form-select" value={tNew.status} onChange={(e)=>setTNew(s=>({...s,status:e.target.value}))}>
                    <option>Pendiente</option><option>En progreso</option><option>Bloqueada</option><option>Completa</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Prioridad</label>
                  <select className="form-select" value={tNew.priority} onChange={(e)=>setTNew(s=>({...s,priority:e.target.value}))}>
                    <option>Baja</option><option>Media</option><option>Alta</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Vence</label>
                  <input type="date" className="form-control" value={tNew.due_date} onChange={(e)=>setTNew(s=>({...s,due_date:toISODate(e.target.value)}))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setShowTareaModal(false)}>Cancelar</button>
                <button className="btn btn-dark" disabled={!tNew.title.trim() || busy}>Agregar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}
