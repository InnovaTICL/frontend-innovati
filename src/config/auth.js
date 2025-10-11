import React from "react";
import { Navigate } from "react-router-dom";

const TOKEN_KEY = "token";
const USER_KEY = "cliente";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setSession({ access_token, user }) {
  localStorage.setItem(TOKEN_KEY, access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
}
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "{}"); }
  catch { return {}; }
}
export function isAuthed() {
  return !!getToken();
}

export function PrivateRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/cliente/login" replace />;
}
