// ─────────────────────────────────────────────────────────
// config.js — configuración global del frontend
// ─────────────────────────────────────────────────────────

const CONFIG = {
  // En producción Nginx redirige /api/* al backend automáticamente.
  // No se necesita URL absoluta — la ruta relativa funciona en cualquier servidor.
  API_BASE: "/api",

  // Clave para guardar tokens en sessionStorage
  // (se limpian al cerrar el navegador)
  TOKEN_KEY:   "slim_access_token",
  REFRESH_KEY: "slim_refresh_token",
};

Object.freeze(CONFIG);