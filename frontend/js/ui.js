// ─────────────────────────────────────────────────────────
// ui.js — helpers visuales reutilizables
// ─────────────────────────────────────────────────────────

const UI = (() => {
  let periodo = periodoActual();

  function viewContainer() {
    return document.getElementById("view-container") || document.getElementById("app");
  }

  function render(html) {
    const target = viewContainer();
    if (target) target.innerHTML = html;
  }

  function renderLoading(mensaje = "Cargando...") {
    render(`
      <div class="loading-container">
        <div class="spinner"></div>
        <p>${mensaje}</p>
      </div>
    `);
  }

  function error(mensaje) {
    render(`
      <div class="error-container">
        <p class="error-msg">⚠️ ${mensaje}</p>
        <button class="btn btn-ghost" onclick="history.back()">Volver</button>
      </div>
    `);
  }

  function toast(mensaje, tipo = "info", ms = 3500) {
    const cont = document.getElementById("toast-container") || document.body;
    const t = document.createElement("div");
    t.className = `toast toast-${tipo}`;
    t.textContent = mensaje;
    cont.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }

  function closeModal() {
    const overlay = document.getElementById("modal-overlay");
    const box = document.getElementById("modal-box");
    if (box) box.innerHTML = "";
    if (overlay) overlay.classList.add("hidden");
  }

  function modal({ title = "", body = "", actions = [] }) {
    const overlay = document.getElementById("modal-overlay");
    const box = document.getElementById("modal-box");
    if (!overlay || !box) {
      alert(title ? `${title}

${body.replace(/<[^>]*>/g, "")}` : body.replace(/<[^>]*>/g, ""));
      return;
    }

    box.innerHTML = `
      <div class="modal-header">
        <div class="modal-title">${title}</div>
        <button class="modal-close" id="modal-x">×</button>
      </div>
      <div class="modal-body">${body}</div>
      <div class="modal-actions">
        ${actions.map(a => `<button class="btn ${a.cls || "btn-ghost"}" id="${a.id}">${a.label}</button>`).join("")}
      </div>
    `;

    overlay.classList.remove("hidden");
    document.getElementById("modal-x")?.addEventListener("click", closeModal);
    actions.forEach(a => document.getElementById(a.id)?.addEventListener("click", a.onClick));
  }

  function confirm({ title = "Confirmar", body = "¿Seguro?", danger = false, onConfirm }) {
    modal({
      title,
      body: `<p>${body}</p>`,
      actions: [
        { id: "cancel", label: "Cancelar", cls: "btn-ghost", onClick: closeModal },
        { id: "ok", label: danger ? "Eliminar" : "Aceptar", cls: danger ? "btn-danger" : "btn-primary", onClick: async () => {
          await onConfirm?.();
          closeModal();
        } },
      ],
    });
  }

  function setTopbarTitle(title) {
    const el = document.getElementById("topbar-title");
    if (el) el.textContent = title;
  }

  function periodoActual() {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
  }

  function getPeriodo() {
    return periodo || periodoActual();
  }

  function setPeriodo(value) {
    periodo = value || periodoActual();
  }

  function renderTopbar(user) {
    const topbar = document.getElementById("topbar");
    if (!topbar) return;

    if (!user) {
      topbar.classList.add("hidden");
      return;
    }

    topbar.classList.remove("hidden");
    topbar.innerHTML = `
      <div>
        <div id="topbar-title" class="topbar-title">SLIM-UMSA</div>
        <div class="topbar-subtitle">${user.rol === "ADMIN" ? "Administrador" : "Estudiante"}</div>
      </div>
      <div class="topbar-actions">
        <div class="periodo-control">
          <button type="button" class="btn btn-ghost periodo-arrow" id="periodo-prev" title="Mes anterior">
            ←
          </button>

          <input type="month" id="periodo-global" class="form-control" value="${getPeriodo()}" />

          <button type="button" class="btn btn-ghost periodo-arrow" id="periodo-next" title="Mes siguiente">
            →
          </button>
        </div>

        <span class="text-soft">${user.nombre || "Usuario"}</span>
        <button class="btn btn-ghost btn-sm" id="logout-btn">Salir</button>
      </div>
    `;

    const inputPeriodo = document.getElementById("periodo-global");

    function navegarPeriodo() {
      Router.navigate(window.location.hash.replace(/^#/, "") || "/");
    }

    function cambiarPeriodoMes(delta) {
      if (!inputPeriodo) return;

      const valor = inputPeriodo.value || getPeriodo();
      const partes = valor.split("-");

      const anio = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10);

      if (!anio || !mes) return;

      const fecha = new Date(anio, mes - 1 + delta, 1);

      const nuevoPeriodo = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;

      inputPeriodo.value = nuevoPeriodo;
      setPeriodo(nuevoPeriodo);
      navegarPeriodo();
    }

    inputPeriodo?.addEventListener("change", e => {
      setPeriodo(e.target.value);
      navegarPeriodo();
    });

    document.getElementById("periodo-prev")?.addEventListener("click", () => {
      cambiarPeriodoMes(-1);
    });

    document.getElementById("periodo-next")?.addEventListener("click", () => {
      cambiarPeriodoMes(1);
    });

    document.getElementById("logout-btn")?.addEventListener("click", Auth.logout);
  }

  function renderSidebar(user) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    if (!user) {
      sidebar.classList.add("hidden");
      sidebar.innerHTML = "";
      return;
    }

    sidebar.classList.remove("hidden");

    const itemsEst = [
      ["/estudiante/dashboard", "🏠", "Panel"],
      ["/estudiante/prevencion/listado", "🎯", "Prevención"],
      ["/estudiante/atencion/listado", "🤝", "Atención"],
      ["/estudiante/informe", "📄", "Informe"],
    ];

    const itemsAdmin = [
      ["/admin/dashboard", "📊", "Dashboard"],
      ["/admin/usuarios", "👥", "Estudiantes"],
      ["/admin/territorio", "🗺️", "Territorio"],
      ["/admin/informes", "📋", "Informes"],
      ["/admin/estadisticas", "📈", "Estadísticas"],
    ];

    const items = user.rol === "ADMIN" ? itemsAdmin : itemsEst;

    sidebar.innerHTML = `
      <div class="sidebar-brand">
        <div class="brand-icon">S</div>
        <div><strong>SLIM-UMSA</strong><br><span>DIPGIS</span></div>
      </div>
      <div class="sidebar-user">${user.nombre || "Usuario"}</div>
      <nav class="sidebar-nav">
        ${items.map(([route, icon, label]) => `
          <button class="sidebar-link" data-route="${route}">
            <span>${icon}</span><span>${label}</span>
          </button>
        `).join("")}
      </nav>
    `;

    sidebar.querySelectorAll("[data-route]").forEach(el => {
      el.addEventListener("click", () => Router.navigate(el.dataset.route));
    });
  }

  function opciones(lista, valorKey, textoKey, seleccionado = null) {
    return lista.map(item =>
      `<option value="${item[valorKey]}" ${item[valorKey] == seleccionado ? "selected" : ""}>${item[textoKey]}</option>`
    ).join("");
  }

  function fecha(isoStr) {
    if (!isoStr) return "—";
    const d = new Date(isoStr);
    return d.toLocaleDateString("es-BO");
  }

  return {
    render,
    renderLoading,
    loading: renderLoading,
    error,
    toast,
    modal,
    closeModal,
    confirm,
    confirmar: (mensaje) => window.confirm(mensaje),
    opciones,
    fecha,
    periodoActual,
    getPeriodo,
    setPeriodo,
    renderSidebar,
    renderTopbar,
    setTopbarTitle,
  };
})();
