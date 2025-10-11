import React, { useEffect, useMemo, useState } from "react";
import ClienteNavbar from "../../components/ClienteNavbar";
import { apiFetch } from "../../config/api";
import { getToken } from "../../config/auth";
import "../../styles/theme.css";
import { fFecha } from "../../utils/fecha";

const pesos = (n) => Number(n || 0).toLocaleString();

function FacturaCard({ i }) {
  const due = i?.due_date ? new Date(i.due_date) : null;
  const days = due ? Math.ceil((due - new Date()) / (1000*60*60*24)) : null;
  const isOver = days != null && days < 0;
  const isSoon = days != null && days <= 7 && days >= 0;

  return (
    <div className={`card card-elevated invoice-card ${isOver ? "inv-over" : isSoon ? "inv-soon" : ""}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="fw-semibold">{i.number}</div>
            <div className="small meta-muted">{i.project_code || `PRJ-${i.project_id}`}</div>
          </div>
          <span className="badge badge-soft bg-light text-muted">{i.status}</span>
        </div>

        <div className="row small mt-2">
          <div className="col-6">
            <div className="text-muted-2">Emisión</div>
             <div>{fFecha(i.issue_date)}</div>
          </div>
          <div className="col-6">
            <div className="text-muted-2">Vencimiento</div>
            <div>
              {fFecha(i.due_date)}
              {days != null && (
                <span className={`ms-1 pill ${isOver ? "pill-danger" : isSoon ? "pill-warn" : ""}`}>
                  {isOver ? `Atrasada ${Math.abs(days)} d.` : `En ${days} d.`}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="h5 mb-0">{i.currency} {pesos(i.amount)}</div>
          <div className="d-flex gap-2">
            {i.pdf_url && (
              <a href={i.pdf_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary">
                Ver PDF
              </a>
            )}
            {/* reserva para pagar/descargar */}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClienteFacturas() {
  const [items, setItems] = useState([]);
  const [estado, setEstado] = useState("todas"); // todas | pendiente | pagada | vencida
  const [rango, setRango] = useState("todas");  // todas | 7 | 30 | 90
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const data = await apiFetch("/api/invoices", { token });
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || "Error cargando facturas");
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (items || []).filter(i => {
      // estado
      const st = (i.status || "").toLowerCase();
      const okSt =
        estado === "todas" ? true :
        estado === "pendiente" ? st.includes("pend") :
        estado === "pagada" ? st.includes("pag") :
        estado === "vencida" ? st.includes("venc") : true;

      // rango por fecha de emisión
      const okRg = (() => {
        if (rango === "todas") return true;
        const issued = i?.issue_date ? new Date(i.issue_date) : null;
        if (!issued) return false;
        const days = (new Date() - issued) / (1000 * 60 * 60 * 24);
        return days <= Number(rango);
      })();

      // texto
      const txt = `${i.number} ${i.project_code} ${i.currency}`.toLowerCase();
      const okQ = s ? txt.includes(s) : true;

      return okSt && okRg && okQ;
    });
  }, [items, estado, rango, q]);

  // Agrupar por estado
  const groups = useMemo(() => {
    const map = { Pendiente: [], Vencida: [], Pagada: [] };
    filtered.forEach((i) => {
      const st = (i.status || "").toLowerCase();
      if (st.includes("venc")) map.Vencida.push(i);
      else if (st.includes("pag")) map.Pagada.push(i);
      else map.Pendiente.push(i);
    });
    return map;
  }, [filtered]);

  // KPIs top
  const kpi = useMemo(() => {
    const sum = (arr) => arr.reduce((a, i) => a + Number(i.amount || 0), 0);
    return {
      totalPend: sum(groups.Pendiente),
      totalVenc: sum(groups.Vencida),
      totalPag: sum(groups.Pagada),
      cnt: filtered.length,
    };
  }, [groups, filtered]);

  return (
    <>
      <ClienteNavbar />
      <div className="container pb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="mb-0">Facturas</h3>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder="Buscar por número/proyecto…"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              style={{ maxWidth: 320 }}
            />
            <select className="form-select" value={estado} onChange={(e)=>setEstado(e.target.value)} style={{ maxWidth: 160 }}>
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="vencida">Vencidas</option>
              <option value="pagada">Pagadas</option>
            </select>
            <select className="form-select" value={rango} onChange={(e)=>setRango(e.target.value)} style={{ maxWidth: 180 }}>
              <option value="todas">Emitidas (todas)</option>
              <option value="7">Emitidas ≤ 7 días</option>
              <option value="30">Emitidas ≤ 30 días</option>
              <option value="90">Emitidas ≤ 90 días</option>
            </select>
          </div>
        </div>

        {/* KPIs */}
        <div className="row g-3 mb-3">
          <div className="col-md-3 col-sm-6"><div className="kpi-tile"><div className="kpi-label">Facturas filtradas</div><div className="kpi-value">{kpi.cnt}</div></div></div>
          <div className="col-md-3 col-sm-6"><div className="kpi-tile warn"><div className="kpi-label">Pendiente</div><div className="kpi-value">{pesos(kpi.totalPend)}</div></div></div>
          <div className="col-md-3 col-sm-6"><div className="kpi-tile danger"><div className="kpi-label">Vencida</div><div className="kpi-value">{pesos(kpi.totalVenc)}</div></div></div>
          <div className="col-md-3 col-sm-6"><div className="kpi-tile ok"><div className="kpi-label">Pagada</div><div className="kpi-value">{pesos(kpi.totalPag)}</div></div></div>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        {/* Grupos por estado (tarjetas) */}
        <div className="invoice-groups">
          {["Pendiente","Vencida","Pagada"].map((g) => (
            <div className="invoice-group" key={g}>
              <div className="invoice-group-title">{g} <span className="count">{groups[g].length}</span></div>
              {groups[g].length === 0 && <div className="empty muted">Sin facturas</div>}
              <div className="row g-3">
                {groups[g].map((i) => (
                  <div className="col-md-6 col-lg-4" key={i.id}>
                    <FacturaCard i={i} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* (Opcional) vista tabla legacy: deja tu implementación anterior detrás de un feature flag si la quieres conservar */}
      </div>
    </>
  );
}

export default ClienteFacturas;
