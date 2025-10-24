import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../config/api";
import { adminSetSession } from "../../config/adminAuth";
import logo from "../../assets/logo.png";
import "../../styles/loginadmin.css";

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const emailErr = useMemo(() => {
    if (!email) return "";
    return /\S+@\S+\.\S+/.test(email) ? "" : "Formato de email inválido";
  }, [email]);

  const passErr = useMemo(() => {
    if (!pass) return "";
    return pass.length >= 6 ? "" : "Mínimo 6 caracteres";
  }, [pass]);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (emailErr || passErr) return;
    setLoading(true);
    try {
      const data = await apiFetch("/api/admin/auth/login", {
        method: "POST",
        body: { email, password: pass } // ← sin 'remember'
      });
      adminSetSession({ access_token: data.access_token, user: data.user });
      nav("/admin");
    } catch (ex) {
      setErr(ex?.message || "No pudimos iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  const isInvalid = !email || !pass || !!emailErr || !!passErr || loading;

  return (
    <div className="admin-auth">
      <div className="auth-card card-elevated" role="dialog" aria-labelledby="adm-title">
        {/* Brand */}
        <div className="text-center mb-3">
          <div className="logo-chip mx-auto mb-2">
            <img src={logo} width={18} height={18} alt="InnovaTI" className="logo-img" />
          </div>
          <h5 id="adm-title" className="mb-0 auth-title">Acceso Administrador</h5>
          <small className="text-muted">Panel interno de gestión</small>
        </div>

        {/* Error */}
        {err && (
          <div className="alert alert-danger py-2" role="alert" aria-live="polite">
            {err}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label htmlFor="adm-email" className="form-label">Email</label>
            <input
              id="adm-email"
              className={`form-control ${emailErr ? "is-invalid" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="adm-email-help"
              aria-invalid={!!emailErr}
              autoComplete="username"
              required
            />
            <div id="adm-email-help" className={`form-text ${email ? "opacity-100" : ""}`}>
              Usa tu correo corporativo.
            </div>
            {emailErr && <div className="invalid-feedback" role="alert">{emailErr}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="adm-pass" className="form-label">Contraseña</label>
            <div className="input-group">
              <input
                id="adm-pass"
                className={`form-control ${passErr ? "is-invalid" : ""}`}
                type={show ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                aria-describedby="adm-pass-help"
                aria-invalid={!!passErr}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {show ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div id="adm-pass-help" className="form-text">
              Puedes mostrar/ocultar mientras escribes.
            </div>
            {passErr && <div className="invalid-feedback d-block" role="alert">{passErr}</div>}
          </div>

          {/* CTA */}
          <div className="mt-4 cta-glow">
            <button className="btn btn-gradient w-100" disabled={isInvalid} type="submit">
              {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </div>

          {/* Pie suave */}
          <div className="text-center mt-3">
            <small className="text-muted">Soporte 24/7 · v2025.09</small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
