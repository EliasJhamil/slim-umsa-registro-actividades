/* app.js v3 – vistas conectadas al backend */

/* ════════════════════════════════════════════════════════════════
   CATÁLOGOS / SUGERENCIAS
════════════════════════════════════════════════════════════════ */

const CAT = {
  ACTIVIDADES_PREVENCION: [
    'Taller de prevención de violencia',
    'Charla informativa Ley 348',
    'Feria educativa comunitaria',
    'Campaña de sensibilización',
    'Capacitación sobre derechos de la mujer',
    'Actividad de prevención en unidad educativa',
    'Socialización de rutas de denuncia',
    'Prevención de violencia digital',
    'Prevención de violencia familiar',
    'Orientación comunitaria'
  ],

  ACTIVIDADES_ATENCION: [
    'Entrevista',
    'Orientación en Plataforma',
    'Visita Domiciliaria',
    'Acompañamiento',
    'Patrocinio Legal',
    'Conciliación',
    'Derivación institucional',
    'Seguimiento de caso',
    'Atención psicológica inicial',
    'Atención social inicial',
    'Orientación legal'
  ],

  INSTITUCIONES: [
    'SLIM',
    'DNA',
    'UPAM',
    'UMADIS',
    'Fiscalía',
    'Policía'
  ],

  TIPOS_DENUNCIA: [
    'Violencia Física',
    'Violencia Psicológica',
    'Violencia Sexual',
    'Violencia Económica',
    'Violencia Patrimonial',
    'Violencia Simbólica',
    'Violencia Mediática',
    'Violencia Digital',
    'Violencia Feminicidio',
    'Asistencia Familiar',
    'Guarda y Tenencia',
    'Divorcio',
    'Reconocimiento de Hijos',
    'Tráfico y Trata de Personas',
    'Trabajo Infantil',
    'No Corresponde'
  ],

  TIPOS_CASO: [
    'Caso Nuevo',
    'Seguimiento',
    'Orientación en Plataforma'
  ],

  SEXOS: ['M', 'F', 'Otro'],
};

const EMPTY_STATS = {
  periodo: '',
  prevenciones: 0,
  atenciones: 0,
  poblacion_mujeres: 0,
  poblacion_hombres: 0,
  total_poblacion: 0,
  casos_nuevos: 0,
  seguimientos: 0,
  total_denunciantes: 0,
};

/* ════════════════════════════════════════════════════════════════
   HELPERS GENERALES
════════════════════════════════════════════════════════════════ */

function fallbackApi(label, fallback) {
  return (error) => {
    console.error(`[SLIM-UMSA] Error cargando ${label}:`, error);
    UI.toast(`No se pudo cargar ${label}. Se muestran datos vacíos.`, 'warning', 5000);
    return fallback;
  };
}

function periodoLabel(periodo) {
  if (!periodo || typeof periodo !== 'string') {
    return 'Periodo no definido';
  }

  const partes = periodo.split('-');
  if (partes.length !== 2) {
    return periodo;
  }

  const anio = partes[0];
  const mes = parseInt(partes[1], 10);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (Number.isNaN(mes) || mes < 1 || mes > 12) {
    return periodo;
  }

  return `${meses[mes - 1]} ${anio}`;
}
function gruposEspecialesBadges(r) {
  const grupos = [];

  if (r.poblacion_ninez) {
    grupos.push('Niñez');
  }

  if (r.poblacion_adulto_mayor) {
    grupos.push('Adulto Mayor');
  }

  if (r.poblacion_discapacidad) {
    grupos.push('Discapacidad');
  }

  if (grupos.length === 0) {
    return '<span class="text-soft">—</span>';
  }

  return grupos.map(g => `
    <span class="badge badge-blue" style="margin-right:4px;margin-bottom:4px">
      ${g}
    </span>
  `).join('');
}
function mostrarErrorVista(titulo, error) {
  console.error(`[SLIM-UMSA] ${titulo}:`, error);

  UI.render(`
    <div class="page-content animate-up">
      <div class="card">
        <div class="card-body">
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <div class="empty-state-title">${titulo}</div>
            <p class="text-soft">${error?.message || 'Ocurrió un error inesperado.'}</p>
            <button class="btn btn-primary mt-2" onclick="location.reload()">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
  `);
}

function num(valor) {
  return Number(valor) || 0;
}
function limpiarErroresFormulario() {
  document.querySelectorAll('.campo-error').forEach(el => {
    el.classList.remove('campo-error');
  });

  document.querySelectorAll('.mensaje-error-campo').forEach(el => {
    el.remove();
  });
}

function marcarCampoError(campo, mensaje = 'Este campo es obligatorio.') {
  if (!campo) return;

  campo.classList.add('campo-error');

  const msg = document.createElement('div');
  msg.className = 'mensaje-error-campo';
  msg.textContent = mensaje;
  msg.style.cssText = 'color:var(--red);font-size:12px;margin-top:4px;font-weight:600;';

  campo.insertAdjacentElement('afterend', msg);
}

function validarCamposObligatorios(campos) {
  limpiarErroresFormulario();

  const faltantes = [];

  campos.forEach(item => {
    const campo = document.querySelector(`[name="${item.name}"]`);
    const valor = campo ? String(campo.value || '').trim() : '';

    if (!valor) {
      faltantes.push({
        campo,
        label: item.label,
        mensaje: item.mensaje || 'Este campo es obligatorio.',
      });
    }
  });

  if (faltantes.length > 0) {
    faltantes.forEach(item => {
      marcarCampoError(item.campo, item.mensaje);
    });

    const nombres = faltantes.map(x => `• ${x.label}`).join('\n');

    UI.toast('Faltan campos obligatorios. Revisa el formulario.', 'warning', 5000);

    UI.modal({
      title: '⚠️ Faltan datos obligatorios',
      body: `
        <p class="text-soft mb-2">
          Para guardar el registro debes completar estos campos:
        </p>
        <pre style="white-space:pre-wrap;background:var(--grey-50);padding:12px;border-radius:12px;border:1px solid var(--grey-200);font-family:inherit">${nombres}</pre>
      `,
      actions: [
        {
          id: 'ok',
          label: 'Entendido',
          cls: 'btn-primary',
          onClick: UI.closeModal
        }
      ]
    });

    setTimeout(() => {
      faltantes[0].campo?.focus();
      faltantes[0].campo?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 150);

    return false;
  }

  return true;
}
function validarTotalMayorACero(campos, label, mensaje) {
  const total = campos.reduce((sum, name) => {
    const campo = document.querySelector(`[name="${name}"]`);
    return sum + (parseInt(campo?.value || '0') || 0);
  }, 0);

  if (total <= 0) {
    campos.forEach(name => {
      const campo = document.querySelector(`[name="${name}"]`);
      marcarCampoError(campo, mensaje);
    });

    UI.toast('Faltan datos obligatorios. Revisa el formulario.', 'warning', 5000);

    UI.modal({
      title: '⚠️ Falta un dato obligatorio',
      body: `
        <p class="text-soft mb-2">
          Para guardar el registro debes completar:
        </p>
        <pre style="white-space:pre-wrap;background:var(--grey-50);padding:12px;border-radius:12px;border:1px solid var(--grey-200);font-family:inherit">• ${label}</pre>
      `,
      actions: [
        {
          id: 'ok',
          label: 'Entendido',
          cls: 'btn-primary',
          onClick: UI.closeModal
        }
      ]
    });

    setTimeout(() => {
      document.querySelector(`[name="${campos[0]}"]`)?.focus();
      document.querySelector(`[name="${campos[0]}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 150);

    return false;
  }

  return true;
}
function userDisplayName(user) {
  if (!user) return 'Usuario';
  return user.nombre || user.nombres_completos || user.name || 'Usuario';
}

function userFirstName(user) {
  return String(userDisplayName(user)).split(' ')[0];
}

function mkOpts(list, val) {
  return list.map(a =>
    `<option value="${a}" ${a === val ? 'selected' : ''}>${a}</option>`
  ).join('');
}
function escapeAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderPanelSugerencias(opciones, inputName) {
  return `
    <div class="suggestion-panel" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
      ${opciones.map(op => `
        <button type="button"
          class="btn btn-ghost btn-sm suggestion-chip"
          data-input-name="${inputName}"
          data-value="${escapeAttr(op)}"
          style="font-size:12px;padding:5px 9px">
          ${op}
        </button>
      `).join('')}
    </div>
  `;
}

function activarPanelSugerencias() {
  document.querySelectorAll('.suggestion-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputName = btn.dataset.inputName;
      const value = btn.dataset.value;
      const input = document.querySelector(`[name="${inputName}"]`);

      if (input) {
        input.value = value;
        input.focus();
      }
    });
  });
}
function bindRoutes() {
  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', () => Router.navigate(el.dataset.route));
  });
}

/* ════════════════════════════════════════════════════════════════
   BOTÓN APLICAR PERIODO
   Esto arregla el problema de tener que presionar Enter.
════════════════════════════════════════════════════════════════ */

function activarBotonPeriodo() {
  const inputs = [...document.querySelectorAll('input')];

  const inputPeriodo = inputs.find(input => {
    const valor = input.value || '';
    return input.type === 'month' || /^\d{4}-\d{2}$/.test(valor);
  });

  if (!inputPeriodo) return;
  if (document.getElementById('btn-aplicar-periodo')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'btn-aplicar-periodo';
  btn.className = 'btn btn-primary btn-sm';
  btn.textContent = 'Aplicar';
  btn.style.marginLeft = '8px';
  btn.style.whiteSpace = 'nowrap';

  inputPeriodo.insertAdjacentElement('afterend', btn);

  btn.addEventListener('click', () => {
    const eventoEnter = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      bubbles: true,
    });

    inputPeriodo.dispatchEvent(eventoEnter);

    setTimeout(() => {
      const rutaActual = location.hash.replace('#', '') || '/';
      Router.navigate(rutaActual);
    }, 100);
  });
}

/* ════════════════════════════════════════════════════════════════
   HELPER: SELECTOR DE PARTICIPANTES
════════════════════════════════════════════════════════════════ */

async function abrirSelectorParticipantes(valorActual, onConfirm) {
  let companeros = [];

  try {
    companeros = await API.usuarios.companeros();
  } catch(e) {
    console.warn('[SLIM-UMSA] No se pudieron cargar compañeros:', e);
  }

  const seleccionados = new Set(
    (valorActual || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  );

  const checkboxes = companeros.map(c => `
    <label class="checkbox-item ${seleccionados.has(c.nombres_completos) ? 'checked' : ''}"
           data-nombre="${c.nombres_completos}">
      <input type="checkbox" ${seleccionados.has(c.nombres_completos) ? 'checked' : ''} />
      <span class="check-dot"></span>
      ${c.nombres_completos}
    </label>
  `).join('');

  UI.modal({
    title: '👥 Seleccionar Participantes',
    body: `
      <p class="text-soft mb-2">
        Compañeros de tu municipio. También puedes agregar un nombre manualmente.
      </p>

      ${companeros.length > 0
        ? `<div class="checkbox-group mb-2">${checkboxes}</div>`
        : `<div class="alert alert-info mb-2">
             <span class="alert-icon">ℹ️</span>
             <span>No hay otros estudiantes registrados en tu municipio.</span>
           </div>`
      }

      <div class="form-group">
        <label class="form-label">Agregar nombre manualmente</label>
        <div class="flex gap-1">
          <input type="text" class="form-control" id="part-manual"
            placeholder="Ej. Juan Pérez" style="flex:1" />
          <button class="btn btn-ghost btn-sm" id="part-add-btn">+ Agregar</button>
        </div>
      </div>

      <div id="part-manual-list" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"></div>
    `,
    actions: [
      {
        id: 'cancel',
        label: 'Cancelar',
        cls: 'btn-ghost',
        onClick: UI.closeModal
      },
      {
        id: 'ok',
        label: '✅ Confirmar',
        cls: 'btn-primary',
        onClick: () => {
          const fromCbs = [...document.querySelectorAll('.checkbox-item.checked')]
            .map(el => el.dataset.nombre)
            .filter(Boolean);

          const fromManual = [...document.querySelectorAll('.part-tag')]
            .map(el => el.dataset.nombre)
            .filter(Boolean);

          const todos = [...new Set([...fromCbs, ...fromManual])];

          UI.closeModal();
          onConfirm(todos.join(', '));
        }
      },
    ]
  });

  setTimeout(() => {
    document.querySelectorAll('.checkbox-item').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('checked');
        el.querySelector('input').checked = el.classList.contains('checked');
      });
    });

    const nombresComp = new Set(companeros.map(c => c.nombres_completos));
    const soloManuales = [...seleccionados].filter(n => !nombresComp.has(n));
    soloManuales.forEach(nombre => agregarTagManual(nombre));

    document.getElementById('part-add-btn')?.addEventListener('click', () => {
      const inp = document.getElementById('part-manual');
      const val = inp.value.trim();

      if (val) {
        agregarTagManual(val);
        inp.value = '';
      }
    });

    document.getElementById('part-manual')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('part-add-btn').click();
      }
    });
  }, 50);
}

function agregarTagManual(nombre) {
  const list = document.getElementById('part-manual-list');
  if (!list) return;

  if ([...list.querySelectorAll('.part-tag')].some(t => t.dataset.nombre === nombre)) {
    return;
  }

  const tag = document.createElement('div');

  tag.className = 'part-tag';
  tag.dataset.nombre = nombre;
  tag.style.cssText = 'display:flex;align-items:center;gap:6px;padding:4px 10px;background:var(--grey-100);border-radius:99px;font-size:12px;';
  tag.innerHTML = `<span>${nombre}</span><span style="cursor:pointer;color:var(--grey-400)" class="rm-tag">✕</span>`;

  tag.querySelector('.rm-tag').addEventListener('click', () => tag.remove());
  list.appendChild(tag);
}

/* ════════════════════════════════════════════════════════════════
   LANDING / LOGIN
════════════════════════════════════════════════════════════════ */

Router.register('/', () => {
  document.getElementById('sidebar').classList.add('hidden');
  document.getElementById('topbar').classList.add('hidden');

  UI.render(`
    <div class="landing animate-fade">
      <div class="landing-left">
        <div class="landing-tagline">Universidad Mayor de San Andrés</div>

        <h1 class="landing-h1">
          Registro<br>
          de Actividades<br>
          <em>SLIM-UMSA</em>
        </h1>

        <p class="landing-desc">
          Plataforma institucional para el seguimiento y rendición de cuentas
          del Programa de Vinculación SLIM — Trabajo Social, Psicología y Derecho.
        </p>

        <div class="landing-divider"></div>

        <p class="landing-note">
          Sistema institucional para el registro, seguimiento y generación de informes mensuales.
        </p>
      </div>

      <div class="landing-right">
        <div class="landing-form-title">Iniciar Sesión</div>
        <p class="landing-form-sub">Credenciales entregadas por el coordinador DIPGIS</p>

        <div class="form-group">
          <label class="form-label">Carnet de Identidad</label>
          <input 
            type="text" 
            class="form-control" 
            id="l-ci" 
            name="slim_ci_manual"
            placeholder="00000000" 
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <div style="display:flex;gap:8px;align-items:center">
            <input 
              type="password" 
              class="form-control" 
              id="l-pw" 
              name="slim_password_manual"
              placeholder="Ingresa tu contraseña" 
              autocomplete="new-password"
              autocapitalize="off"
              spellcheck="false"
              style="flex:1" 
            />
            <button type="button" class="btn btn-ghost btn-sm" id="toggle-pw" style="white-space:nowrap">
              👁️ Ver
            </button>
          </div>
        </div>

        <button class="btn btn-primary btn-block btn-lg" id="l-btn">Iniciar Sesión →</button>

        <div id="l-error" style="color:var(--red);font-size:12px;margin-top:8px;display:none"></div>

        <div style="text-align:center;margin-top:16px">
          <span style="font-size:12px;color:var(--grey-400);cursor:pointer;text-decoration:underline"
            id="forgot-btn">¿Olvidaste tu contraseña?</span>
        </div>

        <div class="landing-umsa">🏛️ UMSA · DIPGIS · Sistema de Registro v2.0</div>
      </div>
    </div>
  `);
  setTimeout(() => {
    const ciInput = document.getElementById('l-ci');
    const pwInput = document.getElementById('l-pw');

    if (ciInput) ciInput.value = '';
    if (pwInput) pwInput.value = '';
  }, 100);

  const doLogin = async () => {
    const ci  = document.getElementById('l-ci').value.trim();
    const pw  = document.getElementById('l-pw').value.trim();
    const err = document.getElementById('l-error');
    const btn = document.getElementById('l-btn');

    err.style.display = 'none';

    if (!ci || !pw) {
      err.textContent = 'Completa los campos.';
      err.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Ingresando...';

    try {
      const data = await Auth.login(ci, pw);

      UI.renderSidebar(Auth.getUser());
      UI.renderTopbar(Auth.getUser());
      activarBotonPeriodo();

      UI.toast(`Bienvenido, ${String(data.nombre || '').split(' ')[0]}!`, 'success');

      Router.navigate(data.rol === 'ADMIN' ? '/admin/dashboard' : '/estudiante/dashboard');
    } catch(e) {
      err.textContent = e.message;
      err.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Iniciar Sesión →';
    }
  };

  document.getElementById('l-btn').addEventListener('click', doLogin);

  document.getElementById('l-pw').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });

  document.getElementById('toggle-pw').addEventListener('click', () => {
    const input = document.getElementById('l-pw');
    const btn = document.getElementById('toggle-pw');

    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈 Ocultar';
    } else {
      input.type = 'password';
      btn.textContent = '👁️ Ver';
    }
  });

  document.getElementById('forgot-btn').addEventListener('click', () => {
    UI.modal({
      title: '🔑 Recuperar Contraseña',
      body: `
        <p class="text-soft mb-2">
          Ingresa tu CI y tu <strong>Registro Universitario</strong> o <strong>Número de Celular</strong>
          para verificar tu identidad.
        </p>

        <div class="form-group">
          <label class="form-label">CI <span class="required">*</span></label>
          <input class="form-control" id="rec-ci" placeholder="Número de carnet" />
        </div>

        <div class="form-group">
          <label class="form-label">Registro Universitario</label>
          <input class="form-control" id="rec-ru" placeholder="Ej. RU-12345" />
        </div>

        <div class="form-group">
          <label class="form-label">— o — Número de Celular</label>
          <input class="form-control" id="rec-cel" placeholder="7xxxxxxx" />
        </div>

        <div class="form-group">
          <label class="form-label">Nueva Contraseña <span class="required">*</span></label>
          <input type="password" class="form-control" id="rec-pw" placeholder="Mínimo 6 caracteres" />
        </div>

        <div id="rec-error" style="color:var(--red);font-size:12px;display:none"></div>
      `,
      actions: [
        {
          id: 'cancel',
          label: 'Cancelar',
          cls: 'btn-ghost',
          onClick: UI.closeModal
        },
        {
          id: 'ok',
          label: 'Cambiar Contraseña',
          cls: 'btn-primary',
          onClick: async () => {
            const ci  = document.getElementById('rec-ci').value.trim();
            const ru  = document.getElementById('rec-ru').value.trim();
            const cel = document.getElementById('rec-cel').value.trim();
            const pw  = document.getElementById('rec-pw').value;
            const err = document.getElementById('rec-error');

            err.style.display = 'none';

            if (!ci || !pw) {
              err.textContent = 'CI y nueva contraseña son obligatorios.';
              err.style.display = 'block';
              return;
            }

            if (!ru && !cel) {
              err.textContent = 'Ingresa Registro Universitario o Celular.';
              err.style.display = 'block';
              return;
            }

            try {
              await API.usuarios.recuperarPassword({
                ci,
                nueva_password: pw,
                registro_universitario: ru || undefined,
                celular: cel || undefined,
              });

              UI.closeModal();
              UI.toast('Contraseña actualizada. Inicia sesión.', 'success');
            } catch(e) {
              err.textContent = e.message;
              err.style.display = 'block';
            }
          }
        },
      ]
    });
  });
});

Router.register('/login', () => Router.navigate('/'));

/* ════════════════════════════════════════════════════════════════
   ESTUDIANTE: DASHBOARD
════════════════════════════════════════════════════════════════ */

Router.register('/estudiante/dashboard', async () => {
  UI.setTopbarTitle('Mi Panel');
  UI.renderLoading();

  const user = Auth.getUser() || {};
  const periodo = UI.getPeriodo();

  try {
    const [prevsRaw, atensRaw] = await Promise.all([
      API.prevenciones.listar(periodo),
      API.atenciones.listar(periodo),
    ]);

    const prevs = Array.isArray(prevsRaw) ? prevsRaw : [];
    const atens = Array.isArray(atensRaw) ? atensRaw : [];

    const totalPob = prevs.reduce((s, r) => {
      return s + num(r.poblacion_mujeres) + num(r.poblacion_hombres);
    }, 0);

    UI.render(`
      <div class="page-content animate-up">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <div class="page-title">Hola, ${userFirstName(user)} 👋</div>
              <div class="page-subtitle">Periodo activo: ${periodoLabel(periodo)}</div>
            </div>
          </div>
        </div>

        <div class="grid grid-4 stagger mb-2">
          <div class="stat-card">
            <div class="stat-icon blue">🎯</div>
            <div>
              <div class="stat-label">Prevenciones</div>
              <div class="stat-value">${prevs.length}</div>
              <div class="stat-sub">${periodoLabel(periodo)}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">🤝</div>
            <div>
              <div class="stat-label">Atenciones</div>
              <div class="stat-value">${atens.length}</div>
              <div class="stat-sub">${periodoLabel(periodo)}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon yellow">👥</div>
            <div>
              <div class="stat-label">Población Alcanzada</div>
              <div class="stat-value">${totalPob}</div>
              <div class="stat-sub">En prevención</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon teal">📄</div>
            <div>
              <div class="stat-label">Informe</div>
              <div class="stat-value">${prevs.length + atens.length > 0 ? 'Listo' : 'Vacío'}</div>
              <div class="stat-sub">${periodoLabel(periodo)}</div>
            </div>
          </div>
        </div>

        <div class="section-title">Acciones Rápidas</div>

        <div class="grid grid-4 stagger mb-3">
          <div class="quick-action" data-route="/estudiante/prevencion/nueva">
            <div class="qa-icon">🎯</div>
            <div class="qa-label">Nueva Prevención</div>
            <div class="qa-sub">Registrar taller, feria o charla</div>
          </div>

          <div class="quick-action" data-route="/estudiante/prevencion/listado">
            <div class="qa-icon">📋</div>
            <div class="qa-label">Mis Prevenciones</div>
            <div class="qa-sub">${prevs.length} registradas</div>
          </div>

          <div class="quick-action" data-route="/estudiante/atencion/nueva">
            <div class="qa-icon">🤝</div>
            <div class="qa-label">Nueva Atención</div>
            <div class="qa-sub">Registrar caso individual</div>
          </div>

          <div class="quick-action" data-route="/estudiante/atencion/listado">
            <div class="qa-icon">📋</div>
            <div class="qa-label">Mis Atenciones</div>
            <div class="qa-sub">${atens.length} registradas</div>
          </div>
        </div>

        <div class="section-title">Generar Informe</div>

        <div class="card">
          <div class="card-body flex items-center justify-between gap-2">
            <div>
              <div style="font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--navy)">
                Informe ${periodoLabel(periodo)}
              </div>
              <div class="text-soft mt-1">${prevs.length} prevenciones · ${atens.length} atenciones</div>
            </div>

            <div class="flex gap-1">
              <button class="btn btn-ghost" data-route="/estudiante/informe">👁️ Vista Previa</button>
              <button class="btn btn-accent" id="export-dash-btn">📥 Descargar .docx</button>
            </div>
          </div>
        </div>
      </div>
    `);

    bindRoutes();

    document.getElementById('export-dash-btn')?.addEventListener('click', () => {
      descargarInforme(user.id, periodo);
    });

  } catch(e) {
    mostrarErrorVista('No se pudo cargar el panel del estudiante', e);
  }
});

/* ════════════════════════════════════════════════════════════════
   ESTUDIANTE: FORMULARIO PREVENCIÓN
════════════════════════════════════════════════════════════════ */

function renderPrevencionForm(editing = null) {
  UI.setTopbarTitle(editing ? 'Editar Prevención' : 'Nueva Prevención');

  const d = editing || {};

  UI.render(`
    <div class="page-content animate-up" style="max-width:720px">
      <div class="page-header">
        <div class="page-breadcrumb">
          <span style="cursor:pointer;color:var(--blue)" data-route="/estudiante/prevencion/listado">Prevenciones</span>
          <span>›</span>
          <span>${editing ? 'Editar' : 'Nueva'}</span>
        </div>

        <div class="page-title">${editing ? '✏️ Editar' : '🎯 Nueva'} Prevención</div>
      </div>

      <div class="alert alert-warning mb-2">
        <span class="alert-icon">⚠️</span>
        <span>No ingreses nombres propios de personas atendidas.</span>
      </div>

      <div class="card">
        <div class="card-body">

          <div class="form-group">
            <label class="form-label">NOMBRE DE LA ACTIVIDAD <span class="required">*</span></label>
            <input type="text" class="form-control" name="nombre" required
              placeholder="Escribe una actividad o selecciona una sugerencia"
              value="${d.nombre || ''}" />

            ${renderPanelSugerencias(CAT.ACTIVIDADES_PREVENCION, 'nombre')}

            <span class="form-hint">
              Puedes escribir libremente o hacer clic en una sugerencia.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">
              Fecha en que se realizó la actividad de prevencion <span class="required">*</span>
            </label>

            <input type="date" class="form-control" name="fecha" required value="${d.fecha || ''}" />

            <span class="form-hint">
              Selecciona el día exacto en que se atendió u orientó a la persona.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">DESCRIPCIÓN DE LA ACTIVIDAD Y RESULTADOS ALCANZADOS</label>
            <textarea class="form-control" name="descripcion" rows="4"
              placeholder="Describe el desarrollo y los resultados obtenidos...">${d.descripcion || ''}</textarea>
          </div>

          <div class="section-title">POBLACIÓN ALCANZADA</div>

          <div class="num-group mb-2">
            <div class="num-item">
              <div class="num-label">♀ Mujeres</div>
              <input type="number" class="form-control" name="poblacion_mujeres"
                min="0" id="inp-m" value="${d.poblacion_mujeres || 0}" />
            </div>

            <div class="num-item">
              <div class="num-label">♂ Hombres</div>
              <input type="number" class="form-control" name="poblacion_hombres"
                min="0" id="inp-h" value="${d.poblacion_hombres || 0}" />
            </div>

            <div class="num-item">
              <div class="num-label">Total</div>
              <input type="number" class="form-control" id="inp-total"
                style="color:var(--blue);font-weight:700" readonly
                value="${num(d.poblacion_mujeres) + num(d.poblacion_hombres)}" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">
              ¿La actividad estuvo dirigida o incluyó a alguno de estos grupos?
            </label>

            <div class="alert alert-info mb-2">
              <span class="alert-icon">ℹ️</span>
              <span>
                Marca solo si dentro de la población alcanzada participaron niñas, niños,
                adultos mayores o personas con discapacidad. Si no corresponde, deja todo sin marcar.
              </span>
            </div>

            <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;width:100%;margin-top:10px">

              <label class="checkbox-item ${d.poblacion_ninez ? 'checked' : ''}" data-name="poblacion_ninez"
                style="display:flex;align-items:center;justify-content:flex-start;gap:8px;width:100%;min-height:54px;padding:10px 12px;border:1px solid var(--grey-200);border-radius:18px;background:#fff;cursor:pointer;text-align:left">

                <input type="checkbox" name="poblacion_ninez" ${d.poblacion_ninez ? 'checked' : ''}
                  style="width:16px;height:16px;margin:0;flex:0 0 16px" />

                <span style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:800;line-height:1.25;color:#0f2342">
                  <span>🧒</span>
                  <span>Niñez / adolescencia</span>
                </span>
              </label>

              <label class="checkbox-item ${d.poblacion_adulto_mayor ? 'checked' : ''}" data-name="poblacion_adulto_mayor"
                style="display:flex;align-items:center;justify-content:flex-start;gap:8px;width:100%;min-height:54px;padding:10px 12px;border:1px solid var(--grey-200);border-radius:18px;background:#fff;cursor:pointer;text-align:left">

                <input type="checkbox" name="poblacion_adulto_mayor" ${d.poblacion_adulto_mayor ? 'checked' : ''}
                  style="width:16px;height:16px;margin:0;flex:0 0 16px" />

                <span style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:800;line-height:1.25;color:#0f2342">
                  <span>👴</span>
                  <span>Adulto mayor</span>
                </span>
              </label>

              <label class="checkbox-item ${d.poblacion_discapacidad ? 'checked' : ''}" data-name="poblacion_discapacidad"
                style="display:flex;align-items:center;justify-content:flex-start;gap:8px;width:100%;min-height:54px;padding:10px 12px;border:1px solid var(--grey-200);border-radius:18px;background:#fff;cursor:pointer;text-align:left">

                <input type="checkbox" name="poblacion_discapacidad" ${d.poblacion_discapacidad ? 'checked' : ''}
                  style="width:16px;height:16px;margin:0;flex:0 0 16px" />

                <span style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:800;line-height:1.25;color:#0f2342">
                  <span>♿</span>
                  <span>Personas con discapacidad</span>
                </span>
              </label>

            </div>

            <span class="form-hint">
              Esto solo sirve para identificar si la actividad incluyó grupos prioritarios.
            </span>
          </div>
          <div class="section-title"> ¿Alguien más participó en esta actividad?</div>

          <div class="alert alert-info mb-2">
            <span class="alert-icon">👥</span>
            <span>
              Si realizaste esta actividad junto con otros estudiantes, selecciónalos aquí.
              Si trabajaste solo, puedes dejar este campo vacío.
            </span>
          </div>

          <div class="form-group">
            <div class="flex gap-1 items-center">
              <input type="text" class="form-control" name="participantes" id="inp-participantes"
                placeholder="Si trabajaste con otros estudiantes, aparecerán aquí..."
                value="${d.participantes || ''}" readonly
                style="cursor:pointer;background:var(--off-white)" />
              <button type="button" class="btn btn-ghost btn-sm" id="btn-selector" style="white-space:nowrap">
                👥 Agregar compañeros
              </button>
            </div>
            <span class="form-hint">
              Este campo es opcional. Sirve para registrar quiénes participaron contigo en la actividad.
            </span>
          </div>

          <div class="section-title"> EVIDENCIAS</div>

          <div class="form-group">
            <label class="form-label"> PUBLICACIÓN EN REDES SOCIALES URL</label>
            <input type="url" class="form-control" name="url_redes"
              placeholder="https://facebook.com/…" value="${d.url_redes || ''}" />
          </div>

          <div class="form-group">
            <label class="form-label"> ENLACE A CARPETA DE DRIVE CON ANEXOS</label>
            <input type="url" class="form-control" name="url_drive"
              placeholder="https://drive.google.com/…" value="${d.url_drive || ''}" />
          </div>

        </div>

        <div class="card-footer flex gap-1 justify-between">
          <button class="btn btn-ghost" data-route="/estudiante/prevencion/listado">← Cancelar</button>

          <button class="btn btn-primary" id="save-btn">
            ${editing ? '💾 Guardar Cambios' : '✅ Registrar Prevención'}
          </button>
        </div>
      </div>
    </div>
  `);
  activarPanelSugerencias();
  document.querySelectorAll('.checkbox-item').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('checked');
      el.querySelector('input').checked = el.classList.contains('checked');
    });
  });

  ['inp-m', 'inp-h'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      const m = parseInt(document.getElementById('inp-m').value) || 0;
      const h = parseInt(document.getElementById('inp-h').value) || 0;

      document.getElementById('inp-total').value = m + h;
    });
  });

  document.getElementById('btn-selector').addEventListener('click', () => {
    const actual = document.getElementById('inp-participantes').value;

    abrirSelectorParticipantes(actual, (csv) => {
      document.getElementById('inp-participantes').value = csv;
    });
  });

  bindRoutes();

  document.getElementById('save-btn').addEventListener('click', async () => {
    const g = name => document.querySelector(`[name="${name}"]`);

    const nombre = g('nombre').value.trim();
    const fecha  = g('fecha').value;

    const formularioValido = validarCamposObligatorios([
      {
        name: 'nombre',
        label: 'Nombre de la actividad',
        mensaje: 'Escribe o selecciona el nombre de la actividad.'
      },
      {
        name: 'fecha',
        label: 'Fecha en que se realizó la actividad de prevención',
        mensaje: 'Selecciona la fecha exacta en que se realizó la actividad.'
      }
    ]);

    if (!formularioValido) {
      return;
    }

    const poblacionValida = validarTotalMayorACero(
      ['poblacion_mujeres', 'poblacion_hombres'],
      'Población alcanzada',
      'Debes registrar al menos una persona alcanzada, ya sea mujer u hombre.'
    );

    if (!poblacionValida) {
      return;
    }

    const data = {
      nombre,
      fecha,
      descripcion:            g('descripcion').value,
      poblacion_mujeres:      parseInt(g('poblacion_mujeres').value) || 0,
      poblacion_hombres:      parseInt(g('poblacion_hombres').value) || 0,
      poblacion_ninez:        g('poblacion_ninez').checked,
      poblacion_adulto_mayor: g('poblacion_adulto_mayor').checked,
      poblacion_discapacidad: g('poblacion_discapacidad').checked,
      participantes:          g('participantes').value || null,
      url_redes:              g('url_redes').value || null,
      url_drive:              g('url_drive').value || null,
    };

    const btn = document.getElementById('save-btn');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
      if (editing) {
        await API.prevenciones.actualizar(editing.id, data);
      } else {
        await API.prevenciones.crear(data);
      }

      UI.toast(editing ? 'Prevención actualizada' : 'Prevención registrada', 'success');
      Router.navigate('/estudiante/prevencion/listado');
    } catch(e) {
      UI.toast(e.message, 'error');
      btn.disabled = false;
      btn.textContent = editing ? '💾 Guardar Cambios' : '✅ Registrar Prevención';
    }
  });
}

Router.register('/estudiante/prevencion/nueva', () => renderPrevencionForm());

Router.register('/estudiante/prevencion/edit/:id', async ({ id }) => {
  UI.renderLoading();

  const lista = await API.prevenciones.listar(UI.getPeriodo()).catch(() => []);
  const r = lista.find(x => x.id == id);

  if (!r) {
    UI.toast('No encontrado', 'error');
    Router.navigate('/estudiante/prevencion/listado');
    return;
  }

  renderPrevencionForm(r);
});

/* ════════════════════════════════════════════════════════════════
   ESTUDIANTE: LISTADO PREVENCIONES
════════════════════════════════════════════════════════════════ */

Router.register('/estudiante/prevencion/listado', async () => {
  UI.setTopbarTitle('Mis Prevenciones');
  UI.renderLoading();

  const periodo = UI.getPeriodo();

  try {
    const prevs = await API.prevenciones.listar(periodo);

    const rows = prevs.map(r => `
      <tr>
        <td>${r.fecha}</td>
        <td><strong>${r.nombre}</strong></td>
        <td class="text-center">${num(r.poblacion_mujeres)}</td>
        <td class="text-center">${num(r.poblacion_hombres)}</td>
        <td class="text-center"><strong>${num(r.poblacion_mujeres) + num(r.poblacion_hombres)}</strong></td>

        <td>
          ${gruposEspecialesBadges(r)}
        </td>

        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px">
          ${r.participantes || '—'}
        </td>
	<td>
          <div class="flex gap-1">
            <button class="btn btn-ghost btn-sm btn-icon edit-btn" data-id="${r.id}">✏️</button>
            <button class="btn btn-danger btn-sm btn-icon del-btn" data-id="${r.id}">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');

    UI.render(`
      <div class="page-content animate-up">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <div class="page-title">🎯 Prevenciones</div>
              <div class="page-subtitle">${periodoLabel(periodo)} · ${prevs.length} actividades</div>
            </div>

            <button class="btn btn-primary" data-route="/estudiante/prevencion/nueva">+ Nueva</button>
          </div>
        </div>

        <div class="card">
          ${prevs.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">🎯</div>
              <div class="empty-state-title">Sin actividades este mes</div>
              <button class="btn btn-primary mt-2" data-route="/estudiante/prevencion/nueva">+ Registrar Prevención</button>
            </div>
          ` : `
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Actividad</th>
                    <th>M</th>
                    <th>H</th>
                    <th>Total</th>
                    <th>Grupos Especiales</th>
                    <th>Participantes</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>${rows}</tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `);

    bindRoutes();

    document.querySelectorAll('.edit-btn').forEach(el => {
      el.addEventListener('click', () => {
        Router.navigate(`/estudiante/prevencion/edit/${el.dataset.id}`);
      });
    });

    document.querySelectorAll('.del-btn').forEach(el => {
      el.addEventListener('click', () => {
        UI.confirm({
          title: 'Eliminar Prevención',
          body: '¿Seguro?',
          danger: true,
          onConfirm: async () => {
            await API.prevenciones.eliminar(parseInt(el.dataset.id));
            UI.toast('Eliminado', 'info');
            Router.navigate('/estudiante/prevencion/listado');
          }
        });
      });
    });

  } catch(e) {
    mostrarErrorVista('No se pudieron cargar las prevenciones', e);
  }
});

/* ════════════════════════════════════════════════════════════════
   ESTUDIANTE: FORMULARIO ATENCIÓN
════════════════════════════════════════════════════════════════ */

function renderAtencionForm(editing = null) {
  UI.setTopbarTitle(editing ? 'Editar Atención' : 'Nueva Atención');

  const d = editing || {};

  UI.render(`
    <div class=
      <div class="page-content animate-up" style="max-width:720px">
      <div class="page-header">
        <div class="page-breadcrumb">
          <span style="cursor:pointer;color:var(--blue)" data-route="/estudiante/atencion/listado">Atenciones</span>
          <span>›</span>
          <span>${editing ? 'Editar' : 'Nueva'}</span>
        </div>

        <div class="page-title">${editing ? '✏️ Editar Caso' : '🤝 Nueva Atención'}</div>
      </div>

      <div class="alert alert-danger mb-2">
        <span class="alert-icon">🔒</span>
        <span><strong>Confidencialidad:</strong> No ingreses nombres propios de personas atendidas.</span>
      </div>

      <div class="card">
        <div class="card-body">

          <div class="form-group">
            <label class="form-label">
              Fecha en que se realizó la actividad de atencion <span class="required">*</span>
            </label>

            <input type="date" class="form-control" name="fecha" required value="${d.fecha || ''}" />

            <span class="form-hint">
              Selecciona el día exacto en que se hizo la charla, taller, feria o actividad de prevención.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">ACTIVIDAD <span class="required">*</span></label>
            <input type="text" class="form-control" name="tipo_actividad" required
              placeholder="Escribe una actividad o selecciona una sugerencia"
              value="${d.tipo_actividad || ''}" />

            ${renderPanelSugerencias(CAT.ACTIVIDADES_ATENCION, 'tipo_actividad')}

            <span class="form-hint">
              Puedes escribir libremente o hacer clic en una sugerencia.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">DESCRIPCIÓN DE LA ACTIVIDAD Y RESULTADOS ALCANZADOS</label>
            <textarea class="form-control" name="descripcion" rows="4"
              placeholder="Sin nombres propios...">${d.descripcion || ''}</textarea>
          </div>

          <div class="section-title">DENUNCIANTE</div>

          <div class="num-group mb-2">
            <div class="num-item">
              <div class="num-label">H — Hombre</div>
              <input type="number" class="form-control" name="denunciantes_h" min="0" value="${d.denunciantes_h || 0}" />
            </div>

            <div class="num-item">
              <div class="num-label">M — Mujer</div>
              <input type="number" class="form-control" name="denunciantes_m" min="0" value="${d.denunciantes_m || 0}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">SEGUIMIENTO <span class="required">*</span></label>

            <select class="form-control" name="seguimiento" required>
              <option value="">— Seleccionar —</option>

              <option value="0" ${(d.seguimiento === 0 || d.seguimiento === '0') ? 'selected' : ''}>
                0 — Caso Nuevo
              </option>

              <option value="1" ${(d.seguimiento === 1 || d.seguimiento === '1') ? 'selected' : ''}>
                1 — Seguimiento
              </option>
            </select>

            <span class="form-hint">
              Selecciona 0 si es primera atención o 1 si corresponde a seguimiento.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">TIPO DE CASO <span class="required">*</span></label>

            <select class="form-control" name="tipo_caso" required>
              <option value="">— Seleccionar —</option>
              ${mkOpts(CAT.TIPOS_CASO, d.tipo_caso)}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">TIPO DE DENUNCIA <span class="required">*</span></label>

            <input type="text" class="form-control" name="tipo_denuncia" required
              placeholder="Escribe el tipo de denuncia o selecciona una sugerencia"
              value="${d.tipo_denuncia || ''}" />

            ${renderPanelSugerencias(CAT.TIPOS_DENUNCIA, 'tipo_denuncia')}

            <span class="form-hint">
              Puedes escribir libremente o hacer clic en una sugerencia.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Institución</label>

            <input type="text" class="form-control" name="institucion"
              list="institucion-sugerencias"
              placeholder="Selecciona una institución o escribe otra"
              value="${d.institucion || ''}" />

            <datalist id="institucion-sugerencias">
              ${CAT.INSTITUCIONES.map(i => `<option value="${i}"></option>`).join('')}
            </datalist>

            <span class="form-hint">
              Puedes seleccionar una sugerencia o escribir una institución propia.
            </span>
          </div>

          <div class="section-title">¿Alguien más participó en esta atención?</div>
          <div class="alert alert-info mb-2">
            <span class="alert-icon">👥</span>
            <span>
              Si esta atención fue realizada con apoyo de otros estudiantes, selecciónalos aquí.
              Si la atención la realizaste solo, deja este campo vacío.
            </span>
          </div>
          <div class="form-group">
            <div class="flex gap-1 items-center">
              <input type="text" class="form-control" name="participantes" id="inp-participantes-a"
                placeholder="Si trabajaste con otros estudiantes, aparecerán aquí..."
                value="${d.participantes || ''}" readonly
                style="cursor:pointer;background:var(--off-white)" />

              <button type="button" class="btn btn-ghost btn-sm" id="btn-selector-a" style="white-space:nowrap">
                👥 Agregar compañeros
              </button>
            </div>

            <span class="form-hint">
              Este campo es opcional. Sirve para registrar quiénes participaron contigo en la atención.
            </span>
          </div>

        </div>

        <div class="card-footer flex gap-1 justify-between">
          <button class="btn btn-ghost" data-route="/estudiante/atencion/listado">← Cancelar</button>

          <button class="btn btn-primary" id="save-a-btn">
            ${editing ? '💾 Guardar Cambios' : '✅ Registrar Atención'}
          </button>
        </div>
      </div>
    </div>
  `);
  activarPanelSugerencias();
  document.getElementById('btn-selector-a').addEventListener('click', () => {
    const actual = document.getElementById('inp-participantes-a').value;

    abrirSelectorParticipantes(actual, (csv) => {
      document.getElementById('inp-participantes-a').value = csv;
    });
  });

  bindRoutes();

  document.getElementById('save-a-btn').addEventListener('click', async () => {
    const g = name => document.querySelector(`[name="${name}"]`);

    const tipo_actividad = g('tipo_actividad').value.trim();
    const tipo_caso      = g('tipo_caso').value;
    const tipo_denuncia  = g('tipo_denuncia').value.trim();
    const fecha          = g('fecha').value;

    const formularioValido = validarCamposObligatorios([
      {
        name: 'fecha',
        label: 'Fecha en que se realizó la atención',
        mensaje: 'Selecciona la fecha exacta en que se realizó la atención.'
      },
      {
        name: 'tipo_actividad',
        label: 'Actividad',
        mensaje: 'Escribe o selecciona la actividad realizada.'
      },
      {
        name: 'seguimiento',
        label: 'Seguimiento',
        mensaje: 'Selecciona si corresponde a caso nuevo o seguimiento.'
      },
      {
        name: 'tipo_caso',
        label: 'Tipo de caso',
        mensaje: 'Selecciona el tipo de caso.'
      },
      {
        name: 'tipo_denuncia',
        label: 'Tipo de denuncia',
        mensaje: 'Escribe o selecciona el tipo de denuncia.'
      },
      {
        name: 'institucion',
        label: 'Institución',
        mensaje: 'Selecciona o escribe la institución correspondiente.'
      }
    ]);

    if (!formularioValido) {
      return;
    }

    const denunciantesValidos = validarTotalMayorACero(
      ['denunciantes_h', 'denunciantes_m'],
      'Denunciante',
      'Debes registrar al menos una persona denunciante, ya sea hombre o mujer.'
    );

    if (!denunciantesValidos) {
      return;
    }

    const data = {
      fecha,
      tipo_actividad,
      tipo_caso,
      tipo_denuncia,
      descripcion:    g('descripcion').value,
      denunciantes_h: parseInt(g('denunciantes_h').value) || 0,
      denunciantes_m: parseInt(g('denunciantes_m').value) || 0,
      seguimiento:    parseInt(g('seguimiento').value),
      institucion:    g('institucion').value || null,
      participantes:  g('participantes').value || null,
    };

    const btn = document.getElementById('save-a-btn');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
      if (editing) {
        await API.atenciones.actualizar(editing.id, data);
      } else {
        await API.atenciones.crear(data);
      }

      UI.toast(editing ? 'Atención actualizada' : 'Atención registrada', 'success');
      Router.navigate('/estudiante/atencion/listado');
    } catch(e) {
      UI.toast(e.message, 'error');
      btn.disabled = false;
      btn.textContent = editing ? '💾 Guardar Cambios' : '✅ Registrar Atención';
    }
  });
}

Router.register('/estudiante/atencion/nueva', () => renderAtencionForm());

Router.register('/estudiante/atencion/edit/:id', async ({ id }) => {
  UI.renderLoading();

  const lista = await API.atenciones.listar(UI.getPeriodo()).catch(() => []);
  const r = lista.find(x => x.id == id);

  if (!r) {
    UI.toast('No encontrado', 'error');
    Router.navigate('/estudiante/atencion/listado');
    return;
  }

  renderAtencionForm(r);
});

/* ════════════════════════════════════════════════════════════════
   ESTUDIANTE: LISTADO ATENCIONES
════════════════════════════════════════════════════════════════ */

Router.register('/estudiante/atencion/listado', async () => {
  UI.setTopbarTitle('Mis Atenciones');
  UI.renderLoading();

  const periodo = UI.getPeriodo();

  try {
    const atens = await API.atenciones.listar(periodo);

    const rows = atens.map(r => `
      <tr>
        <td>${r.fecha}</td>
        <td><span class="tag">${r.tipo_actividad}</span></td>
        <td>${r.tipo_denuncia}</td>
        <td class="text-center">
          <span class="badge ${r.seguimiento === 0 ? 'badge-blue' : 'badge-yellow'}">
            ${r.seguimiento === 0 ? '0 - Nuevo' : '1 - Sgte.'}
          </span>
        </td>
        <td>${num(r.denunciantes_h)}H / ${num(r.denunciantes_m)}M</td>
        <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px">
          ${r.participantes || '—'}
        </td>
        <td>
          <div class="flex gap-1">
            <button class="btn btn-ghost btn-sm btn-icon edit-btn" data-id="${r.id}">✏️</button>
            <button class="btn btn-danger btn-sm btn-icon del-btn" data-id="${r.id}">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');

    UI.render(`
      <div class="page-content animate-up">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <div class="page-title">🤝 Atenciones</div>
              <div class="page-subtitle">${periodoLabel(periodo)} · ${atens.length} casos</div>
            </div>

            <button class="btn btn-primary" data-route="/estudiante/atencion/nueva">+ Nueva</button>
          </div>
        </div>

        <div class="card">
          ${atens.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">🤝</div>
              <div class="empty-state-title">Sin casos este mes</div>
              <button class="btn btn-primary mt-2" data-route="/estudiante/atencion/nueva">+ Registrar Atención</button>
            </div>
          ` : `
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Actividad</th>
                    <th>Tipo Denuncia</th>
                    <th>Seguimiento</th>
                    <th>Denunciantes</th>
                    <th>Estudiantes</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>${rows}</tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `);

    bindRoutes();

    document.querySelectorAll('.edit-btn').forEach(el => {
      el.addEventListener('click', () => {
        Router.navigate(`/estudiante/atencion/edit/${el.dataset.id}`);
      });
    });

    document.querySelectorAll('.del-btn').forEach(el => {
      el.addEventListener('click', () => {
        UI.confirm({
          title: 'Eliminar Atención',
          body: '¿Seguro?',
          danger: true,
          onConfirm: async () => {
            await API.atenciones.eliminar(parseInt(el.dataset.id));
            UI.toast('Eliminado', 'info');
            Router.navigate('/estudiante/atencion/listado');
          }
        });
      });
    });

  } catch(e) {
    mostrarErrorVista('No se pudieron cargar las atenciones', e);
  }
});

/* ════════════════════════════════════════════════════════════════
   ESTUDIANTE: INFORME
════════════════════════════════════════════════════════════════ */

Router.register('/estudiante/informe', async () => {
  UI.setTopbarTitle('Mi Informe');
  UI.renderLoading();

  const user = Auth.getUser();
  const periodo = UI.getPeriodo();

  try {
    const [prevs, atens, informe] = await Promise.all([
      API.prevenciones.listar(periodo),
      API.atenciones.listar(periodo),
      API.informes.mio(periodo),
    ]);

    const estadoBadge = {
      BORRADOR: '<span class="badge badge-grey">Borrador</span>',
      ENVIADO:  '<span class="badge badge-yellow">Enviado ⏳</span>',
      APROBADO: '<span class="badge badge-green">Aprobado ✅</span>',
      RECHAZADO:'<span class="badge badge-red">Rechazado</span>',
    }[informe.estado] || '';

    const prevRows = prevs.map(r => {
      const grupos = [
        r.poblacion_ninez ? 'Niñez' : '',
        r.poblacion_adulto_mayor ? 'Adulto Mayor' : '',
        r.poblacion_discapacidad ? 'Discapacidad' : ''
      ].filter(Boolean).join(', ');

      return `
        <tr>
          <td>${r.nombre}</td>
          <td>${r.descripcion || ''}</td>
          <td>
            M:${num(r.poblacion_mujeres)} / H:${num(r.poblacion_hombres)}
            <br>
            <small>${grupos || 'Sin grupos especiales'}</small>
          </td>
          <td>${r.participantes || '—'}</td>
          <td>${r.url_redes || '—'}</td>
          <td>${r.url_drive || '—'}</td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="6" style="text-align:center;color:#999;padding:12px">Sin registros</td></tr>';

    const atenRows = atens.map(r => `
      <tr>
        <td>${r.tipo_actividad}</td>
        <td>${r.descripcion || ''}</td>
        <td style="text-align:center">${num(r.denunciantes_h)}</td>
        <td style="text-align:center">${num(r.denunciantes_m)}</td>
        <td style="text-align:center">${r.seguimiento}</td>
        <td>${r.tipo_caso}</td>
        <td>${r.tipo_denuncia}</td>
        <td>${r.participantes || '—'}</td>
      </tr>
    `).join('') || '<tr><td colspan="8" style="text-align:center;color:#999;padding:12px">Sin registros</td></tr>';

    UI.render(`
      <div class="page-content animate-up">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <div class="page-title">📄 Informe ${periodoLabel(periodo)}</div>
              <div class="page-subtitle">Estado: ${estadoBadge}</div>
            </div>

            <div class="flex gap-1">
              ${informe.estado === 'BORRADOR' && (prevs.length + atens.length) > 0
                ? `<button class="btn btn-ghost" id="enviar-btn">📤 Enviar al DIPGIS</button>`
                : ''}
              <button class="btn btn-accent" id="export-btn">📥 Descargar .docx</button>
            </div>
          </div>
        </div>

        <div class="card" style="max-width:100%;overflow-x:auto">
          <div style="background:var(--navy);padding:20px 28px;color:#fff">
            <div style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1px">UMSA · DIPGIS</div>
            <div style="font-family:var(--font-display);font-size:20px;font-weight:800">Informe de Actividades SLIM</div>
            <div style="color:rgba(255,255,255,.6);font-size:13px">${periodoLabel(periodo)} · ${userDisplayName(user)}</div>
          </div>

          <div style="padding:24px">
            <div class="section-title mb-2">ACTIVIDADES DE PREVENCIÓN <span class="badge badge-blue">${prevs.length}</span></div>

            <div class="table-wrap mb-3">
              <table class="table" style="font-size:11px">
                <thead>
                  <tr>
                    <th>NOMBRE DE LA ACTIVIDAD</th>
                    <th>DESCRIPCIÓN Y RESULTADOS</th>
                    <th>POBLACIÓN ALCANZADA</th>
                    <th>EQUIPO MULTIDISCIPLINARIO</th>
                    <th>REDES SOCIALES</th>
                    <th>ENLACE DRIVE</th>
                  </tr>
                </thead>

                <tbody>${prevRows}</tbody>
              </table>
            </div>

            <div class="section-title mb-2">ACTIVIDADES DE ATENCIÓN <span class="badge badge-green">${atens.length}</span></div>

            <div class="table-wrap">
              <table class="table" style="font-size:11px">
                <thead>
                  <tr>
                    <th>ACTIVIDAD</th>
                    <th>DESCRIPCIÓN Y RESULTADOS</th>
                    <th>DEN. H</th>
                    <th>DEN. M</th>
                    <th>SEGUIMIENTO</th>
                    <th>TIPO DE CASO</th>
                    <th>TIPO DE DENUNCIA</th>
                    <th>ESTUDIANTES</th>
                  </tr>
                </thead>

                <tbody>${atenRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `);

    document.getElementById('export-btn')?.addEventListener('click', () => {
      descargarInforme(user.id, periodo);
    });

    document.getElementById('enviar-btn')?.addEventListener('click', async () => {
      await API.informes.enviar(informe.id);
      UI.toast('Informe enviado al DIPGIS ✅', 'success');
      Router.navigate('/estudiante/informe');
    });

  } catch(e) {
    mostrarErrorVista('No se pudo cargar el informe', e);
  }
});

/* ════════════════════════════════════════════════════════════════
   ADMIN: DASHBOARD
════════════════════════════════════════════════════════════════ */

Router.register('/admin/dashboard', async () => {
  UI.setTopbarTitle('Panel de Control DIPGIS');
  UI.renderLoading();

  const periodo = UI.getPeriodo();

  try {
    const [stats, usuarios] = await Promise.all([
      API.stats.resumen(periodo).catch(fallbackApi('estadísticas del dashboard', { ...EMPTY_STATS, periodo })),
      API.usuarios.listar().catch(fallbackApi('usuarios', [])),
    ]);

    const estudiantes = usuarios.filter(u => u.rol_id === 2);

    UI.render(`
      <div class="page-content animate-up">
        <div class="page-header">
          <div class="page-title">📊 Dashboard DIPGIS</div>
          <div class="page-subtitle">${periodoLabel(periodo)} · Resumen general</div>
        </div>

        <div class="grid grid-4 stagger mb-3">
          <div class="stat-card">
            <div class="stat-icon blue">🎯</div>
            <div>
              <div class="stat-label">Prevenciones</div>
              <div class="stat-value">${num(stats.prevenciones)}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">🤝</div>
            <div>
              <div class="stat-label">Atenciones</div>
              <div class="stat-value">${num(stats.atenciones)}</div>
              <div class="stat-sub">${num(stats.casos_nuevos)} nuevos · ${num(stats.seguimientos)} seguim.</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon yellow">👥</div>
            <div>
              <div class="stat-label">Población Alcanzada</div>
              <div class="stat-value">${num(stats.total_poblacion)}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon teal">🎓</div>
            <div>
              <div class="stat-label">Estudiantes</div>
              <div class="stat-value">${estudiantes.length}</div>
            </div>
          </div>
        </div>

        <div class="section-title">Accesos Rápidos</div>

        <div class="grid grid-4 stagger">
          <div class="quick-action" data-route="/admin/usuarios">
            <div class="qa-icon">👥</div>
            <div class="qa-label">Estudiantes</div>
            <div class="qa-sub">Crear y gestionar</div>
          </div>

          <div class="quick-action" data-route="/admin/territorio">
            <div class="qa-icon">🗺️</div>
            <div class="qa-label">Territorio</div>
            <div class="qa-sub">Municipios y grupos</div>
          </div>

          <div class="quick-action" data-route="/admin/informes">
            <div class="qa-icon">📋</div>
            <div class="qa-label">Informes</div>
            <div class="qa-sub">Revisar y aprobar</div>
          </div>

          <div class="quick-action" data-route="/admin/estadisticas">
            <div class="qa-icon">📈</div>
            <div class="qa-label">Estadísticas</div>
            <div class="qa-sub">Gráficos y datos</div>
          </div>
        </div>
      </div>
    `);

    bindRoutes();

  } catch(e) {
    mostrarErrorVista('No se pudo cargar el dashboard administrador', e);
  }
});

/* ════════════════════════════════════════════════════════════════
   ADMIN: USUARIOS
════════════════════════════════════════════════════════════════ */

Router.register('/admin/usuarios', async () => {
  UI.setTopbarTitle('Gestión de Estudiantes');

  async function renderPage() {
    UI.renderLoading();

    try {
      const [usuarios, municipios] = await Promise.all([
        API.usuarios.listar(),
        API.territorio.municipios.listar().catch(() => []),
      ]);

      const estudiantes = usuarios.filter(u => u.rol_id === 2);

      const munMap = {};
      municipios.forEach(m => {
        munMap[m.id] = m.nombre;
      });

      const rows = estudiantes.map(u => `
        <tr>
          <td>
            <div style="font-size:11px;color:var(--grey-400)">
              CI: ${u.ci} · RU: ${u.registro_universitario || 'Sin RU'}
              <br>
              Modalidad: ${u.modalidad || 'Sin modalidad'}
            </div>
          </td>

          <td>${u.celular || '—'}</td>

          <td>
            ${u.municipio_id
              ? munMap[u.municipio_id] || 'Municipio no encontrado'
              : '<span class="badge badge-yellow">Sin municipio</span>'}
          </td>

          <td>${u.sexo || '—'}</td>

          <td>
            <span class="badge ${u.activo ? 'badge-green' : 'badge-red'}">
              ${u.activo ? 'Activo' : 'Inactivo'}
            </span>
          </td>

          <td>
            <div class="flex gap-1">
              <button class="btn btn-ghost btn-sm btn-icon edit-usr" data-id="${u.id}">
                ✏️
              </button>

              <button class="btn btn-danger btn-sm btn-icon del-usr" data-id="${u.id}">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      UI.render(`
        <div class="page-content animate-up">
          <div class="page-header">
            <div class="page-header-top">
              <div>
                <div class="page-title">👥 Estudiantes</div>
                <div class="page-subtitle">${estudiantes.length} registrados</div>
              </div>

              <button class="btn btn-primary" id="add-btn">+ Agregar Estudiante</button>
            </div>
          </div>

          <div class="alert alert-info mb-2">
            <span class="alert-icon">ℹ️</span>
            <span>
              Desde aquí puedes crear estudiantes, editar sus datos y asignar o cambiar municipio.
            </span>
          </div>

          <div class="card">
            ${estudiantes.length === 0 ? `
              <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <div class="empty-state-title">Sin estudiantes</div>
              </div>
            ` : `
              <div class="table-wrap">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Nombre / CI</th>
                      <th>Celular</th>
                      <th>Municipio</th>
                      <th>Sexo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>${rows}</tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      `);

      function abrirModalEstudiante(estudiante = null) {
        const editing = !!estudiante;

        const munOpts = municipios.map(m => `
          <option value="${m.id}" ${estudiante?.municipio_id === m.id ? 'selected' : ''}>
            ${m.nombre}
          </option>
        `).join('');

        UI.modal({
          title: editing ? '✏️ Editar Estudiante' : '👤 Agregar Estudiante',

          body: `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">

              <div class="form-group" style="grid-column:1/-1">
                <label class="form-label">
                  NOMBRES Y APELLIDOS COMPLETOS <span class="required">*</span>
                </label>
                <input class="form-control" id="s-nombre"
                  value="${estudiante?.nombres_completos || ''}"
                  placeholder="Nombre Apellido Apellido" />
              </div>

              <div class="form-group">
                <label class="form-label">NÚMERO DE CARNET</label>
                <input class="form-control" id="s-ci"
                  value="${estudiante?.ci || ''}"
                  placeholder="Ej. 12345678"
                  ${editing ? 'readonly style="background:var(--off-white);cursor:not-allowed"' : ''} />
                ${editing ? '<span class="form-hint">El CI no se modifica desde esta pantalla.</span>' : ''}
              </div>

              <div class="form-group">
                <label class="form-label">REGISTRO UNIVERSITARIO</label>
                <input class="form-control" id="s-ru"
                  value="${estudiante?.registro_universitario || ''}"
                  placeholder="Ej. RU-12345" />
              </div>

              <div class="form-group">
                <label class="form-label">DIRECCIÓN DE CORREO ELECTRÓNICO</label>
                <input type="email" class="form-control" id="s-email"
                  value="${estudiante?.email || ''}"
                  placeholder="correo@umsa.bo" />
              </div>

              <div class="form-group">
                <label class="form-label">NÚMERO DE CELULAR</label>
                <input class="form-control" id="s-cel"
                  value="${estudiante?.celular || ''}"
                  placeholder="7xxxxxxx" />
              </div>

              <div class="form-group">
                <label class="form-label">SEXO</label>
                <select class="form-control" id="s-sexo">
                  <option value="">— Seleccionar —</option>
                  <option value="F" ${estudiante?.sexo === 'F' ? 'selected' : ''}>F — Femenino</option>
                  <option value="M" ${estudiante?.sexo === 'M' ? 'selected' : ''}>M — Masculino</option>
                  <option value="Otro" ${estudiante?.sexo === 'Otro' ? 'selected' : ''}>Otro</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">FECHA DE NACIMIENTO</label>
                <input type="date" class="form-control" id="s-fnac"
                  value="${estudiante?.fecha_nacimiento || ''}" />
              </div>

              <div class="form-group">
                <label class="form-label">CARRERA</label>
                <select class="form-control" id="s-carrera">
                  <option value="">— Seleccionar —</option>
                  <option value="1" ${estudiante?.carrera_id === 1 ? 'selected' : ''}>Trabajo Social</option>
                  <option value="2" ${estudiante?.carrera_id === 2 ? 'selected' : ''}>Psicología</option>
                  <option value="3" ${estudiante?.carrera_id === 3 ? 'selected' : ''}>Derecho</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">MODALIDAD</label>

                <select class="form-control" id="s-modalidad">
                  <option value="">— Seleccionar —</option>

                  <option value="TRABAJO DIRIGIDO" ${estudiante?.modalidad === 'TRABAJO DIRIGIDO' ? 'selected' : ''}>
                    Trabajo Dirigido
                  </option>

                  <option value="INTERNADO ROTATORIO" ${estudiante?.modalidad === 'INTERNADO ROTATORIO' ? 'selected' : ''}>
                    Internado Rotatorio
                  </option>

                  <option value="PRÁCTICAS PRE PROFESIONALES" ${estudiante?.modalidad === 'PRÁCTICAS PRE PROFESIONALES' ? 'selected' : ''}>
                    Prácticas Pre Profesionales
                  </option>
                </select>

                <span class="form-hint">
                  Selecciona la modalidad académica del estudiante.
                </span>
              </div>

              <div class="form-group">
                <label class="form-label">MUNICIPIO ASIGNADO</label>
                <select class="form-control" id="s-mun">
                  <option value="">— Sin municipio —</option>
                  ${munOpts}
                </select>
                <span class="form-hint">
                  Aquí puedes asignar o cambiar el municipio del estudiante.
                </span>
              </div>

              ${editing ? '' : `
                <div class="form-group" style="grid-column:1/-1">
                  <label class="form-label">
                    CONTRASEÑA INICIAL <span class="required">*</span>
                  </label>
                  <input type="password" class="form-control" id="s-pw"
                    placeholder="Mínimo 6 caracteres" />
                  <span class="form-hint">Recomendado: últimos 4 dígitos del CI.</span>
                </div>
              `}

            </div>

            <div id="add-error" style="color:var(--red);font-size:12px;display:none"></div>
          `,

          actions: [
            {
              id: 'cancel',
              label: 'Cancelar',
              cls: 'btn-ghost',
              onClick: UI.closeModal
            },

            {
              id: 'save',
              label: editing ? '💾 Guardar Cambios' : '✅ Agregar Estudiante',
              cls: 'btn-primary',

              onClick: async () => {
                const nombre = document.getElementById('s-nombre').value.trim();
                const ci     = document.getElementById('s-ci').value.trim();
                const err    = document.getElementById('add-error');

                err.style.display = 'none';

                if (!nombre) {
                  err.textContent = 'Debes ingresar los nombres y apellidos completos del estudiante.';
                  err.style.display = 'block';
                  document.getElementById('s-nombre')?.focus();
                  return;
                }

                const munId = document.getElementById('s-mun').value;
                const carreraId = document.getElementById('s-carrera').value;

                const data = {
                  nombres_completos: nombre,
                  email:                  document.getElementById('s-email').value || null,
                  celular:                document.getElementById('s-cel').value || null,
                  modalidad:              document.getElementById('s-modalidad').value || null,
                  sexo:                   document.getElementById('s-sexo').value || null,
                  fecha_nacimiento:       document.getElementById('s-fnac').value || null,
                  registro_universitario: document.getElementById('s-ru').value || null,
                  carrera_id:             carreraId ? parseInt(carreraId) : null,
                  municipio_id:           munId ? parseInt(munId) : null,
                };

                if (!editing) {
                  const pw = document.getElementById('s-pw').value;

                  if (!ci || !pw) {
                    err.textContent = 'Para crear un estudiante debes ingresar CI y contraseña inicial.';
                    err.style.display = 'block';

                    if (!ci) {
                      document.getElementById('s-ci')?.focus();
                    } else {
                      document.getElementById('s-pw')?.focus();
                    }

                    return;
                  }

                  if (pw.length < 6) {
                    err.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                    err.style.display = 'block';
                    return;
                  }

                  data.ci = ci;
                  data.password = pw;
                  data.rol_id = 2;
                }

                try {
                  if (editing) {
                    await API.usuarios.actualizar(estudiante.id, data);
                    UI.toast('Estudiante actualizado correctamente ✅', 'success');
                  } else {
                    await API.usuarios.crear(data);
                    UI.toast(`Estudiante ${nombre} agregado ✅`, 'success');
                  }

                  UI.closeModal();
                  renderPage();

                } catch(e) {
                  err.textContent = e.message;
                  err.style.display = 'block';
                }
              }
            },
          ]
        });
      }

      document.getElementById('add-btn').addEventListener('click', () => {
        abrirModalEstudiante(null);
      });

      document.querySelectorAll('.edit-usr').forEach(el => {
        el.addEventListener('click', () => {
          const estudiante = estudiantes.find(u => u.id === parseInt(el.dataset.id));

          if (!estudiante) {
            UI.toast('Estudiante no encontrado', 'error');
            return;
          }

          abrirModalEstudiante(estudiante);
        });
      });

      document.querySelectorAll('.del-usr').forEach(el => {
        el.addEventListener('click', () => {
          UI.confirm({
            title: 'Desactivar Estudiante',
            body: '¿Seguro que deseas desactivar este estudiante?',
            danger: true,

            onConfirm: async () => {
              await API.usuarios.desactivar(parseInt(el.dataset.id));
              UI.toast('Estudiante desactivado', 'info');
              renderPage();
            }
          });
        });
      });

    } catch(e) {
      mostrarErrorVista('No se pudieron cargar los usuarios', e);
    }
  }

  renderPage();
});

/* ════════════════════════════════════════════════════════════════
   ADMIN: TERRITORIO
════════════════════════════════════════════════════════════════ */

Router.register('/admin/territorio', async () => {
  UI.setTopbarTitle('Gestión de Territorio');
  UI.renderLoading();

  try {
    const municipios = await API.territorio.municipios.listar();

    const mRows = municipios.map(m => `
      <tr>
        <td>
          <strong>${m.nombre}</strong>
        </td>

        <td>
          <span class="badge ${m.activo ? 'badge-green' : 'badge-grey'}">
            ${m.activo ? 'Activo' : 'Inactivo'}
          </span>
        </td>

        <td style="text-align:right">
          <button 
            class="btn btn-ghost btn-sm btn-toggle-municipio"
            data-id="${m.id}"
            data-nombre="${m.nombre}"
            data-activo="${m.activo ? '1' : '0'}">
            ${m.activo ? 'Desactivar' : 'Activar'}
          </button>
        </td>
      </tr>
    `).join('') || `
      <tr>
        <td colspan="3" class="text-center text-soft" style="padding:20px">
          Sin municipios
        </td>
      </tr>
    `;

    UI.render(`
      <div class="page-content animate-up">
        <div class="page-header">
          <div>
            <div class="page-title">🗺️ Territorio</div>
            <div class="text-soft">
              Administra los municipios disponibles para los registros del sistema.
            </div>
          </div>
        </div>

        <div class="card" style="max-width:900px">
          <div class="card-header">
            <div>
              <div class="card-title">Municipios</div>
              <div class="text-soft text-sm">
                Puedes activar o desactivar municipios sin eliminarlos del sistema.
              </div>
            </div>

            <button class="btn btn-primary btn-sm" id="add-mun-btn">
              + Agregar
            </button>
          </div>

          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th style="text-align:right">Acción</th>
                </tr>
              </thead>

              <tbody>${mRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `);

    document.getElementById('add-mun-btn')?.addEventListener('click', () => {
      UI.modal({
        title: 'Agregar Municipio',
        body: `
          <div class="form-group">
            <label class="form-label">Nombre <span class="required">*</span></label>
            <input class="form-control" id="mun-nombre" placeholder="Ej. La Paz" />
          </div>
        `,
        actions: [
          {
            id: 'cancel',
            label: 'Cancelar',
            cls: 'btn-ghost',
            onClick: UI.closeModal
          },
          {
            id: 'save',
            label: 'Agregar',
            cls: 'btn-primary',
            onClick: async () => {
              const n = document.getElementById('mun-nombre').value.trim();

              if (!n) {
                UI.toast('Escribe el nombre del municipio', 'warning');
                return;
              }

              await API.territorio.municipios.crear({ nombre: n });

              UI.closeModal();
              UI.toast('Municipio creado', 'success');
              Router.navigate('/admin/territorio');
            }
          },
        ]
      });
    });

    document.querySelectorAll('.btn-toggle-municipio').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.id);
        const nombre = btn.dataset.nombre;
        const activoActual = btn.dataset.activo === '1';
        const nuevoEstado = !activoActual;

        UI.confirm({
          title: nuevoEstado ? 'Activar municipio' : 'Desactivar municipio',
          body: `¿Seguro que deseas ${nuevoEstado ? 'activar' : 'desactivar'} el municipio "${nombre}"?`,
          danger: !nuevoEstado,
          onConfirm: async () => {
            await API.territorio.municipios.actualizar(id, {
              activo: nuevoEstado
            });

            UI.toast(
              nuevoEstado ? 'Municipio activado' : 'Municipio desactivado',
              'success'
            );

            Router.navigate('/admin/territorio');
          }
        });
      });
    });

  } catch(e) {
    mostrarErrorVista('No se pudo cargar territorio', e);
  }
});

/* ════════════════════════════════════════════════════════════════
   ADMIN: INFORMES
════════════════════════════════════════════════════════════════ */

Router.register('/admin/informes', async () => {
  UI.setTopbarTitle('Revisión de Informes');
  UI.renderLoading();

  const periodo = UI.getPeriodo();

  try {
    const [informes, usuarios] = await Promise.all([
      API.informes.listar(`?periodo=${encodeURIComponent(periodo)}`),
      API.usuarios.listar(),
    ]);

    const uMap = {};
    usuarios.forEach(u => {
      uMap[u.id] = u;
    });

    const rows = informes.map(inf => {
      const u = uMap[inf.usuario_id] || {};

      const badge = {
        BORRADOR: '<span class="badge badge-grey">Borrador</span>',
        ENVIADO:  '<span class="badge badge-yellow">Enviado</span>',
        APROBADO: '<span class="badge badge-green">Aprobado ✅</span>',
        RECHAZADO:'<span class="badge badge-red">Rechazado</span>',
      }[inf.estado] || '';

      return `
        <tr>
          <td><strong>${u.nombres_completos || '—'}</strong></td>
          <td>${inf.periodo}</td>
          <td>${badge}</td>
          <td>${inf.fecha_envio ? new Date(inf.fecha_envio).toLocaleDateString('es-BO') : '—'}</td>
          <td>
            <div class="flex gap-1">
              <button class="btn btn-ghost btn-sm dl-btn" data-uid="${inf.usuario_id}" data-periodo="${inf.periodo}">📥 .docx</button>
              ${inf.estado === 'ENVIADO'
                ? `<button class="btn btn-primary btn-sm aprobar-btn" data-id="${inf.id}">✅ Aprobar</button>`
                : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="5" class="text-center text-soft" style="padding:24px">Sin informes para este periodo</td></tr>';

    UI.render(`
      <div class="page-content animate-up">
        <div class="page-header">
          <div class="page-title">📋 Revisión de Informes</div>
          <div class="page-subtitle">${periodoLabel(periodo)}</div>
        </div>

        <div class="card">
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Periodo</th>
                  <th>Estado</th>
                  <th>Fecha Envío</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `);

    document.querySelectorAll('.dl-btn').forEach(el => {
      el.addEventListener('click', () => {
        descargarInforme(el.dataset.uid, el.dataset.periodo);
      });
    });

    document.querySelectorAll('.aprobar-btn').forEach(el => {
      el.addEventListener('click', () => {
        UI.modal({
          title: '✅ Aprobar Informe',
          body: `
            <div class="form-group">
              <label class="form-label">Observaciones</label>
              <textarea class="form-control" id="obs-txt" placeholder="Comentarios al estudiante..."></textarea>
            </div>
          `,
          actions: [
            {
              id: 'cancel',
              label: 'Cancelar',
              cls: 'btn-ghost',
              onClick: UI.closeModal
            },
            {
              id: 'ok',
              label: '✅ Aprobar',
              cls: 'btn-primary',
              onClick: async () => {
                await API.informes.aprobar(parseInt(el.dataset.id), {
                  observaciones: document.getElementById('obs-txt').value
                });

                UI.closeModal();
                UI.toast('Informe aprobado', 'success');
                Router.navigate('/admin/informes');
              }
            },
          ]
        });
      });
    });

  } catch(e) {
    mostrarErrorVista('No se pudieron cargar los informes', e);
  }
});

/* ════════════════════════════════════════════════════════════════
   ADMIN: ESTADÍSTICAS
════════════════════════════════════════════════════════════════ */

Router.register('/admin/estadisticas', async () => {
  UI.setTopbarTitle('Estadísticas');
  UI.renderLoading();

  const periodo = UI.getPeriodo();
  const municipioFiltro = sessionStorage.getItem('stats_municipio_id') || '';

  function barra(label, value, max, extra = '') {
    const v = num(value);
    const m = Math.max(num(max), 1);
    const width = v > 0 ? Math.max((v / m) * 100, 8) : 0;

    return `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:5px">
          <span style="font-size:12px;font-weight:800;color:var(--grey-500)">${label}</span>
          <span style="font-size:12px;font-weight:900;color:#0f2342">${v}${extra ? ` · ${extra}` : ''}</span>
        </div>

        <div style="height:14px;background:var(--grey-100);border-radius:999px;overflow:hidden">
          <div style="height:100%;width:${width}%;background:linear-gradient(90deg,var(--blue),var(--teal));border-radius:999px"></div>
        </div>
      </div>
    `;
  }

  function listaBarras(items, labelKey = 'label', valueKey = 'total', empty = 'Sin datos') {
    if (!items || items.length === 0) {
      return `<p class="text-soft">${empty}</p>`;
    }

    const max = Math.max(...items.map(i => num(i[valueKey])), 1);

    return items.map(i => barra(i[labelKey], i[valueKey], max)).join('');
  }

  function statMini(icon, label, value, sub = '') {
    return `
      <div class="stat-card">
        <div class="stat-icon blue">${icon}</div>
        <div>
          <div class="stat-label">${label}</div>
          <div class="stat-value">${num(value)}</div>
          ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
        </div>
      </div>
    `;
  }

  try {
    const data = await API.stats.panel(periodo, municipioFiltro)
      .catch(fallbackApi('panel estadístico', null));

    if (!data) {
      UI.render(`
        <div class="page-content">
          <div class="empty-state">
            <div class="empty-state-icon">📈</div>
            <div class="empty-state-title">No se pudieron cargar las estadísticas</div>
          </div>
        </div>
      `);
      return;
    }

    const municipiosOptions = data.municipios.map(m => `
      <option value="${m.id}" ${String(m.id) === String(municipioFiltro) ? 'selected' : ''}>
        ${m.nombre}
      </option>
    `).join('');

    const general = data.general || {};
    const prev = data.prevencion || {};
    const aten = data.atencion || {};
    const comp = data.comparativo || {};

    const maxGeneral = Math.max(
      num(general.prevenciones),
      num(general.atenciones),
      num(general.mujeres),
      num(general.hombres),
      num(general.total_impacto),
      1
    );

    const maxPrevGenero = Math.max(num(prev.mujeres), num(prev.hombres), num(prev.total), 1);
    const maxAtenGenero = Math.max(num(aten.mujeres), num(aten.hombres), num(aten.total), 1);
    const maxComp = Math.max(num(comp.prevencion_total), num(comp.atencion_total), 1);

    const grupos = prev.grupos_especiales || {};

    const municipiosPrevencion = (prev.por_municipio || []).map(m => ({
      label: m.municipio,
      total: num(m.actividades),
      extra: `${num(m.total)} personas`,
    }));

    const maxMun = Math.max(...municipiosPrevencion.map(m => num(m.total)), 1);

    const prevMunicipioBars = municipiosPrevencion.length
      ? municipiosPrevencion.map(m => barra(m.label, m.total, maxMun, m.extra)).join('')
      : '<p class="text-soft">Sin datos de prevención por municipio.</p>';

    UI.render(`
      <div class="page-content animate-up">
        <div class="page-header">
          <div>
            <div class="page-title">📈 Estadísticas</div>
            <div class="page-subtitle">
              ${periodoLabel(periodo)} · ${data.municipio_nombre || 'Todos los municipios'}
            </div>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label">Filtrar por municipio</label>

                <select class="form-control" id="stats-municipio">
                  <option value="">Todos los municipios</option>
                  ${municipiosOptions}
                </select>

                <span class="form-hint">
                  Selecciona un municipio para ver solo sus datos.
                </span>
              </div>

              <div class="form-group">
                <label class="form-label">Periodo consultado</label>
                <input class="form-control" value="${periodoLabel(periodo)}" readonly />
                <span class="form-hint">
                  El periodo se cambia desde la barra superior.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="section-title">Resumen general del periodo</div>

        <div class="grid grid-4 stagger mb-3">
          ${statMini('🎯', 'Prevenciones', general.prevenciones)}
          ${statMini('🤝', 'Atenciones', general.atenciones)}
          ${statMini('♀', 'Mujeres', general.mujeres)}
          ${statMini('♂', 'Hombres', general.hombres)}
        </div>

        <div class="card mb-3">
          <div class="card-header">
            <div class="card-title">📊 Vista general en barras</div>
          </div>

          <div class="card-body">
            ${barra('Actividades de prevención', general.prevenciones, maxGeneral)}
            ${barra('Actividades de atención', general.atenciones, maxGeneral)}
            ${barra('Mujeres registradas', general.mujeres, maxGeneral)}
            ${barra('Hombres registrados', general.hombres, maxGeneral)}
            ${barra('Impacto total registrado', general.total_impacto, maxGeneral)}
          </div>
        </div>

        <div class="grid grid-2 mb-3">
          <div class="card">
            <div class="card-header">
              <div class="card-title">🎯 Prevención</div>
            </div>

            <div class="card-body">
              <div class="grid grid-2 mb-2">
                ${statMini('📌', 'Actividades', prev.actividades)}
                ${statMini('👥', 'Población total', prev.total)}
              </div>

              <div class="section-title">Población alcanzada</div>
              ${barra('Mujeres alcanzadas', prev.mujeres, maxPrevGenero)}
              ${barra('Hombres alcanzados', prev.hombres, maxPrevGenero)}
              ${barra('Total población', prev.total, maxPrevGenero)}

              <div class="section-title">Grupos especiales</div>
              ${barra('Niñez / adolescencia', grupos.ninez || 0, Math.max(num(grupos.ninez), num(grupos.adulto_mayor), num(grupos.discapacidad), 1), 'actividades')}
              ${barra('Adulto mayor', grupos.adulto_mayor || 0, Math.max(num(grupos.ninez), num(grupos.adulto_mayor), num(grupos.discapacidad), 1), 'actividades')}
              ${barra('Personas con discapacidad', grupos.discapacidad || 0, Math.max(num(grupos.ninez), num(grupos.adulto_mayor), num(grupos.discapacidad), 1), 'actividades')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">🤝 Atención</div>
            </div>

            <div class="card-body">
              <div class="grid grid-2 mb-2">
                ${statMini('📌', 'Atenciones', aten.atenciones)}
                ${statMini('👥', 'Denunciantes', aten.total)}
              </div>

              <div class="section-title">Denunciantes por género</div>
              ${barra('Mujeres denunciantes', aten.mujeres, maxAtenGenero)}
              ${barra('Hombres denunciantes', aten.hombres, maxAtenGenero)}
              ${barra('Total denunciantes', aten.total, maxAtenGenero)}

              <div class="section-title">Estado del caso</div>
              ${barra('Casos nuevos', aten.casos_nuevos, Math.max(num(aten.casos_nuevos), num(aten.seguimientos), 1))}
              ${barra('Seguimientos', aten.seguimientos, Math.max(num(aten.casos_nuevos), num(aten.seguimientos), 1))}
            </div>
          </div>
        </div>

        <div class="grid grid-2 mb-3">
          <div class="card">
            <div class="card-header">
              <div class="card-title">🗺️ Actividades de prevención por municipio</div>
            </div>

            <div class="card-body">
              ${prevMunicipioBars}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">⚖️ Atención por tipo de caso</div>
            </div>

            <div class="card-body">
              ${listaBarras(aten.por_tipo_caso)}
            </div>
          </div>
        </div>

        <div class="grid grid-2 mb-3">
          <div class="card">
            <div class="card-header">
              <div class="card-title">🔍 Atención por tipo de denuncia</div>
            </div>

            <div class="card-body">
              ${listaBarras(aten.por_tipo_denuncia)}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">🏛️ Atención por institución</div>
            </div>

            <div class="card-body">
              ${listaBarras(aten.por_institucion)}
            </div>
          </div>
        </div>

        <div class="section-title">Comparativo general</div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">📌 Prevención vs Atención</div>
          </div>

          <div class="card-body">
            ${barra('Población alcanzada en prevención', comp.prevencion_total, maxComp)}
            ${barra('Personas denunciantes en atención', comp.atencion_total, maxComp)}
            ${barra('Impacto total registrado', comp.impacto_total, Math.max(num(comp.impacto_total), 1))}
          </div>
        </div>
      </div>
    `);

    document.getElementById('stats-municipio')?.addEventListener('change', e => {
      sessionStorage.setItem('stats_municipio_id', e.target.value);
      Router.navigate('/admin/estadisticas');
    });

  } catch(e) {
    mostrarErrorVista('No se pudieron cargar las estadísticas', e);
  }
});

/* ════════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════════ */

(function init() {
  const user = Auth.getUser();

  UI.renderSidebar(user);
  UI.renderTopbar(user);

  activarBotonPeriodo();

  const observer = new MutationObserver(() => {
    activarBotonPeriodo();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  Router.start();
})();
