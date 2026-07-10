// ─────────────────────────────────────────────────────────
// router.js — hash router SPA con soporte para rutas dinámicas
// ─────────────────────────────────────────────────────────

const Router = (() => {
  const rutas = {};

  function normalizar(hash) {
    let ruta = (hash || window.location.hash || "/").replace(/^#/, "");
    if (!ruta) ruta = "/";
    if (!ruta.startsWith("/")) ruta = `/${ruta}`;
    return ruta;
  }

  function register(path, fn) {
    rutas[normalizar(path)] = fn;
  }

  function match(ruta) {
    if (rutas[ruta]) return { fn: rutas[ruta], params: {} };

    const partesRuta = ruta.split("/").filter(Boolean);
    for (const [patron, fn] of Object.entries(rutas)) {
      const partesPatron = patron.split("/").filter(Boolean);
      if (partesPatron.length !== partesRuta.length) continue;

      const params = {};
      let ok = true;
      for (let i = 0; i < partesPatron.length; i++) {
        if (partesPatron[i].startsWith(":")) {
          params[partesPatron[i].slice(1)] = decodeURIComponent(partesRuta[i]);
        } else if (partesPatron[i] !== partesRuta[i]) {
          ok = false;
          break;
        }
      }
      if (ok) return { fn, params };
    }

    return null;
  }

  function resolver() {
    const ruta = normalizar();
    const encontrada = match(ruta);
    if (encontrada) {
      encontrada.fn(encontrada.params);
    } else {
      navigate("/");
    }
  }

  function navigate(path) {
    const ruta = normalizar(path);
    if (window.location.hash === `#${ruta}`) {
      resolver();
    } else {
      window.location.hash = ruta;
    }
  }

  function start() {
    window.addEventListener("hashchange", resolver);
    resolver();
  }

  return { register, navigate, start, init: start };
})();
