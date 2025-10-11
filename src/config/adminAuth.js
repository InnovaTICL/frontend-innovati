import React from "react";
import { Navigate } from "react-router-dom";

const ADMIN_TOKEN = "admin_token";
const ADMIN_USER = "admin_user";

export const adminGetToken = () => localStorage.getItem(ADMIN_TOKEN);
export const adminGetUser = () => {
  try { return JSON.parse(localStorage.getItem(ADMIN_USER) || "{}"); } catch { return {}; }
};
export const adminSetSession = ({ access_token, user }) => {
  localStorage.setItem(ADMIN_TOKEN, access_token);
  localStorage.setItem(ADMIN_USER, JSON.stringify(user || {}));
};
export const adminClear = () => {
  localStorage.removeItem(ADMIN_TOKEN);
  localStorage.removeItem(ADMIN_USER);
};

export function AdminPrivate({ children }) {
  return adminGetToken() ? children : <Navigate to="/admin/login" replace />;
}
