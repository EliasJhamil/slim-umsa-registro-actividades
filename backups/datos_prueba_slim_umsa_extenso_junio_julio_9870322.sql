-- DATOS DE PRUEBA EXTENSOS Y VARIADOS SLIM-UMSA
-- Periodos: 2026-06 y 2026-07
-- Usuario principal:
--   CI: 9870322
--   Contraseña: 123456
-- Contenido:
--   10 estudiantes de prueba
--   44 registros de prevención
--   64 registros de atención
--   108 actividades en total
--   20 informes de prueba
-- Este archivo reemplaza los datos de prueba anteriores de los CI 910002-910005 y 920002-920010.

BEGIN;

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

-- Limpieza previa SOLO de datos de prueba.
DELETE FROM actividades_atencion
WHERE usuario_id IN (SELECT id FROM usuarios WHERE ci IN ('9870322','910002','910003','910004','910005','920002','920003','920004','920005','920006','920007','920008','920009','920010'));

DELETE FROM actividades_prevencion
WHERE usuario_id IN (SELECT id FROM usuarios WHERE ci IN ('9870322','910002','910003','910004','910005','920002','920003','920004','920005','920006','920007','920008','920009','920010'));

DELETE FROM informes
WHERE usuario_id IN (SELECT id FROM usuarios WHERE ci IN ('9870322','910002','910003','910004','910005','920002','920003','920004','920005','920006','920007','920008','920009','920010'));

DELETE FROM usuarios
WHERE ci IN ('9870322','910002','910003','910004','910005','920002','920003','920004','920005','920006','920007','920008','920009','920010');

-- Hash bcrypt usado para todos los estudiantes: contraseña 123456
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
  'jose.daniel.extenso@umsa.bo',
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
  '920002',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'ana.quispe.extenso@umsa.bo',
  'Ana María Quispe Choque',
  'F',
  '2001-09-12',
  'RU-920002',
  '70000002',
  'TRABAJO DIRIGIDO',
  (SELECT id FROM carreras WHERE nombre = 'Derecho'),
  (SELECT id FROM municipios WHERE nombre = 'El Alto')
),
(
  '920003',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'valeria.rojas.extenso@umsa.bo',
  'Valeria Rojas Lima',
  'F',
  '2000-11-05',
  'RU-920003',
  '70000003',
  'INTERNADO ROTATORIO',
  (SELECT id FROM carreras WHERE nombre = 'Psicologia'),
  (SELECT id FROM municipios WHERE nombre = 'Viacha')
),
(
  '920004',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'diego.condori.extenso@umsa.bo',
  'Diego Condori Paredes',
  'M',
  '2003-01-19',
  'RU-920004',
  '70000004',
  'PRÁCTICAS PRE PROFESIONALES',
  (SELECT id FROM carreras WHERE nombre = 'Trabajo Social'),
  (SELECT id FROM municipios WHERE nombre = 'Achocalla')
),
(
  '920005',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'camila.nina.extenso@umsa.bo',
  'Camila Nina Apaza',
  'F',
  '2002-06-30',
  'RU-920005',
  '70000005',
  'TRABAJO DIRIGIDO',
  (SELECT id FROM carreras WHERE nombre = 'Derecho'),
  (SELECT id FROM municipios WHERE nombre = 'Mecapaca')
),
(
  '920006',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'marco.choque.extenso@umsa.bo',
  'Marco Antonio Choque Flores',
  'M',
  '2001-12-08',
  'RU-920006',
  '70000006',
  'INTERNADO ROTATORIO',
  (SELECT id FROM carreras WHERE nombre = 'Psicologia'),
  (SELECT id FROM municipios WHERE nombre = 'La Paz')
),
(
  '920007',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'lucia.mamani.extenso@umsa.bo',
  'Lucía Mamani Quisbert',
  'F',
  '2002-02-15',
  'RU-920007',
  '70000007',
  'PRÁCTICAS PRE PROFESIONALES',
  (SELECT id FROM carreras WHERE nombre = 'Trabajo Social'),
  (SELECT id FROM municipios WHERE nombre = 'El Alto')
),
(
  '920008',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'rodrigo.flores.extenso@umsa.bo',
  'Rodrigo Flores Arce',
  'M',
  '2000-08-24',
  'RU-920008',
  '70000008',
  'TRABAJO DIRIGIDO',
  (SELECT id FROM carreras WHERE nombre = 'Derecho'),
  (SELECT id FROM municipios WHERE nombre = 'Viacha')
),
(
  '920009',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'sofia.vargas.extenso@umsa.bo',
  'Sofía Vargas Callisaya',
  'F',
  '2003-03-03',
  'RU-920009',
  '70000009',
  'INTERNADO ROTATORIO',
  (SELECT id FROM carreras WHERE nombre = 'Psicologia'),
  (SELECT id FROM municipios WHERE nombre = 'Achocalla')
),
(
  '920010',
  '$2b$12$ahiUiLnrMIxiQlWUGwCTjeo82FQ5uMcRLiNAod1D8BqusUzbF3OV2',
  (SELECT id FROM roles WHERE nombre = 'ESTUDIANTE'),
  true,
  'andres.lima.extenso@umsa.bo',
  'Andrés Lima Poma',
  'M',
  '2001-07-21',
  'RU-920010',
  '70000010',
  'PRÁCTICAS PRE PROFESIONALES',
  (SELECT id FROM carreras WHERE nombre = 'Trabajo Social'),
  (SELECT id FROM municipios WHERE nombre = 'Mecapaca')
);

-- ════════════════════════════════════════════════════════════════
-- PREVENCIÓN: 44 registros entre junio y julio
-- ════════════════════════════════════════════════════════════════
INSERT INTO actividades_prevencion (
  usuario_id, asignacion_id, periodo, fecha, nombre, descripcion,
  poblacion_mujeres, poblacion_hombres,
  poblacion_ninez, poblacion_adulto_mayor, poblacion_discapacidad,
  participantes, url_redes, url_drive
) VALUES
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-02', 'Taller de prevención de violencia', 'Se desarrolló una actividad participativa sobre señales de alerta, prevención y rutas de atención disponibles.', 10, 5, true, true, true, 'Ana María Quispe Choque', 'https://facebook.com/slim/extenso-2026-06-prev-01', 'https://drive.google.com/slim/extenso-2026-06-prev-01'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-04', 'Charla informativa Ley 348', 'Se socializaron derechos, obligaciones y medidas de protección mediante explicación sencilla y ejemplos cotidianos.', 17, 10, false, false, false, 'Valeria Rojas Lima', 'https://facebook.com/slim/extenso-2026-06-prev-02', 'https://drive.google.com/slim/extenso-2026-06-prev-02'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-06', 'Feria educativa comunitaria', 'Se realizó orientación comunitaria con entrega de material informativo y registro de consultas breves.', 24, 15, false, false, true, 'Diego Condori Paredes', 'https://facebook.com/slim/extenso-2026-06-prev-03', 'https://drive.google.com/slim/extenso-2026-06-prev-03'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-08', 'Campaña de sensibilización', 'Se trabajó con dinámica grupal para identificar situaciones de riesgo y fortalecer redes de apoyo.', 31, 20, true, true, false, 'Camila Nina Apaza', 'https://facebook.com/slim/extenso-2026-06-prev-04', 'https://drive.google.com/slim/extenso-2026-06-prev-04'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-10', 'Capacitación sobre derechos de la mujer', 'Se brindó información preventiva a familias, jóvenes y organizaciones sociales del municipio.', 38, 25, false, true, false, 'Marco Antonio Choque Flores', 'https://facebook.com/slim/extenso-2026-06-prev-05', 'https://drive.google.com/slim/extenso-2026-06-prev-05'),
((SELECT id FROM usuarios WHERE ci='920007'), NULL, '2026-06', '2026-06-12', 'Actividad de prevención en unidad educativa', 'Se explicó la importancia de denunciar oportunamente y acudir a instituciones competentes.', 45, 30, false, false, true, 'Lucía Mamani Quisbert', 'https://facebook.com/slim/extenso-2026-06-prev-06', 'https://drive.google.com/slim/extenso-2026-06-prev-06'),
((SELECT id FROM usuarios WHERE ci='920008'), NULL, '2026-06', '2026-06-14', 'Socialización de rutas de denuncia', 'Se desarrolló una sesión educativa con preguntas y respuestas para reforzar el conocimiento de la población.', 10, 35, true, false, false, 'Rodrigo Flores Arce', 'https://facebook.com/slim/extenso-2026-06-prev-07', 'https://drive.google.com/slim/extenso-2026-06-prev-07'),
((SELECT id FROM usuarios WHERE ci='920009'), NULL, '2026-06', '2026-06-16', 'Prevención de violencia digital', 'Se desarrolló una actividad participativa sobre señales de alerta, prevención y rutas de atención disponibles.', 17, 5, true, false, false, 'Sofía Vargas Callisaya', 'https://facebook.com/slim/extenso-2026-06-prev-08', 'https://drive.google.com/slim/extenso-2026-06-prev-08'),
((SELECT id FROM usuarios WHERE ci='920010'), NULL, '2026-06', '2026-06-18', 'Prevención de violencia familiar', 'Se socializaron derechos, obligaciones y medidas de protección mediante explicación sencilla y ejemplos cotidianos.', 24, 10, false, true, false, 'Ana María Quispe Choque, Valeria Rojas Lima', 'https://facebook.com/slim/extenso-2026-06-prev-09', 'https://drive.google.com/slim/extenso-2026-06-prev-09'),
((SELECT id FROM usuarios WHERE ci='920002'), NULL, '2026-06', '2026-06-20', 'Orientación comunitaria', 'Se realizó orientación comunitaria con entrega de material informativo y registro de consultas breves.', 31, 15, true, false, false, 'Diego Condori Paredes, Camila Nina Apaza', 'https://facebook.com/slim/extenso-2026-06-prev-10', 'https://drive.google.com/slim/extenso-2026-06-prev-10'),
((SELECT id FROM usuarios WHERE ci='920003'), NULL, '2026-06', '2026-06-22', 'Taller de buen trato y convivencia', 'Se trabajó con dinámica grupal para identificar situaciones de riesgo y fortalecer redes de apoyo.', 38, 20, false, false, true, NULL, 'https://facebook.com/slim/extenso-2026-06-prev-11', 'https://drive.google.com/slim/extenso-2026-06-prev-11'),
((SELECT id FROM usuarios WHERE ci='920004'), NULL, '2026-06', '2026-06-24', 'Jornada de información sobre servicios SLIM', 'Se brindó información preventiva a familias, jóvenes y organizaciones sociales del municipio.', 45, 25, false, false, false, 'Ana María Quispe Choque', 'https://facebook.com/slim/extenso-2026-06-prev-12', 'https://drive.google.com/slim/extenso-2026-06-prev-12'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-26', 'Taller de prevención de violencia', 'Se explicó la importancia de denunciar oportunamente y acudir a instituciones competentes.', 10, 30, true, true, false, 'Valeria Rojas Lima', 'https://facebook.com/slim/extenso-2026-06-prev-13', 'https://drive.google.com/slim/extenso-2026-06-prev-13'),
((SELECT id FROM usuarios WHERE ci='920006'), NULL, '2026-06', '2026-06-28', 'Charla informativa Ley 348', 'Se desarrolló una sesión educativa con preguntas y respuestas para reforzar el conocimiento de la población.', 17, 35, false, false, false, 'Diego Condori Paredes', 'https://facebook.com/slim/extenso-2026-06-prev-14', 'https://drive.google.com/slim/extenso-2026-06-prev-14'),
((SELECT id FROM usuarios WHERE ci='920007'), NULL, '2026-06', '2026-06-03', 'Feria educativa comunitaria', 'Se desarrolló una actividad participativa sobre señales de alerta, prevención y rutas de atención disponibles.', 24, 5, false, true, false, 'Camila Nina Apaza', 'https://facebook.com/slim/extenso-2026-06-prev-15', 'https://drive.google.com/slim/extenso-2026-06-prev-15'),
((SELECT id FROM usuarios WHERE ci='920008'), NULL, '2026-06', '2026-06-05', 'Campaña de sensibilización', 'Se socializaron derechos, obligaciones y medidas de protección mediante explicación sencilla y ejemplos cotidianos.', 31, 10, true, false, true, 'Marco Antonio Choque Flores', 'https://facebook.com/slim/extenso-2026-06-prev-16', 'https://drive.google.com/slim/extenso-2026-06-prev-16'),
((SELECT id FROM usuarios WHERE ci='920009'), NULL, '2026-06', '2026-06-07', 'Capacitación sobre derechos de la mujer', 'Se realizó orientación comunitaria con entrega de material informativo y registro de consultas breves.', 38, 15, false, true, false, 'Lucía Mamani Quisbert', 'https://facebook.com/slim/extenso-2026-06-prev-17', 'https://drive.google.com/slim/extenso-2026-06-prev-17'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-09', 'Actividad de prevención en unidad educativa', 'Se trabajó con dinámica grupal para identificar situaciones de riesgo y fortalecer redes de apoyo.', 45, 20, true, false, false, 'Rodrigo Flores Arce', 'https://facebook.com/slim/extenso-2026-06-prev-18', 'https://drive.google.com/slim/extenso-2026-06-prev-18'),
((SELECT id FROM usuarios WHERE ci='920002'), NULL, '2026-06', '2026-06-11', 'Socialización de rutas de denuncia', 'Se brindó información preventiva a familias, jóvenes y organizaciones sociales del municipio.', 10, 25, true, false, false, 'Sofía Vargas Callisaya', 'https://facebook.com/slim/extenso-2026-06-prev-19', 'https://drive.google.com/slim/extenso-2026-06-prev-19'),
((SELECT id FROM usuarios WHERE ci='920003'), NULL, '2026-06', '2026-06-13', 'Prevención de violencia digital', 'Se explicó la importancia de denunciar oportunamente y acudir a instituciones competentes.', 17, 30, false, false, false, 'Ana María Quispe Choque, Valeria Rojas Lima', 'https://facebook.com/slim/extenso-2026-06-prev-20', 'https://drive.google.com/slim/extenso-2026-06-prev-20'),
((SELECT id FROM usuarios WHERE ci='920004'), NULL, '2026-06', '2026-06-15', 'Prevención de violencia familiar', 'Se desarrolló una sesión educativa con preguntas y respuestas para reforzar el conocimiento de la población.', 24, 35, false, true, true, 'Diego Condori Paredes, Camila Nina Apaza', 'https://facebook.com/slim/extenso-2026-06-prev-21', 'https://drive.google.com/slim/extenso-2026-06-prev-21'),
((SELECT id FROM usuarios WHERE ci='920005'), NULL, '2026-06', '2026-06-17', 'Orientación comunitaria', 'Se desarrolló una actividad participativa sobre señales de alerta, prevención y rutas de atención disponibles.', 31, 5, true, false, false, NULL, 'https://facebook.com/slim/extenso-2026-06-prev-22', 'https://drive.google.com/slim/extenso-2026-06-prev-22'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-01', 'Taller de buen trato y convivencia', 'Se socializaron derechos, obligaciones y medidas de protección mediante explicación sencilla y ejemplos cotidianos.', 32, 27, true, true, true, 'Ana María Quispe Choque', 'https://facebook.com/slim/extenso-2026-07-prev-01', 'https://drive.google.com/slim/extenso-2026-07-prev-01'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-03', 'Jornada de información sobre servicios SLIM', 'Se realizó orientación comunitaria con entrega de material informativo y registro de consultas breves.', 39, 32, false, false, false, 'Valeria Rojas Lima', 'https://facebook.com/slim/extenso-2026-07-prev-02', 'https://drive.google.com/slim/extenso-2026-07-prev-02'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-05', 'Taller de prevención de violencia', 'Se trabajó con dinámica grupal para identificar situaciones de riesgo y fortalecer redes de apoyo.', 46, 37, false, false, true, 'Diego Condori Paredes', 'https://facebook.com/slim/extenso-2026-07-prev-03', 'https://drive.google.com/slim/extenso-2026-07-prev-03'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-07', 'Charla informativa Ley 348', 'Se brindó información preventiva a familias, jóvenes y organizaciones sociales del municipio.', 11, 7, true, true, false, 'Camila Nina Apaza', 'https://facebook.com/slim/extenso-2026-07-prev-04', 'https://drive.google.com/slim/extenso-2026-07-prev-04'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-09', 'Feria educativa comunitaria', 'Se explicó la importancia de denunciar oportunamente y acudir a instituciones competentes.', 18, 12, false, true, false, 'Marco Antonio Choque Flores', 'https://facebook.com/slim/extenso-2026-07-prev-05', 'https://drive.google.com/slim/extenso-2026-07-prev-05'),
((SELECT id FROM usuarios WHERE ci='920007'), NULL, '2026-07', '2026-07-11', 'Campaña de sensibilización', 'Se desarrolló una sesión educativa con preguntas y respuestas para reforzar el conocimiento de la población.', 25, 17, false, false, true, 'Lucía Mamani Quisbert', 'https://facebook.com/slim/extenso-2026-07-prev-06', 'https://drive.google.com/slim/extenso-2026-07-prev-06'),
((SELECT id FROM usuarios WHERE ci='920008'), NULL, '2026-07', '2026-07-13', 'Capacitación sobre derechos de la mujer', 'Se desarrolló una actividad participativa sobre señales de alerta, prevención y rutas de atención disponibles.', 32, 22, true, false, false, 'Rodrigo Flores Arce', 'https://facebook.com/slim/extenso-2026-07-prev-07', 'https://drive.google.com/slim/extenso-2026-07-prev-07'),
((SELECT id FROM usuarios WHERE ci='920009'), NULL, '2026-07', '2026-07-15', 'Actividad de prevención en unidad educativa', 'Se socializaron derechos, obligaciones y medidas de protección mediante explicación sencilla y ejemplos cotidianos.', 39, 27, true, false, false, 'Sofía Vargas Callisaya', 'https://facebook.com/slim/extenso-2026-07-prev-08', 'https://drive.google.com/slim/extenso-2026-07-prev-08'),
((SELECT id FROM usuarios WHERE ci='920010'), NULL, '2026-07', '2026-07-17', 'Socialización de rutas de denuncia', 'Se realizó orientación comunitaria con entrega de material informativo y registro de consultas breves.', 46, 32, false, true, false, 'Ana María Quispe Choque, Valeria Rojas Lima', 'https://facebook.com/slim/extenso-2026-07-prev-09', 'https://drive.google.com/slim/extenso-2026-07-prev-09'),
((SELECT id FROM usuarios WHERE ci='920002'), NULL, '2026-07', '2026-07-19', 'Prevención de violencia digital', 'Se trabajó con dinámica grupal para identificar situaciones de riesgo y fortalecer redes de apoyo.', 11, 37, true, false, false, 'Diego Condori Paredes, Camila Nina Apaza', 'https://facebook.com/slim/extenso-2026-07-prev-10', 'https://drive.google.com/slim/extenso-2026-07-prev-10'),
((SELECT id FROM usuarios WHERE ci='920003'), NULL, '2026-07', '2026-07-21', 'Prevención de violencia familiar', 'Se brindó información preventiva a familias, jóvenes y organizaciones sociales del municipio.', 18, 7, false, false, true, NULL, 'https://facebook.com/slim/extenso-2026-07-prev-11', 'https://drive.google.com/slim/extenso-2026-07-prev-11'),
((SELECT id FROM usuarios WHERE ci='920004'), NULL, '2026-07', '2026-07-23', 'Orientación comunitaria', 'Se explicó la importancia de denunciar oportunamente y acudir a instituciones competentes.', 25, 12, false, false, false, 'Ana María Quispe Choque', 'https://facebook.com/slim/extenso-2026-07-prev-12', 'https://drive.google.com/slim/extenso-2026-07-prev-12'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-25', 'Taller de buen trato y convivencia', 'Se desarrolló una sesión educativa con preguntas y respuestas para reforzar el conocimiento de la población.', 32, 17, true, true, false, 'Valeria Rojas Lima', 'https://facebook.com/slim/extenso-2026-07-prev-13', 'https://drive.google.com/slim/extenso-2026-07-prev-13'),
((SELECT id FROM usuarios WHERE ci='920006'), NULL, '2026-07', '2026-07-27', 'Jornada de información sobre servicios SLIM', 'Se desarrolló una actividad participativa sobre señales de alerta, prevención y rutas de atención disponibles.', 39, 22, false, false, false, 'Diego Condori Paredes', 'https://facebook.com/slim/extenso-2026-07-prev-14', 'https://drive.google.com/slim/extenso-2026-07-prev-14'),
((SELECT id FROM usuarios WHERE ci='920007'), NULL, '2026-07', '2026-07-02', 'Taller de prevención de violencia', 'Se socializaron derechos, obligaciones y medidas de protección mediante explicación sencilla y ejemplos cotidianos.', 46, 27, false, true, false, 'Camila Nina Apaza', 'https://facebook.com/slim/extenso-2026-07-prev-15', 'https://drive.google.com/slim/extenso-2026-07-prev-15'),
((SELECT id FROM usuarios WHERE ci='920008'), NULL, '2026-07', '2026-07-04', 'Charla informativa Ley 348', 'Se realizó orientación comunitaria con entrega de material informativo y registro de consultas breves.', 11, 32, true, false, true, 'Marco Antonio Choque Flores', 'https://facebook.com/slim/extenso-2026-07-prev-16', 'https://drive.google.com/slim/extenso-2026-07-prev-16'),
((SELECT id FROM usuarios WHERE ci='920009'), NULL, '2026-07', '2026-07-06', 'Feria educativa comunitaria', 'Se trabajó con dinámica grupal para identificar situaciones de riesgo y fortalecer redes de apoyo.', 18, 37, false, true, false, 'Lucía Mamani Quisbert', 'https://facebook.com/slim/extenso-2026-07-prev-17', 'https://drive.google.com/slim/extenso-2026-07-prev-17'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-08', 'Campaña de sensibilización', 'Se brindó información preventiva a familias, jóvenes y organizaciones sociales del municipio.', 25, 7, true, false, false, 'Rodrigo Flores Arce', 'https://facebook.com/slim/extenso-2026-07-prev-18', 'https://drive.google.com/slim/extenso-2026-07-prev-18'),
((SELECT id FROM usuarios WHERE ci='920002'), NULL, '2026-07', '2026-07-10', 'Capacitación sobre derechos de la mujer', 'Se explicó la importancia de denunciar oportunamente y acudir a instituciones competentes.', 32, 12, true, false, false, 'Sofía Vargas Callisaya', 'https://facebook.com/slim/extenso-2026-07-prev-19', 'https://drive.google.com/slim/extenso-2026-07-prev-19'),
((SELECT id FROM usuarios WHERE ci='920003'), NULL, '2026-07', '2026-07-12', 'Actividad de prevención en unidad educativa', 'Se desarrolló una sesión educativa con preguntas y respuestas para reforzar el conocimiento de la población.', 39, 17, false, false, false, 'Ana María Quispe Choque, Valeria Rojas Lima', 'https://facebook.com/slim/extenso-2026-07-prev-20', 'https://drive.google.com/slim/extenso-2026-07-prev-20'),
((SELECT id FROM usuarios WHERE ci='920004'), NULL, '2026-07', '2026-07-14', 'Socialización de rutas de denuncia', 'Se desarrolló una actividad participativa sobre señales de alerta, prevención y rutas de atención disponibles.', 46, 22, false, true, true, 'Diego Condori Paredes, Camila Nina Apaza', 'https://facebook.com/slim/extenso-2026-07-prev-21', 'https://drive.google.com/slim/extenso-2026-07-prev-21'),
((SELECT id FROM usuarios WHERE ci='920005'), NULL, '2026-07', '2026-07-16', 'Prevención de violencia digital', 'Se socializaron derechos, obligaciones y medidas de protección mediante explicación sencilla y ejemplos cotidianos.', 11, 27, true, false, false, NULL, 'https://facebook.com/slim/extenso-2026-07-prev-22', 'https://drive.google.com/slim/extenso-2026-07-prev-22');

-- ════════════════════════════════════════════════════════════════
-- ATENCIÓN: 64 registros entre junio y julio
-- Tipos de caso variados:
--   Caso Nuevo, Seguimiento y Orientación en Plataforma con varias repeticiones por mes.
-- Tipos de denuncia variados:
--   se usan todos los tipos principales del catálogo.
-- ════════════════════════════════════════════════════════════════
INSERT INTO actividades_atencion (
  usuario_id, asignacion_id, periodo, fecha, tipo_actividad, descripcion,
  denunciantes_h, denunciantes_m, seguimiento,
  tipo_caso, tipo_denuncia, participantes, institucion
) VALUES
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-01', 'Entrevista', 'Se realizó entrevista inicial, escucha activa y orientación sobre la ruta de atención correspondiente. Tipo registrado: Violencia Física.', 1, 1, 0, 'Caso Nuevo', 'Violencia Física', 'Diego Condori Paredes', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-02', 'Orientación en Plataforma', 'Se brindó orientación legal, social y psicológica según necesidad identificada en plataforma. Tipo registrado: Violencia Económica.', 0, 1, 0, 'Caso Nuevo', 'Violencia Económica', 'Camila Nina Apaza', 'UPAM'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-03', 'Visita Domiciliaria', 'Se registró información del caso y se explicó la documentación necesaria para continuar la atención. Tipo registrado: Violencia Mediática.', 0, 1, 0, 'Caso Nuevo', 'Violencia Mediática', 'Marco Antonio Choque Flores', 'Fiscalía'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-05', 'Acompañamiento', 'Se coordinó con institución correspondiente para derivación y seguimiento del proceso. Tipo registrado: Asistencia Familiar.', 1, 1, 0, 'Caso Nuevo', 'Asistencia Familiar', 'Lucía Mamani Quisbert', 'FELCV'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-06', 'Patrocinio Legal', 'Se efectuó revisión del avance del caso y actualización de datos relevantes. Tipo registrado: Reconocimiento de Hijos.', 0, 1, 0, 'Caso Nuevo', 'Reconocimiento de Hijos', 'Rodrigo Flores Arce', 'Defensoría'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-07', 'Conciliación', 'Se acompañó a la persona usuaria en la comprensión de sus derechos y opciones institucionales. Tipo registrado: No Corresponde.', 0, 1, 0, 'Caso Nuevo', 'No Corresponde', 'Sofía Vargas Callisaya', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-09', 'Derivación institucional', 'Se brindó contención inicial y se recomendó continuidad de atención especializada. Tipo registrado: Violencia Sexual.', 0, 1, 0, 'Caso Nuevo', 'Violencia Sexual', 'Ana María Quispe Choque, Valeria Rojas Lima', 'UPAM'),
((SELECT id FROM usuarios WHERE ci='920009'), NULL, '2026-06', '2026-06-10', 'Seguimiento de caso', 'Se orientó sobre medidas de protección, denuncia y redes de apoyo disponibles. Tipo registrado: Violencia Simbólica.', 1, 0, 0, 'Caso Nuevo', 'Violencia Simbólica', 'Diego Condori Paredes, Camila Nina Apaza', 'Fiscalía'),
((SELECT id FROM usuarios WHERE ci='920010'), NULL, '2026-06', '2026-06-11', 'Atención psicológica inicial', 'Se realizó entrevista inicial, escucha activa y orientación sobre la ruta de atención correspondiente. Tipo registrado: Violencia Feminicidio.', 0, 1, 0, 'Caso Nuevo', 'Violencia Feminicidio', NULL, 'FELCV'),
((SELECT id FROM usuarios WHERE ci='920002'), NULL, '2026-06', '2026-06-13', 'Atención social inicial', 'Se brindó orientación legal, social y psicológica según necesidad identificada en plataforma. Tipo registrado: Divorcio.', 1, 1, 0, 'Caso Nuevo', 'Divorcio', 'Ana María Quispe Choque', 'Defensoría'),
((SELECT id FROM usuarios WHERE ci='920003'), NULL, '2026-06', '2026-06-14', 'Orientación legal', 'Se registró información del caso y se explicó la documentación necesaria para continuar la atención. Tipo registrado: Trabajo Infantil.', 0, 1, 0, 'Caso Nuevo', 'Trabajo Infantil', 'Valeria Rojas Lima', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='920004'), NULL, '2026-06', '2026-06-15', 'Entrevista', 'Se coordinó con institución correspondiente para derivación y seguimiento del proceso. Tipo registrado: Violencia Psicológica.', 0, 1, 0, 'Caso Nuevo', 'Violencia Psicológica', 'Diego Condori Paredes', 'UPAM'),
((SELECT id FROM usuarios WHERE ci='920005'), NULL, '2026-06', '2026-06-17', 'Orientación en Plataforma', 'Se efectuó revisión del avance del caso y actualización de datos relevantes. Tipo registrado: Violencia Patrimonial.', 0, 1, 0, 'Caso Nuevo', 'Violencia Patrimonial', 'Camila Nina Apaza', 'Fiscalía'),
((SELECT id FROM usuarios WHERE ci='920006'), NULL, '2026-06', '2026-06-18', 'Visita Domiciliaria', 'Se acompañó a la persona usuaria en la comprensión de sus derechos y opciones institucionales. Tipo registrado: Violencia Digital.', 0, 1, 0, 'Caso Nuevo', 'Violencia Digital', 'Marco Antonio Choque Flores', 'FELCV'),
((SELECT id FROM usuarios WHERE ci='920007'), NULL, '2026-06', '2026-06-19', 'Acompañamiento', 'Se brindó contención inicial y se recomendó continuidad de atención especializada. Tipo registrado: Guarda y Tenencia.', 0, 1, 1, 'Seguimiento', 'Guarda y Tenencia', 'Lucía Mamani Quisbert', 'Defensoría'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-21', 'Patrocinio Legal', 'Se orientó sobre medidas de protección, denuncia y redes de apoyo disponibles. Tipo registrado: Tráfico y Trata de Personas.', 0, 1, 1, 'Seguimiento', 'Tráfico y Trata de Personas', 'Rodrigo Flores Arce', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='920009'), NULL, '2026-06', '2026-06-22', 'Conciliación', 'Se realizó entrevista inicial, escucha activa y orientación sobre la ruta de atención correspondiente. Tipo registrado: Violencia Física.', 0, 1, 1, 'Seguimiento', 'Violencia Física', 'Sofía Vargas Callisaya', 'UPAM'),
((SELECT id FROM usuarios WHERE ci='920010'), NULL, '2026-06', '2026-06-23', 'Derivación institucional', 'Se brindó orientación legal, social y psicológica según necesidad identificada en plataforma. Tipo registrado: Violencia Económica.', 0, 1, 1, 'Seguimiento', 'Violencia Económica', 'Ana María Quispe Choque, Valeria Rojas Lima', 'Fiscalía'),
((SELECT id FROM usuarios WHERE ci='920002'), NULL, '2026-06', '2026-06-25', 'Seguimiento de caso', 'Se registró información del caso y se explicó la documentación necesaria para continuar la atención. Tipo registrado: Violencia Mediática.', 0, 1, 1, 'Seguimiento', 'Violencia Mediática', 'Diego Condori Paredes, Camila Nina Apaza', 'FELCV'),
((SELECT id FROM usuarios WHERE ci='920003'), NULL, '2026-06', '2026-06-26', 'Atención psicológica inicial', 'Se coordinó con institución correspondiente para derivación y seguimiento del proceso. Tipo registrado: Asistencia Familiar.', 0, 1, 1, 'Seguimiento', 'Asistencia Familiar', NULL, 'Defensoría'),
((SELECT id FROM usuarios WHERE ci='920004'), NULL, '2026-06', '2026-06-27', 'Atención social inicial', 'Se efectuó revisión del avance del caso y actualización de datos relevantes. Tipo registrado: Reconocimiento de Hijos.', 0, 1, 1, 'Seguimiento', 'Reconocimiento de Hijos', 'Ana María Quispe Choque', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='920005'), NULL, '2026-06', '2026-06-01', 'Orientación legal', 'Se acompañó a la persona usuaria en la comprensión de sus derechos y opciones institucionales. Tipo registrado: No Corresponde.', 1, 1, 1, 'Seguimiento', 'No Corresponde', 'Valeria Rojas Lima', 'UPAM'),
((SELECT id FROM usuarios WHERE ci='920006'), NULL, '2026-06', '2026-06-02', 'Entrevista', 'Se brindó contención inicial y se recomendó continuidad de atención especializada. Tipo registrado: Violencia Sexual.', 0, 1, 1, 'Seguimiento', 'Violencia Sexual', 'Diego Condori Paredes', 'Fiscalía'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-06', '2026-06-03', 'Orientación en Plataforma', 'Se orientó sobre medidas de protección, denuncia y redes de apoyo disponibles. Tipo registrado: Violencia Simbólica.', 0, 1, 1, 'Seguimiento', 'Violencia Simbólica', 'Camila Nina Apaza', 'FELCV'),
((SELECT id FROM usuarios WHERE ci='920008'), NULL, '2026-06', '2026-06-05', 'Visita Domiciliaria', 'Se realizó entrevista inicial, escucha activa y orientación sobre la ruta de atención correspondiente. Tipo registrado: Violencia Feminicidio.', 0, 1, 0, 'Orientación en Plataforma', 'Violencia Feminicidio', 'Marco Antonio Choque Flores', 'Defensoría'),
((SELECT id FROM usuarios WHERE ci='920009'), NULL, '2026-06', '2026-06-06', 'Acompañamiento', 'Se brindó orientación legal, social y psicológica según necesidad identificada en plataforma. Tipo registrado: Divorcio.', 0, 1, 0, 'Orientación en Plataforma', 'Divorcio', 'Lucía Mamani Quisbert', 'SLIM'),
((SELECT id FROM usuarios WHERE ci='920010'), NULL, '2026-06', '2026-06-07', 'Patrocinio Legal', 'Se registró información del caso y se explicó la documentación necesaria para continuar la atención. Tipo registrado: Trabajo Infantil.', 0, 1, 0, 'Orientación en Plataforma', 'Trabajo Infantil', 'Rodrigo Flores Arce', 'UPAM'),
((SELECT id FROM usuarios WHERE ci='920002'), NULL, '2026-06', '2026-06-09', 'Conciliación', 'Se coordinó con institución correspondiente para derivación y seguimiento del proceso. Tipo registrado: Violencia Psicológica.', 0, 1, 0, 'Orientación en Plataforma', 'Violencia Psicológica', 'Sofía Vargas Callisaya', 'Fiscalía'),
((SELECT id FROM usuarios WHERE ci='920003'), NULL, '2026-06', '2026-06-10', 'Derivación institucional', 'Se efectuó revisión del avance del caso y actualización de datos relevantes. Tipo registrado: Violencia Patrimonial.', 1, 0, 0, 'Orientación en Plataforma', 'Violencia Patrimonial', 'Ana María Quispe Choque, Valeria Rojas Lima', 'FELCV'),
((SELECT id FROM usuarios WHERE ci='920004'), NULL, '2026-06', '2026-06-11', 'Seguimiento de caso', 'Se acompañó a la persona usuaria en la comprensión de sus derechos y opciones institucionales. Tipo registrado: Violencia Digital.', 0, 1, 0, 'Orientación en Plataforma', 'Violencia Digital', 'Diego Condori Paredes, Camila Nina Apaza', 'Defensoría'),
((SELECT id FROM usuarios WHERE ci='920005'), NULL, '2026-06', '2026-06-13', 'Atención psicológica inicial', 'Se brindó contención inicial y se recomendó continuidad de atención especializada. Tipo registrado: Guarda y Tenencia.', 1, 1, 0, 'Orientación en Plataforma', 'Guarda y Tenencia', NULL, 'SLIM'),
((SELECT id FROM usuarios WHERE ci='920006'), NULL, '2026-06', '2026-06-14', 'Atención social inicial', 'Se orientó sobre medidas de protección, denuncia y redes de apoyo disponibles. Tipo registrado: Tráfico y Trata de Personas.', 0, 1, 0, 'Orientación en Plataforma', 'Tráfico y Trata de Personas', 'Ana María Quispe Choque', 'UPAM'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-01', 'Orientación legal', 'Se realizó entrevista inicial, escucha activa y orientación sobre la ruta de atención correspondiente. Tipo registrado: Violencia Física.', 1, 1, 0, 'Caso Nuevo', 'Violencia Física', 'Diego Condori Paredes', 'DNA'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-02', 'Entrevista', 'Se brindó orientación legal, social y psicológica según necesidad identificada en plataforma. Tipo registrado: Violencia Económica.', 0, 1, 0, 'Caso Nuevo', 'Violencia Económica', 'Camila Nina Apaza', 'UMADIS'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-03', 'Orientación en Plataforma', 'Se registró información del caso y se explicó la documentación necesaria para continuar la atención. Tipo registrado: Violencia Mediática.', 0, 1, 0, 'Caso Nuevo', 'Violencia Mediática', 'Marco Antonio Choque Flores', 'Policía'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-05', 'Visita Domiciliaria', 'Se coordinó con institución correspondiente para derivación y seguimiento del proceso. Tipo registrado: Asistencia Familiar.', 1, 1, 0, 'Caso Nuevo', 'Asistencia Familiar', 'Lucía Mamani Quisbert', 'Juzgado de Familia'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-06', 'Acompañamiento', 'Se efectuó revisión del avance del caso y actualización de datos relevantes. Tipo registrado: Reconocimiento de Hijos.', 0, 1, 0, 'Caso Nuevo', 'Reconocimiento de Hijos', 'Rodrigo Flores Arce', 'Centro de Salud'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-07', 'Patrocinio Legal', 'Se acompañó a la persona usuaria en la comprensión de sus derechos y opciones institucionales. Tipo registrado: No Corresponde.', 0, 1, 0, 'Caso Nuevo', 'No Corresponde', 'Sofía Vargas Callisaya', 'DNA'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-09', 'Conciliación', 'Se brindó contención inicial y se recomendó continuidad de atención especializada. Tipo registrado: Violencia Sexual.', 0, 1, 0, 'Caso Nuevo', 'Violencia Sexual', 'Ana María Quispe Choque, Valeria Rojas Lima', 'UMADIS'),
((SELECT id FROM usuarios WHERE ci='920009'), NULL, '2026-07', '2026-07-10', 'Derivación institucional', 'Se orientó sobre medidas de protección, denuncia y redes de apoyo disponibles. Tipo registrado: Violencia Simbólica.', 1, 0, 0, 'Caso Nuevo', 'Violencia Simbólica', 'Diego Condori Paredes, Camila Nina Apaza', 'Policía'),
((SELECT id FROM usuarios WHERE ci='920010'), NULL, '2026-07', '2026-07-11', 'Seguimiento de caso', 'Se realizó entrevista inicial, escucha activa y orientación sobre la ruta de atención correspondiente. Tipo registrado: Violencia Feminicidio.', 0, 1, 0, 'Caso Nuevo', 'Violencia Feminicidio', NULL, 'Juzgado de Familia'),
((SELECT id FROM usuarios WHERE ci='920002'), NULL, '2026-07', '2026-07-13', 'Atención psicológica inicial', 'Se brindó orientación legal, social y psicológica según necesidad identificada en plataforma. Tipo registrado: Divorcio.', 1, 1, 0, 'Caso Nuevo', 'Divorcio', 'Ana María Quispe Choque', 'Centro de Salud'),
((SELECT id FROM usuarios WHERE ci='920003'), NULL, '2026-07', '2026-07-14', 'Atención social inicial', 'Se registró información del caso y se explicó la documentación necesaria para continuar la atención. Tipo registrado: Trabajo Infantil.', 0, 1, 0, 'Caso Nuevo', 'Trabajo Infantil', 'Valeria Rojas Lima', 'DNA'),
((SELECT id FROM usuarios WHERE ci='920004'), NULL, '2026-07', '2026-07-15', 'Orientación legal', 'Se coordinó con institución correspondiente para derivación y seguimiento del proceso. Tipo registrado: Violencia Psicológica.', 0, 1, 0, 'Caso Nuevo', 'Violencia Psicológica', 'Diego Condori Paredes', 'UMADIS'),
((SELECT id FROM usuarios WHERE ci='920005'), NULL, '2026-07', '2026-07-17', 'Entrevista', 'Se efectuó revisión del avance del caso y actualización de datos relevantes. Tipo registrado: Violencia Patrimonial.', 0, 1, 0, 'Caso Nuevo', 'Violencia Patrimonial', 'Camila Nina Apaza', 'Policía'),
((SELECT id FROM usuarios WHERE ci='920006'), NULL, '2026-07', '2026-07-18', 'Orientación en Plataforma', 'Se acompañó a la persona usuaria en la comprensión de sus derechos y opciones institucionales. Tipo registrado: Violencia Digital.', 0, 1, 1, 'Seguimiento', 'Violencia Digital', 'Marco Antonio Choque Flores', 'Juzgado de Familia'),
((SELECT id FROM usuarios WHERE ci='920007'), NULL, '2026-07', '2026-07-19', 'Visita Domiciliaria', 'Se brindó contención inicial y se recomendó continuidad de atención especializada. Tipo registrado: Guarda y Tenencia.', 0, 1, 1, 'Seguimiento', 'Guarda y Tenencia', 'Lucía Mamani Quisbert', 'Centro de Salud'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-21', 'Acompañamiento', 'Se orientó sobre medidas de protección, denuncia y redes de apoyo disponibles. Tipo registrado: Tráfico y Trata de Personas.', 0, 1, 1, 'Seguimiento', 'Tráfico y Trata de Personas', 'Rodrigo Flores Arce', 'DNA'),
((SELECT id FROM usuarios WHERE ci='920009'), NULL, '2026-07', '2026-07-22', 'Patrocinio Legal', 'Se realizó entrevista inicial, escucha activa y orientación sobre la ruta de atención correspondiente. Tipo registrado: Violencia Física.', 0, 1, 1, 'Seguimiento', 'Violencia Física', 'Sofía Vargas Callisaya', 'UMADIS'),
((SELECT id FROM usuarios WHERE ci='920010'), NULL, '2026-07', '2026-07-23', 'Conciliación', 'Se brindó orientación legal, social y psicológica según necesidad identificada en plataforma. Tipo registrado: Violencia Económica.', 0, 1, 1, 'Seguimiento', 'Violencia Económica', 'Ana María Quispe Choque, Valeria Rojas Lima', 'Policía'),
((SELECT id FROM usuarios WHERE ci='920002'), NULL, '2026-07', '2026-07-25', 'Derivación institucional', 'Se registró información del caso y se explicó la documentación necesaria para continuar la atención. Tipo registrado: Violencia Mediática.', 0, 1, 1, 'Seguimiento', 'Violencia Mediática', 'Diego Condori Paredes, Camila Nina Apaza', 'Juzgado de Familia'),
((SELECT id FROM usuarios WHERE ci='920003'), NULL, '2026-07', '2026-07-26', 'Seguimiento de caso', 'Se coordinó con institución correspondiente para derivación y seguimiento del proceso. Tipo registrado: Asistencia Familiar.', 0, 1, 1, 'Seguimiento', 'Asistencia Familiar', NULL, 'Centro de Salud'),
((SELECT id FROM usuarios WHERE ci='920004'), NULL, '2026-07', '2026-07-27', 'Atención psicológica inicial', 'Se efectuó revisión del avance del caso y actualización de datos relevantes. Tipo registrado: Reconocimiento de Hijos.', 0, 1, 1, 'Seguimiento', 'Reconocimiento de Hijos', 'Ana María Quispe Choque', 'DNA'),
((SELECT id FROM usuarios WHERE ci='920005'), NULL, '2026-07', '2026-07-01', 'Atención social inicial', 'Se acompañó a la persona usuaria en la comprensión de sus derechos y opciones institucionales. Tipo registrado: No Corresponde.', 1, 1, 1, 'Seguimiento', 'No Corresponde', 'Valeria Rojas Lima', 'UMADIS'),
((SELECT id FROM usuarios WHERE ci='920006'), NULL, '2026-07', '2026-07-02', 'Orientación legal', 'Se brindó contención inicial y se recomendó continuidad de atención especializada. Tipo registrado: Violencia Sexual.', 0, 1, 1, 'Seguimiento', 'Violencia Sexual', 'Diego Condori Paredes', 'Policía'),
((SELECT id FROM usuarios WHERE ci='9870322'), NULL, '2026-07', '2026-07-03', 'Entrevista', 'Se orientó sobre medidas de protección, denuncia y redes de apoyo disponibles. Tipo registrado: Violencia Simbólica.', 0, 1, 1, 'Seguimiento', 'Violencia Simbólica', 'Camila Nina Apaza', 'Juzgado de Familia'),
((SELECT id FROM usuarios WHERE ci='920008'), NULL, '2026-07', '2026-07-05', 'Orientación en Plataforma', 'Se realizó entrevista inicial, escucha activa y orientación sobre la ruta de atención correspondiente. Tipo registrado: Violencia Feminicidio.', 0, 1, 1, 'Seguimiento', 'Violencia Feminicidio', 'Marco Antonio Choque Flores', 'Centro de Salud'),
((SELECT id FROM usuarios WHERE ci='920009'), NULL, '2026-07', '2026-07-06', 'Visita Domiciliaria', 'Se brindó orientación legal, social y psicológica según necesidad identificada en plataforma. Tipo registrado: Divorcio.', 0, 1, 0, 'Orientación en Plataforma', 'Divorcio', 'Lucía Mamani Quisbert', 'DNA'),
((SELECT id FROM usuarios WHERE ci='920010'), NULL, '2026-07', '2026-07-07', 'Acompañamiento', 'Se registró información del caso y se explicó la documentación necesaria para continuar la atención. Tipo registrado: Trabajo Infantil.', 0, 1, 0, 'Orientación en Plataforma', 'Trabajo Infantil', 'Rodrigo Flores Arce', 'UMADIS'),
((SELECT id FROM usuarios WHERE ci='920002'), NULL, '2026-07', '2026-07-09', 'Patrocinio Legal', 'Se coordinó con institución correspondiente para derivación y seguimiento del proceso. Tipo registrado: Violencia Psicológica.', 0, 1, 0, 'Orientación en Plataforma', 'Violencia Psicológica', 'Sofía Vargas Callisaya', 'Policía'),
((SELECT id FROM usuarios WHERE ci='920003'), NULL, '2026-07', '2026-07-10', 'Conciliación', 'Se efectuó revisión del avance del caso y actualización de datos relevantes. Tipo registrado: Violencia Patrimonial.', 1, 0, 0, 'Orientación en Plataforma', 'Violencia Patrimonial', 'Ana María Quispe Choque, Valeria Rojas Lima', 'Juzgado de Familia'),
((SELECT id FROM usuarios WHERE ci='920004'), NULL, '2026-07', '2026-07-11', 'Derivación institucional', 'Se acompañó a la persona usuaria en la comprensión de sus derechos y opciones institucionales. Tipo registrado: Violencia Digital.', 0, 1, 0, 'Orientación en Plataforma', 'Violencia Digital', 'Diego Condori Paredes, Camila Nina Apaza', 'Centro de Salud'),
((SELECT id FROM usuarios WHERE ci='920005'), NULL, '2026-07', '2026-07-13', 'Seguimiento de caso', 'Se brindó contención inicial y se recomendó continuidad de atención especializada. Tipo registrado: Guarda y Tenencia.', 1, 1, 0, 'Orientación en Plataforma', 'Guarda y Tenencia', NULL, 'DNA'),
((SELECT id FROM usuarios WHERE ci='920006'), NULL, '2026-07', '2026-07-14', 'Atención psicológica inicial', 'Se orientó sobre medidas de protección, denuncia y redes de apoyo disponibles. Tipo registrado: Tráfico y Trata de Personas.', 0, 1, 0, 'Orientación en Plataforma', 'Tráfico y Trata de Personas', 'Ana María Quispe Choque', 'UMADIS');

-- Informes de prueba para revisar la vista de administración.
INSERT INTO informes (usuario_id, periodo, estado) VALUES
((SELECT id FROM usuarios WHERE ci='9870322'), '2026-06', 'BORRADOR'),
((SELECT id FROM usuarios WHERE ci='9870322'), '2026-07', 'BORRADOR'),
((SELECT id FROM usuarios WHERE ci='920002'), '2026-06', 'ENVIADO'),
((SELECT id FROM usuarios WHERE ci='920002'), '2026-07', 'APROBADO'),
((SELECT id FROM usuarios WHERE ci='920003'), '2026-06', 'APROBADO'),
((SELECT id FROM usuarios WHERE ci='920003'), '2026-07', 'RECHAZADO'),
((SELECT id FROM usuarios WHERE ci='920004'), '2026-06', 'RECHAZADO'),
((SELECT id FROM usuarios WHERE ci='920004'), '2026-07', 'BORRADOR'),
((SELECT id FROM usuarios WHERE ci='920005'), '2026-06', 'BORRADOR'),
((SELECT id FROM usuarios WHERE ci='920005'), '2026-07', 'ENVIADO'),
((SELECT id FROM usuarios WHERE ci='920006'), '2026-06', 'ENVIADO'),
((SELECT id FROM usuarios WHERE ci='920006'), '2026-07', 'APROBADO'),
((SELECT id FROM usuarios WHERE ci='920007'), '2026-06', 'APROBADO'),
((SELECT id FROM usuarios WHERE ci='920007'), '2026-07', 'BORRADOR'),
((SELECT id FROM usuarios WHERE ci='920008'), '2026-06', 'BORRADOR'),
((SELECT id FROM usuarios WHERE ci='920008'), '2026-07', 'ENVIADO'),
((SELECT id FROM usuarios WHERE ci='920009'), '2026-06', 'ENVIADO'),
((SELECT id FROM usuarios WHERE ci='920009'), '2026-07', 'APROBADO'),
((SELECT id FROM usuarios WHERE ci='920010'), '2026-06', 'APROBADO'),
((SELECT id FROM usuarios WHERE ci='920010'), '2026-07', 'BORRADOR');

COMMIT;

-- Verificación rápida opcional después de cargar:
-- SELECT periodo, COUNT(*) FROM actividades_prevencion GROUP BY periodo ORDER BY periodo;
-- SELECT periodo, tipo_caso, COUNT(*) FROM actividades_atencion GROUP BY periodo, tipo_caso ORDER BY periodo, tipo_caso;
-- SELECT tipo_denuncia, COUNT(*) FROM actividades_atencion GROUP BY tipo_denuncia ORDER BY COUNT(*) DESC;
