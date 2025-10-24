import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../../config/api";
import { setSession } from "../../config/auth";
import { FiEye, FiEyeOff } from "react-icons/fi"; // íconos de visibilidad
import "../../styles/login.css";
import logo from "../../assets/logo.png";

function ClienteLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setSession({ access_token: data.access_token, user: data.user });
      nav("/cliente");
    } catch (e) {
      setErr(e.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  const isInvalid = !email || !password || loading;

  return (
    <div className="login-page">
      <div className="login-bg d-flex align-items-center justify-content-center min-vh-100">
        <div className="login-card shadow-lg">
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="InnovaTI"
              className="login-logo"
              width={64}
              height={64}
            />
            <h1 className="h4 fw-semibold mt-2 mb-0">Acceso Clientes</h1>
            <p className="text-muted small mb-0">
              Portal seguro para seguimiento de proyectos y soporte
            </p>
          </div>

          {err && (
            <div
              className="alert alert-danger py-2"
              role="alert"
              aria-live="polite"
            >
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate>
            <div className="form-floating mb-3">
              <input
                id="loginEmail"
                className="form-control"
                type="email"
                placeholder="name@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-describedby="help-email"
                aria-invalid={!!err}
              />
              <label htmlFor="loginEmail">Email</label>
              <div id="help-email" className="form-text">
                Usa el correo registrado con InnovaTI.
              </div>
            </div>

            <div className="mb-3 position-relative">
              <div className="form-floating">
                <input
                  id="loginPassword"
                  className="form-control pe-5"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  aria-invalid={!!err}
                />
                <label htmlFor="loginPassword">Contraseña</label>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-secondary toggle-pass"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                title={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  id="rememberMe"
                  type="checkbox"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Recordarme
                </label>
              </div>
            </div>

            <button
              className="btn btn-gradient w-100 py-2"
              disabled={isInvalid}
              type="submit"
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
              ) : null}
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/inicio" className="btn btn-link link-light">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClienteLogin;
