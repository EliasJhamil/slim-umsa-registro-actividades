const API = (() => {

  async function request(method, path, body = null, isBlob = false) {
    const token = Auth.getAccessToken();

    const headers = {};

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const opts = {
      method,
      headers,
    };

    if (body) {
      opts.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    console.log("[API REQUEST]", method, `${CONFIG.API_BASE}${path}`, body);

    let res = await fetch(`${CONFIG.API_BASE}${path}`, opts);

    console.log("[API RESPONSE]", method, path, res.status);

    if (res.status === 401) {
      const refreshed = await Auth.refresh();

      if (refreshed) {
        headers["Authorization"] = `Bearer ${refreshed}`;

        res = await fetch(`${CONFIG.API_BASE}${path}`, {
          ...opts,
          headers,
        });

        console.log("[API RESPONSE DESPUÉS DE REFRESH]", method, path, res.status);
      } else {
        throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
      }
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[API ERROR]", method, path, res.status, err);
      throw new Error(err.detail || `Error ${res.status}`);
    }

    if (isBlob) {
      return res.blob();
    }

    if (res.status === 204) {
      return null;
    }

    return res.json();
  }

  const prevenciones = {
    listar: (periodo) =>
      request("GET", `/prevenciones?periodo=${encodeURIComponent(periodo || "")}`),

    crear: (data) =>
      request("POST", "/prevenciones", data),

    actualizar: (id, data) =>
      request("PUT", `/prevenciones/${id}`, data),

    eliminar: (id) =>
      request("DELETE", `/prevenciones/${id}`),
  };

  const atenciones = {
    listar: (periodo) =>
      request("GET", `/atenciones?periodo=${encodeURIComponent(periodo || "")}`),

    crear: (data) =>
      request("POST", "/atenciones", data),

    actualizar: (id, data) =>
      request("PUT", `/atenciones/${id}`, data),

    eliminar: (id) =>
      request("DELETE", `/atenciones/${id}`),
  };

  const informes = {
    mio: async (periodo) => {
      const lista = await request("GET", `/informes/mio?periodo=${encodeURIComponent(periodo)}`);

      if (Array.isArray(lista) && lista.length > 0) {
        return lista[0];
      }

      return request("POST", `/informes/mio?periodo=${encodeURIComponent(periodo)}`);
    },

    listar: (qs = "") =>
      request("GET", `/informes${qs}`),

    enviar: (id) =>
      request("POST", `/informes/${id}/enviar`),

    aprobar: (id, body) =>
      request("POST", `/informes/${id}/aprobar`, body),

    exportar: (usuario_id, periodo) =>
      request("GET", `/informes/${usuario_id}/export?periodo=${encodeURIComponent(periodo)}`, null, true),
  };

  const stats = {
    panel: (periodo, municipioId = "") => {
      const qs = municipioId
        ? `&municipio_id=${encodeURIComponent(municipioId)}`
        : "";

      return request(
        "GET",
        `/stats/panel?periodo=${encodeURIComponent(periodo || "")}${qs}`
      );
    },

    resumen: (periodo, qs = "") =>
      request("GET", `/stats/resumen?periodo=${encodeURIComponent(periodo || "")}${qs}`),

    violencia: (periodo) =>
      request("GET", `/stats/violencia?periodo=${encodeURIComponent(periodo || "")}`),

    prevencionMunicipio: (periodo) =>
      request("GET", `/stats/prevencion-municipio?periodo=${encodeURIComponent(periodo || "")}`),
  };

  const usuarios = {
    listar: () =>
      request("GET", "/usuarios"),

    crear: (data) =>
      request("POST", "/usuarios", data),

    actualizar: (id, data) =>
      request("PUT", `/usuarios/${id}`, data),

    desactivar: (id) =>
      request("DELETE", `/usuarios/${id}`),

    companeros: () =>
      request("GET", "/usuarios/companeros"),

    crearInvitacion: (data) =>
      request("POST", "/usuarios/invitaciones", data),

    listarInvitaciones: () =>
      request("GET", "/usuarios/invitaciones"),

    recuperarPassword: (data) =>
      request("POST", "/usuarios/recuperar-password", data),
  };

  const territorio = {
    municipios: {
      listar: () =>
        request("GET", "/municipios"),

      crear: (data) =>
        request("POST", "/municipios", data),

      actualizar: (id, data) =>
        request("PUT", `/municipios/${id}`, data),
    },

    comunidades: {
      listar: (municipio_id) =>
        request("GET", `/comunidades?municipio_id=${encodeURIComponent(municipio_id || "")}`),

      crear: (data) =>
        request("POST", "/comunidades", data),
    },

    grupos: {
      listar: (comunidad_id) =>
        request("GET", `/grupos?comunidad_id=${encodeURIComponent(comunidad_id || "")}`),

      crear: (data) =>
        request("POST", "/grupos", data),
    },

    asignar: (grupo_id, data) =>
      request("POST", `/grupos/${grupo_id}/asignar`, data),
  };

  return {
    prevenciones,
    atenciones,
    informes,
    stats,
    usuarios,
    territorio,
  };

})();

async function descargarInforme(usuario_id, periodo) {
  try {
    UI.toast("Generando documento...", "info");

    const blob = await API.informes.exportar(usuario_id, periodo);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Informe_SLIM_${periodo}.docx`;
    document.body.appendChild(a);
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

    UI.toast("Informe descargado ✅", "success");
  } catch (e) {
    UI.toast(e.message, "error");
  }
}

/* ════════════════════════════════════════════════════════════════
   MEJORAS DE INTERFAZ TEMPORALES
   Estas mejoras se aplican sobre las vistas ya renderizadas.
   Sirven aunque el HTML venga desde app.js.
════════════════════════════════════════════════════════════════ */

window.CAT = window.CAT || {
  ACTIVIDADES_PREVENCION: [
    "Taller de prevención de violencia",
    "Charla informativa Ley 348",
    "Feria educativa comunitaria",
    "Campaña de sensibilización",
    "Capacitación sobre derechos de la mujer",
    "Actividad de prevención en unidad educativa",
    "Socialización de rutas de denuncia",
    "Prevención de violencia digital",
    "Prevención de violencia familiar",
    "Orientación comunitaria"
  ],

  ACTIVIDADES_ATENCION: [
    "Entrevista",
    "Orientación en Plataforma",
    "Visita Domiciliaria",
    "Acompañamiento",
    "Patrocinio Legal",
    "Conciliación",
    "Derivación institucional",
    "Seguimiento de caso",
    "Atención psicológica inicial",
    "Atención social inicial",
    "Orientación legal"
  ],

  TIPOS_DENUNCIA: [
    "Violencia Física",
    "Violencia Psicológica",
    "Violencia Sexual",
    "Violencia Económica",
    "Violencia Patrimonial",
    "Violencia Simbólica",
    "Violencia Mediática",
    "Violencia Digital",
    "Violencia Feminicidio",
    "Asistencia Familiar",
    "Guarda y Tenencia",
    "Divorcio",
    "Reconocimiento de Hijos",
    "Tráfico y Trata de Personas",
    "Trabajo Infantil",
    "No Corresponde"
  ]
};

function crearDatalistSiNoExiste(id, opciones) {
  if (document.getElementById(id)) return;

  const datalist = document.createElement("datalist");
  datalist.id = id;

  datalist.innerHTML = opciones
    .map(op => `<option value="${op}"></option>`)
    .join("");

  document.body.appendChild(datalist);
}

function mejorarLoginPassword() {
  const input = document.getElementById("l-pw");
  if (!input) return;

  if (document.getElementById("toggle-pw")) return;

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.gap = "8px";
  wrapper.style.alignItems = "center";

  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  input.style.flex = "1";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "toggle-pw";
  btn.className = "btn btn-ghost btn-sm";
  btn.style.whiteSpace = "nowrap";
  btn.textContent = "👁️ Ver";

  wrapper.appendChild(btn);

  btn.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "🙈 Ocultar";
    } else {
      input.type = "password";
      btn.textContent = "👁️ Ver";
    }
  });
}

function mejorarPeriodoConBoton() {
  const posiblesInputs = [...document.querySelectorAll("input")];

  const inputPeriodo = posiblesInputs.find(input => {
    const valor = input.value || "";
    return input.type === "month" || /^\d{4}-\d{2}$/.test(valor);
  });

  if (!inputPeriodo) return;
  if (document.getElementById("btn-aplicar-periodo")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "btn-aplicar-periodo";
  btn.className = "btn btn-primary btn-sm";
  btn.textContent = "Aplicar";
  btn.style.marginLeft = "8px";
  btn.style.whiteSpace = "nowrap";

  inputPeriodo.insertAdjacentElement("afterend", btn);

  btn.addEventListener("click", () => {
    const eventoEnter = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true,
    });

    inputPeriodo.dispatchEvent(eventoEnter);

    setTimeout(() => {
      const rutaActual = location.hash.replace("#", "") || "/";
      if (window.Router && typeof Router.navigate === "function") {
        Router.navigate(rutaActual);
      } else {
        location.reload();
      }
    }, 100);
  });
}

function mejorarPrevencionNombre() {
  const input = document.querySelector('input[name="nombre"]');
  if (!input) return;

  crearDatalistSiNoExiste(
    "prevencion-sugerencias",
    window.CAT.ACTIVIDADES_PREVENCION
  );

  input.setAttribute("list", "prevencion-sugerencias");
  input.setAttribute("placeholder", "Selecciona una sugerencia o escribe otra actividad");
}

function reemplazarSelectPorInputConDatalist(select, datalistId, opciones, placeholder) {
  if (!select) return;
  if (select.dataset.convertidoInput === "1") return;

  crearDatalistSiNoExiste(datalistId, opciones);

  const input = document.createElement("input");
  input.type = "text";
  input.className = select.className || "form-control";
  input.name = select.name;
  input.required = select.required;
  input.value = select.value || "";
  input.setAttribute("list", datalistId);
  input.setAttribute("placeholder", placeholder);
  input.dataset.convertidoInput = "1";

  select.replaceWith(input);
}

function mejorarAtencionActividad() {
  const select = document.querySelector('select[name="tipo_actividad"]');

  reemplazarSelectPorInputConDatalist(
    select,
    "atencion-actividad-sugerencias",
    window.CAT.ACTIVIDADES_ATENCION,
    "Selecciona una sugerencia o escribe otra actividad"
  );
}

function mejorarAtencionTipoDenuncia() {
  const select = document.querySelector('select[name="tipo_denuncia"]');

  reemplazarSelectPorInputConDatalist(
    select,
    "denuncia-sugerencias",
    window.CAT.TIPOS_DENUNCIA,
    "Selecciona una sugerencia o escribe otro tipo"
  );
}

function mejorarSeguimiento() {
  const toggleGroup = document.querySelector(".toggle-group");
  const hidden = document.getElementById("seg-val");

  if (!toggleGroup || !hidden) return;

  const botones = [...toggleGroup.querySelectorAll(".toggle-option")];

  botones.forEach(btn => {
    if (btn.dataset.listenerSeguimiento === "1") return;

    btn.dataset.listenerSeguimiento = "1";

    btn.addEventListener("click", () => {
      botones.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      hidden.value = btn.dataset.val || "0";
    });
  });
}

function aplicarMejorasUI() {
  mejorarLoginPassword();
  mejorarPeriodoConBoton();
  mejorarPrevencionNombre();
  mejorarAtencionActividad();
  mejorarAtencionTipoDenuncia();
  mejorarSeguimiento();
}

document.addEventListener("DOMContentLoaded", () => {
  aplicarMejorasUI();

  const observer = new MutationObserver(() => {
    aplicarMejorasUI();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
