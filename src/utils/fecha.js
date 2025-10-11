// Formatos consistentes en español (Chile). Cambia a "es-ES" si prefieres España.
const LOCALE = "es-CL";

export function fFecha(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

export function fFechaHora(s) {
  if (!s) return "—";
  return new Date(s).toLocaleString(LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
