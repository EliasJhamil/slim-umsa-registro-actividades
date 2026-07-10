// ─────────────────────────────────────────────────────────
// auth.js — manejo de autenticación y tokens JWT
// ─────────────────────────────────────────────────────────

const Auth = (() => {
  const USER_KEY = "slim_user";

  function guardarTokens(accessToken, refreshToken) {
    sessionStorage.setItem(CONFIG.TOKEN_KEY, accessToken);
    sessionStorage.setItem(CONFIG.REFRESH_KEY, refreshToken);
  }

  function limpiarTokens() {
    sessionStorage.removeItem(CONFIG.TOKEN_KEY);
    sessionStorage.removeItem(CONFIG.REFRESH_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  function getAccessToken() {
    return sessionStorage.getItem(CONFIG.TOKEN_KEY);
  }

  function getRefreshToken() {
    return sessionStorage.getItem(CONFIG.REFRESH_KEY);
  }

  function decodificarToken(token) {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  function estaAutenticado() {
    const token = getAccessToken();
    if (!token) return false;

    const payload = decodificarToken(token);
    if (!payload) return false;

    return payload.exp * 1000 > Date.now();
  }

  function getRol() {
    const payload = decodificarToken(getAccessToken());
    return payload?.rol || null;
  }

  function getUsuarioId() {
    const payload = decodificarToken(getAccessToken());
    return payload?.sub ? parseInt(payload.sub, 10) : null;
  }

  function guardarUsuario(info) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(info));
  }

  function getUser() {
    const token = getAccessToken();
    if (!token) return null;

    const payload = decodificarToken(token);
    if (!payload) return null;

    const stored = sessionStorage.getItem(USER_KEY);
    const userData = stored ? JSON.parse(stored) : {};

    return {
      id: payload.sub ? parseInt(payload.sub, 10) : null,
      rol: payload.rol || null,
      nombre: userData.nombre || "Usuario",
      ...userData,
    };
  }

  async function login(ci, password) {
    const res = await fetch(`${CONFIG.API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ci, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Error al iniciar sesión");
    }

    const data = await res.json();
    guardarTokens(data.access_token, data.refresh_token);

    const payload = decodificarToken(data.access_token);
    guardarUsuario({
      id: payload?.sub ? parseInt(payload.sub, 10) : null,
      rol: payload?.rol || data.rol || null,
      nombre: data.nombre || "Usuario",
    });

    return data;
  }

  async function refrescarToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const res = await fetch(`${CONFIG.API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      limpiarTokens();
      return null;
    }

    const data = await res.json();
    guardarTokens(data.access_token, data.refresh_token);
    return data.access_token;
  }

  async function logout() {
    try {
      await fetch(`${CONFIG.API_BASE}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
    } catch {
      // Ignorar errores de red al cerrar sesión
    } finally {
      limpiarTokens();
      Router.navigate("/");
    }
  }

  function requiereAuth() {
    if (!estaAutenticado()) {
      limpiarTokens();
      Router.navigate("/");
      return false;
    }
    return true;
  }

  function requiereAdmin() {
    if (!requiereAuth()) return false;
    if (getRol() !== "ADMIN") {
      Router.navigate("/estudiante/dashboard");
      return false;
    }
    return true;
  }

  return {
    login,
    logout,
    refresh: refrescarToken,
    getAccessToken,
    getToken: getAccessToken,
    getRefreshToken,
    estaAutenticado,
    getRol,
    getUsuarioId,
    getUser,
    requiereAuth,
    requiereAdmin,
    clear: limpiarTokens,
    limpiarTokens,
  };
})();
