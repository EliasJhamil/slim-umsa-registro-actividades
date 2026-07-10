-- DATOS DE PRUEBA SLIM-UMSA
-- Periodos: 2026-06 y 2026-07
-- Crea 5 estudiantes de prueba, 12 registros de prevención y 12 registros de atención.
-- Total: 24 registros de actividad.
-- Usuario principal solicitado:
--   CI: 9870322
--   Contraseña: 123456
-- Ejecutar sobre la base slim_db con usuario slim_user.

BEGIN;

-- Por si tu versión ya tiene modalidad o todavía no la tiene.
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS modalidad VARCHAR(80);

-- Catálogos mínimos
INSERT INTO roles (nombre) VALUES ('ADMIN') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO roles (nombre) VALUES ('ESTUDIANTE') ON CONFLICT (nombre) DO NOTHING;

INSERT INTO carreras (nombre, descripcion) VALUES
  ('Trabajo Social', NULL),
  ('Derecho', NULL),
  ('Psicologia', NULL)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO municipios (nombre, activo) VALUES
  ('La Paz', true),
  ('El Alto', true),
  ('Viacha', true),
  ('Achocalla', true),
  ('Mecapaca', true)
ON CONFLICT (nombre) DO NOTHING;

-- Limpieza previa SOLO de estos datos de prueba.
-- Esto permite ejecutar el archivo varias veces sin duplicar registros.
DELETE FROM actividades_atencion
WHERE usuario_id IN (
  SELECT id FROM usuarios WHERE ci IN ('9870322','910002','910003','910004','910005')
);

DELETE FROM actividades_prevencion
WHERE usuario_id IN (
  SELECT id FROM usuarios WHERE ci IN ('9870322','910002','910003','910004','910005')
);

DELETE FROM informes
WHERE usuario_id IN (
  SELECT id FROM usuarios WHERE ci IN ('9870322','910002','910003','910004','910005')
);

DELETE FROM usuarios
WHERE ci IN ('9870322','910002','910003','910004','910005');

-- Hash bcrypt para contraseña: 123456
-- Los 5 usuarios de prueba usan la misma contraseña para facilitar las pruebas.
INSERT INTO usuarios (
  ci, password_hash, rol_id, activo, email, nombres_completos,
  sexo, fecha_nacimiento, registro_universitario, celular,
  modalidad, carrera_id, municipio_id
) VALUES
(
  '9870322',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'jose.daniel.prueba@umsa.bo',
  'Jose Daniel Coya Nina',
  'M',
  '2002-04-18',
  'RU-9870322',
  '71234567',
  'PRÁCTICAS PRE PROFESIONALES',
  (SELECT id FROM carreras WHERE nombre = 'Trabajo Social'),
  (SELECT id FROM municipios WHERE nombre = 'La Paz')
),
(
  '910002',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'ana.quispe.juniojulio@umsa.bo',
  'Ana María Quispe Choque',
  'F',
  '2001-09-12',
  'RU-910002',
  '70000002',
  'TRABAJO DIRIGIDO',
  (SELECT id FROM carreras WHERE nombre = 'Derecho'),
  (SELECT id FROM municipios WHERE nombre = 'El Alto')
),
(
  '910003',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'valeria.rojas.juniojulio@umsa.bo',
  'Valeria Rojas Lima',
  'F',
  '2000-11-05',
  'RU-910003',
  '70000003',
  'INTERNADO ROTATORIO',
  (SELECT id FROM carreras WHERE nombre = 'Psicologia'),
  (SELECT id FROM municipios WHERE nombre = 'Viacha')
),
(
  '910004',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'diego.condori.juniojulio@umsa.bo',
  'Diego Condori Paredes',
  'M',
  '2003-01-19',
  'RU-910004',
  '70000004',
  'PRÁCTICAS PRE PROFESIONALES',
  (SELECT id FROM carreras WHERE nombre = 'Trabajo Social'),
  (SELECT id FROM municipios WHERE nombre = 'Achocalla')
),
(
  '910005',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'camila.nina.juniojulio@umsa.bo',
  'Camila Nina Apaza',
  'F',
  '2002-06-30',
  'RU-910005',
  '70000005',
  'TRABAJO DIRIGIDO',
  (SELECT id FROM carreras WHERE nombre = 'Derecho'),
  (SELECT id FROM municipios WHERE nombre = 'Mecapaca')
);

-- ════════════════════════════════════════════════════════════════
-- PREVENCIÓN: 12 registros, junio y julio
-- ════════════════════════════════════════════════════════════════

INSERT INTO actividades_prevencion (
  usuario_id, asignacion_id, periodo, fecha, nombre, descripcion,
  poblacion_mujeres, poblacion_hombres,
  poblacion_ninez, poblacion_adulto_mayor, poblacion_discapacidad,
  participantes, url_redes, url_drive
) VALUES
-- Junio: usuario principal 9870322
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-03', 'Charla informativa Ley 348', 'Socialización de derechos, rutas de denuncia y medidas de protección con vecinos de la zona Central.', 18, 12, true, false, false, 'Ana María Quispe Choque', 'https://facebook.com/slim/prueba-jun-prev-001', 'https://drive.google.com/prueba-jun-prev-001'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-10', 'Taller de prevención de violencia familiar', 'Taller participativo con madres y padres de familia sobre señales de violencia y canales de ayuda.', 24, 9, false, false, false, 'Valeria Rojas Lima', 'https://facebook.com/slim/prueba-jun-prev-002', 'https://drive.google.com/prueba-jun-prev-002'),

-- Junio: otros estudiantes
((SELECT id FROM usuarios WHERE ci='910002'), NULL, '2026-06', '2026-06-05', 'Campaña de sensibilización comunitaria', 'Campaña informativa en plaza principal sobre denuncia oportuna y servicios municipales.', 28, 17, false, true, false, 'Jose Daniel Coya Nina', 'https://facebook.com/slim/prueba-jun-prev-003', 'https://drive.google.com/prueba-jun-prev-003'),
((SELECT id FROM usuarios WHERE ci='910003'), NULL, '2026-06', '2026-06-12', 'Actividad preventiva en unidad educativa', 'Sesión con estudiantes sobre buen trato, respeto y prevención de violencia escolar.', 31, 29, true, false, false, 'Camila Nina Apaza', 'https://facebook.com/slim/prueba-jun-prev-004', 'https://drive.google.com/prueba-jun-prev-004'),
((SELECT id FROM usuarios WHERE ci='910004'), NULL, '2026-06', '2026-06-18', 'Feria de servicios municipales', 'Participación en feria interinstitucional con orientación preventiva y entrega de material informativo.', 21, 16, true, true, true, 'Ana María Quispe Choque', 'https://facebook.com/slim/prueba-jun-prev-005', 'https://drive.google.com/prueba-jun-prev-005'),
((SELECT id FROM usuarios WHERE ci='910005'), NULL, '2026-06', '2026-06-25', 'Prevención de violencia económica', 'Explicación de violencia económica, señales de alerta y orientación para solicitar apoyo institucional.', 20, 8, false, false, true, 'Diego Condori Paredes', 'https://facebook.com/slim/prueba-jun-prev-006', 'https://drive.google.com/prueba-jun-prev-006'),

-- Julio: usuario principal 9870322
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-02', 'Prevención de violencia digital', 'Actividad educativa sobre ciberacoso, riesgos digitales y canales de ayuda para adolescentes y familias.', 22, 18, true, false, true, 'Camila Nina Apaza', 'https://facebook.com/slim/prueba-jul-prev-001', 'https://drive.google.com/prueba-jul-prev-001'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-09', 'Feria educativa comunitaria', 'Feria de información preventiva con material impreso y orientación breve a la población.', 35, 20, true, true, false, 'Diego Condori Paredes', 'https://facebook.com/slim/prueba-jul-prev-002', 'https://drive.google.com/prueba-jul-prev-002'),

-- Julio: otros estudiantes
((SELECT id FROM usuarios WHERE ci='910002'), NULL, '2026-07', '2026-07-04', 'Socialización de rutas de denuncia', 'Explicación de pasos básicos para denunciar y solicitar orientación legal, social y psicológica.', 19, 14, false, false, false, 'Jose Daniel Coya Nina', 'https://facebook.com/slim/prueba-jul-prev-003', 'https://drive.google.com/prueba-jul-prev-003'),
((SELECT id FROM usuarios WHERE ci='910003'), NULL, '2026-07', '2026-07-11', 'Capacitación sobre derechos de la mujer', 'Capacitación a organización vecinal sobre derechos, protección y redes de apoyo.', 27, 10, false, false, true, 'Ana María Quispe Choque', 'https://facebook.com/slim/prueba-jul-prev-004', 'https://drive.google.com/prueba-jul-prev-004'),
((SELECT id FROM usuarios WHERE ci='910004'), NULL, '2026-07', '2026-07-16', 'Taller de prevención de violencia psicológica', 'Actividad grupal para identificar señales de violencia psicológica y formas de pedir ayuda.', 25, 13, false, true, false, 'Valeria Rojas Lima', 'https://facebook.com/slim/prueba-jul-prev-005', 'https://drive.google.com/prueba-jul-prev-005'),
((SELECT id FROM usuarios WHERE ci='910005'), NULL, '2026-07', '2026-07-22', 'Campaña informativa Ley 348', 'Difusión comunitaria de la Ley 348 y servicios de apoyo municipal.', 23, 15, false, false, false, 'Jose Daniel Coya Nina', 'https://facebook.com/slim/prueba-jul-prev-006', 'https://drive.google.com/prueba-jul-prev-006');

-- ════════════════════════════════════════════════════════════════
-- ATENCIÓN: 12 registros, junio y julio
-- ════════════════════════════════════════════════════════════════

INSERT INTO actividades_atencion (
  usuario_id, asignacion_id, periodo, fecha, tipo_actividad, descripcion,
  denunciantes_h, denunciantes_m, seguimiento,
  tipo_caso, tipo_denuncia, participantes, institucion
) VALUES
-- Junio: usuario principal 9870322
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-04', 'Orientación en Plataforma', 'Se brindó orientación inicial y explicación de ruta de atención.', 0, 1, 0, 'Caso Nuevo', 'Violencia Psicológica', 'Ana María Quispe Choque', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-14', 'Seguimiento de caso', 'Seguimiento telefónico y orientación sobre documentación pendiente.', 1, 0, 1, 'Seguimiento', 'Asistencia Familiar', 'Valeria Rojas Lima', 'Juzgado de Familia'),

-- Junio: otros estudiantes
((SELECT id FROM usuarios WHERE ci='910002'), NULL, '2026-06', '2026-06-06', 'Orientación legal', 'Orientación sobre requisitos para iniciar proceso y medidas de protección.', 0, 1, 0, 'Caso Nuevo', 'Violencia Económica', 'Jose Daniel Coya Nina', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='910003'), NULL, '2026-06', '2026-06-13', 'Atención psicológica inicial', 'Contención emocional inicial y orientación para continuidad de atención.', 0, 1, 0, 'Orientación en Plataforma', 'Violencia Sexual', 'Camila Nina Apaza', 'Fiscalía'),
((SELECT id FROM usuarios WHERE ci='910004'), NULL, '2026-06', '2026-06-20', 'Visita Domiciliaria', 'Visita domiciliaria para verificación social y orientación familiar.', 1, 1, 0, 'Caso Nuevo', 'Violencia Patrimonial', 'Ana María Quispe Choque', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='910005'), NULL, '2026-06', '2026-06-26', 'Derivación institucional', 'Se realizó derivación para valoración psicológica complementaria.', 0, 1, 1, 'Seguimiento', 'Violencia Física', 'Diego Condori Paredes', 'DNA'),

-- Julio: usuario principal 9870322
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-03', 'Entrevista', 'Entrevista social inicial y registro de antecedentes generales del caso.', 0, 1, 0, 'Caso Nuevo', 'Violencia Física', 'Ana María Quispe Choque', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-15', 'Acompañamiento', 'Acompañamiento a instancia policial para consulta del estado del caso.', 0, 1, 1, 'Seguimiento', 'Violencia Psicológica', 'Camila Nina Apaza', 'Policía'),

-- Julio: otros estudiantes
((SELECT id FROM usuarios WHERE ci='910002'), NULL, '2026-07', '2026-07-05', 'Conciliación', 'Apoyo en orientación previa a audiencia de conciliación.', 1, 0, 0, 'Caso Nuevo', 'Asistencia Familiar', 'Jose Daniel Coya Nina', 'Juzgado de Familia'),
((SELECT id FROM usuarios WHERE ci='910003'), NULL, '2026-07', '2026-07-12', 'Seguimiento de caso', 'Revisión de avances y coordinación con institución derivada.', 0, 1, 1, 'Seguimiento', 'Violencia Digital', 'Ana María Quispe Choque', 'Defensoría'),
((SELECT id FROM usuarios WHERE ci='910004'), NULL, '2026-07', '2026-07-18', 'Patrocinio Legal', 'Apoyo en preparación de documentación para trámite legal.', 0, 1, 1, 'Seguimiento', 'Violencia Económica', 'Valeria Rojas Lima', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='910005'), NULL, '2026-07', '2026-07-23', 'Orientación en Plataforma', 'Atención inicial, identificación de necesidad y orientación a servicio correspondiente.', 1, 0, 0, 'Caso Nuevo', 'Guarda y Tenencia', 'Diego Condori Paredes', 'DNA');

-- Informes borrador para junio y julio.
INSERT INTO informes (usuario_id, periodo, estado)
SELECT id, periodo, 'BORRADOR'
FROM usuarios
CROSS JOIN (VALUES ('2026-06'), ('2026-07')) AS p(periodo)
WHERE ci IN ('9870322','910002','910003','910004','910005');

COMMIT;
