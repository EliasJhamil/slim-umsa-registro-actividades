--
-- PostgreSQL database dump
--

\restrict mEQgCZVAxWXpXrxfWWK13Luhkx8aMjUaXJzpAhBSPahz381KyLAl6A9JT7e5hJt

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: estadoinforme; Type: TYPE; Schema: public; Owner: slim_user
--

CREATE TYPE public.estadoinforme AS ENUM (
    'BORRADOR',
    'ENVIADO',
    'APROBADO',
    'RECHAZADO'
);


ALTER TYPE public.estadoinforme OWNER TO slim_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actividades_atencion; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.actividades_atencion (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    asignacion_id integer,
    periodo character varying(7) NOT NULL,
    fecha character varying(10) NOT NULL,
    tipo_actividad character varying(100) NOT NULL,
    descripcion text,
    denunciantes_h integer,
    denunciantes_m integer,
    seguimiento smallint,
    tipo_caso character varying(100) NOT NULL,
    tipo_denuncia character varying(150) NOT NULL,
    participantes text,
    institucion character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.actividades_atencion OWNER TO slim_user;

--
-- Name: actividades_atencion_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.actividades_atencion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.actividades_atencion_id_seq OWNER TO slim_user;

--
-- Name: actividades_atencion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.actividades_atencion_id_seq OWNED BY public.actividades_atencion.id;


--
-- Name: actividades_prevencion; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.actividades_prevencion (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    asignacion_id integer,
    periodo character varying(7) NOT NULL,
    fecha character varying(10) NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    poblacion_mujeres integer,
    poblacion_hombres integer,
    poblacion_ninez boolean,
    poblacion_adulto_mayor boolean,
    poblacion_discapacidad boolean,
    participantes text,
    url_redes character varying(500),
    url_drive character varying(500),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.actividades_prevencion OWNER TO slim_user;

--
-- Name: actividades_prevencion_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.actividades_prevencion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.actividades_prevencion_id_seq OWNER TO slim_user;

--
-- Name: actividades_prevencion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.actividades_prevencion_id_seq OWNED BY public.actividades_prevencion.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO slim_user;

--
-- Name: asignaciones; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.asignaciones (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    grupo_id integer NOT NULL,
    periodo character varying(7) NOT NULL,
    activo boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.asignaciones OWNER TO slim_user;

--
-- Name: asignaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.asignaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.asignaciones_id_seq OWNER TO slim_user;

--
-- Name: asignaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.asignaciones_id_seq OWNED BY public.asignaciones.id;


--
-- Name: carreras; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.carreras (
    id integer NOT NULL,
    nombre character varying(120) NOT NULL,
    descripcion text
);


ALTER TABLE public.carreras OWNER TO slim_user;

--
-- Name: carreras_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.carreras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carreras_id_seq OWNER TO slim_user;

--
-- Name: carreras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.carreras_id_seq OWNED BY public.carreras.id;


--
-- Name: comunidades; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.comunidades (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    municipio_id integer NOT NULL,
    activa boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.comunidades OWNER TO slim_user;

--
-- Name: comunidades_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.comunidades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comunidades_id_seq OWNER TO slim_user;

--
-- Name: comunidades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.comunidades_id_seq OWNED BY public.comunidades.id;


--
-- Name: evidencias; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.evidencias (
    id integer NOT NULL,
    actividad_tipo character varying(20) NOT NULL,
    actividad_id integer NOT NULL,
    tipo_archivo character varying(50),
    url character varying(500) NOT NULL,
    nombre character varying(255),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.evidencias OWNER TO slim_user;

--
-- Name: evidencias_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.evidencias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.evidencias_id_seq OWNER TO slim_user;

--
-- Name: evidencias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.evidencias_id_seq OWNED BY public.evidencias.id;


--
-- Name: grupos; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.grupos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    comunidad_id integer NOT NULL,
    max_estudiantes integer NOT NULL,
    activo boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.grupos OWNER TO slim_user;

--
-- Name: grupos_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.grupos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.grupos_id_seq OWNER TO slim_user;

--
-- Name: grupos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.grupos_id_seq OWNED BY public.grupos.id;


--
-- Name: informes; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.informes (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    periodo character varying(7) NOT NULL,
    estado public.estadoinforme NOT NULL,
    aprobado_por integer,
    fecha_envio timestamp with time zone,
    fecha_aprobacion timestamp with time zone,
    observaciones text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.informes OWNER TO slim_user;

--
-- Name: informes_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.informes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.informes_id_seq OWNER TO slim_user;

--
-- Name: informes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.informes_id_seq OWNED BY public.informes.id;


--
-- Name: logs_actividad; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.logs_actividad (
    id integer NOT NULL,
    usuario_id integer,
    accion character varying(100) NOT NULL,
    entidad character varying(100),
    entidad_id integer,
    ip character varying(45),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.logs_actividad OWNER TO slim_user;

--
-- Name: logs_actividad_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.logs_actividad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.logs_actividad_id_seq OWNER TO slim_user;

--
-- Name: logs_actividad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.logs_actividad_id_seq OWNED BY public.logs_actividad.id;


--
-- Name: municipios; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.municipios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.municipios OWNER TO slim_user;

--
-- Name: municipios_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.municipios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.municipios_id_seq OWNER TO slim_user;

--
-- Name: municipios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.municipios_id_seq OWNED BY public.municipios.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre character varying(20) NOT NULL
);


ALTER TABLE public.roles OWNER TO slim_user;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO slim_user;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: tokens_invitacion; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.tokens_invitacion (
    id integer NOT NULL,
    token character varying(64) NOT NULL,
    email_destino character varying(150),
    carrera_id integer,
    usado boolean NOT NULL,
    expira_en timestamp with time zone NOT NULL,
    creado_por integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.tokens_invitacion OWNER TO slim_user;

--
-- Name: tokens_invitacion_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.tokens_invitacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tokens_invitacion_id_seq OWNER TO slim_user;

--
-- Name: tokens_invitacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.tokens_invitacion_id_seq OWNED BY public.tokens_invitacion.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: slim_user
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    ci character varying(20) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol_id integer NOT NULL,
    activo boolean NOT NULL,
    email character varying(150),
    nombres_completos character varying(200) NOT NULL,
    sexo character varying(10),
    fecha_nacimiento date,
    registro_universitario character varying(50),
    celular character varying(20),
    carrera_id integer,
    municipio_id integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.usuarios OWNER TO slim_user;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: slim_user
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuarios_id_seq OWNER TO slim_user;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: slim_user
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: actividades_atencion id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.actividades_atencion ALTER COLUMN id SET DEFAULT nextval('public.actividades_atencion_id_seq'::regclass);


--
-- Name: actividades_prevencion id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.actividades_prevencion ALTER COLUMN id SET DEFAULT nextval('public.actividades_prevencion_id_seq'::regclass);


--
-- Name: asignaciones id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.asignaciones ALTER COLUMN id SET DEFAULT nextval('public.asignaciones_id_seq'::regclass);


--
-- Name: carreras id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.carreras ALTER COLUMN id SET DEFAULT nextval('public.carreras_id_seq'::regclass);


--
-- Name: comunidades id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.comunidades ALTER COLUMN id SET DEFAULT nextval('public.comunidades_id_seq'::regclass);


--
-- Name: evidencias id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.evidencias ALTER COLUMN id SET DEFAULT nextval('public.evidencias_id_seq'::regclass);


--
-- Name: grupos id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.grupos ALTER COLUMN id SET DEFAULT nextval('public.grupos_id_seq'::regclass);


--
-- Name: informes id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.informes ALTER COLUMN id SET DEFAULT nextval('public.informes_id_seq'::regclass);


--
-- Name: logs_actividad id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.logs_actividad ALTER COLUMN id SET DEFAULT nextval('public.logs_actividad_id_seq'::regclass);


--
-- Name: municipios id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.municipios ALTER COLUMN id SET DEFAULT nextval('public.municipios_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: tokens_invitacion id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.tokens_invitacion ALTER COLUMN id SET DEFAULT nextval('public.tokens_invitacion_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: actividades_atencion; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.actividades_atencion (id, usuario_id, asignacion_id, periodo, fecha, tipo_actividad, descripcion, denunciantes_h, denunciantes_m, seguimiento, tipo_caso, tipo_denuncia, participantes, institucion, created_at, updated_at) FROM stdin;
1	4	\N	2026-06	2026-06-26	Visita Domiciliaria	xgbfhdfbsfgnbf\n	2	4	0	Orientación en Plataforma	Asistencia Familiar	\N	\N	2026-06-28 22:37:29.370375+00	\N
\.


--
-- Data for Name: actividades_prevencion; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.actividades_prevencion (id, usuario_id, asignacion_id, periodo, fecha, nombre, descripcion, poblacion_mujeres, poblacion_hombres, poblacion_ninez, poblacion_adulto_mayor, poblacion_discapacidad, participantes, url_redes, url_drive, created_at, updated_at) FROM stdin;
1	4	\N	2006-11	2006-11-25	Taller de Inteleigencia		3	3	t	t	f	\N	\N	\N	2026-06-28 21:37:09.175221+00	\N
2	4	\N	2026-02	2026-02-25	Violencia Digital	Fue bueno	2	2	t	t	f	\N	facebook	intagram	2026-06-28 21:40:57.050905+00	\N
3	4	\N	2026-04	2026-04-15	gegeagae	gadsgdsgsdghdsfhdfhjdfhjdzsg	4	5	t	f	f	\N	fadsgs<dgs	gdsgsdsg	2026-06-28 21:46:25.697985+00	\N
4	4	\N	2026-06	2026-06-25	dgsgdshds	asdgsdgvdsbgvdsbghs	8	0	t	t	f	\N	gdsghdfhds	fasdgsdbd	2026-06-28 21:46:58.735404+00	2026-06-28 22:43:05.063768+00
5	4	\N	2026-06	2026-06-26	Campaña de sensibilización	dsffds	3	4	f	t	t	aaaa, bbbb	dx	sfadfs	2026-06-29 00:05:49.092206+00	2026-06-29 00:06:13.542924+00
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.alembic_version (version_num) FROM stdin;
0001
\.


--
-- Data for Name: asignaciones; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.asignaciones (id, usuario_id, grupo_id, periodo, activo, created_at) FROM stdin;
\.


--
-- Data for Name: carreras; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.carreras (id, nombre, descripcion) FROM stdin;
1	Trabajo Social	\N
2	Derecho	\N
3	Psicologia	\N
4	Medicina	\N
5	Enfermeria	\N
6	Comunicacion Social	\N
\.


--
-- Data for Name: comunidades; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.comunidades (id, nombre, municipio_id, activa, created_at) FROM stdin;
\.


--
-- Data for Name: evidencias; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.evidencias (id, actividad_tipo, actividad_id, tipo_archivo, url, nombre, created_at) FROM stdin;
\.


--
-- Data for Name: grupos; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.grupos (id, nombre, comunidad_id, max_estudiantes, activo, created_at) FROM stdin;
\.


--
-- Data for Name: informes; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.informes (id, usuario_id, periodo, estado, aprobado_por, fecha_envio, fecha_aprobacion, observaciones, created_at, updated_at) FROM stdin;
1	4	2026-06	BORRADOR	\N	\N	\N	\N	2026-06-28 20:54:14.904266+00	\N
2	4	2026-07	BORRADOR	\N	\N	\N	\N	2026-07-05 17:51:18.84276+00	\N
\.


--
-- Data for Name: logs_actividad; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.logs_actividad (id, usuario_id, accion, entidad, entidad_id, ip, created_at) FROM stdin;
\.


--
-- Data for Name: municipios; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.municipios (id, nombre, activo, created_at) FROM stdin;
1	Sapacachi	t	2026-06-28 20:51:01.329223+00
2	Lima peru	t	2026-06-28 20:51:20.587343+00
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.roles (id, nombre) FROM stdin;
1	ADMIN
2	ESTUDIANTE
\.


--
-- Data for Name: tokens_invitacion; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.tokens_invitacion (id, token, email_destino, carrera_id, usado, expira_en, creado_por, created_at) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: slim_user
--

COPY public.usuarios (id, ci, password_hash, rol_id, activo, email, nombres_completos, sexo, fecha_nacimiento, registro_universitario, celular, carrera_id, municipio_id, created_at, updated_at) FROM stdin;
1	00000000	$2b$12$yYKv5u1tvSf1tJER8u7VmuLeni7HWRP2DmD298jmbaz8jLHPdNjMy	1	t	admin@umsa.bo	Administrador SLIM	\N	\N	\N	\N	\N	\N	2026-06-28 20:32:40.410126+00	\N
2	11111	$2b$12$8JhUmcJ.GI1IVu7zVCm/nedNt31zfkz58dWC9wK67fXZw1FgDTw5y	2	t	aaaa@gmial.com	aaaa	M	2001-05-28	11111	79111254	1	2	2026-06-28 20:49:39.153736+00	2026-06-29 00:03:39.123492+00
3	9870322	$2b$12$JV7u6pEFaLisf9ZfzhvfDOo63NYAiL9XdT26sQCjrXjkh.O0kdCMi	2	t	bbbb@gmail.com	bbbb	F	\N	222222	578542	3	2	2026-06-28 20:50:43.256513+00	2026-06-29 00:03:42.585071+00
4	9870311	$2b$12$f7ecyAz0JXGPS1qr7xDdYuT5iQFCgwTIKIC3jG5WTbunXcmxxwLFa	2	t	jhamil@gmail.com	Jhamil Elias Mamani Colque	M	2004-11-29	1845279	79111239	2	2	2026-06-28 20:53:48.383196+00	2026-06-29 00:04:59.510615+00
\.


--
-- Name: actividades_atencion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.actividades_atencion_id_seq', 1, true);


--
-- Name: actividades_prevencion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.actividades_prevencion_id_seq', 5, true);


--
-- Name: asignaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.asignaciones_id_seq', 1, false);


--
-- Name: carreras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.carreras_id_seq', 6, true);


--
-- Name: comunidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.comunidades_id_seq', 1, false);


--
-- Name: evidencias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.evidencias_id_seq', 1, false);


--
-- Name: grupos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.grupos_id_seq', 1, false);


--
-- Name: informes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.informes_id_seq', 2, true);


--
-- Name: logs_actividad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.logs_actividad_id_seq', 1, false);


--
-- Name: municipios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.municipios_id_seq', 2, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: tokens_invitacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.tokens_invitacion_id_seq', 1, false);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: slim_user
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 4, true);


--
-- Name: actividades_atencion actividades_atencion_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.actividades_atencion
    ADD CONSTRAINT actividades_atencion_pkey PRIMARY KEY (id);


--
-- Name: actividades_prevencion actividades_prevencion_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.actividades_prevencion
    ADD CONSTRAINT actividades_prevencion_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: asignaciones asignaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.asignaciones
    ADD CONSTRAINT asignaciones_pkey PRIMARY KEY (id);


--
-- Name: carreras carreras_nombre_key; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_nombre_key UNIQUE (nombre);


--
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (id);


--
-- Name: comunidades comunidades_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.comunidades
    ADD CONSTRAINT comunidades_pkey PRIMARY KEY (id);


--
-- Name: evidencias evidencias_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.evidencias
    ADD CONSTRAINT evidencias_pkey PRIMARY KEY (id);


--
-- Name: grupos grupos_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.grupos
    ADD CONSTRAINT grupos_pkey PRIMARY KEY (id);


--
-- Name: informes informes_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.informes
    ADD CONSTRAINT informes_pkey PRIMARY KEY (id);


--
-- Name: logs_actividad logs_actividad_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.logs_actividad
    ADD CONSTRAINT logs_actividad_pkey PRIMARY KEY (id);


--
-- Name: municipios municipios_nombre_key; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_nombre_key UNIQUE (nombre);


--
-- Name: municipios municipios_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_pkey PRIMARY KEY (id);


--
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: tokens_invitacion tokens_invitacion_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.tokens_invitacion
    ADD CONSTRAINT tokens_invitacion_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_registro_universitario_key; Type: CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_registro_universitario_key UNIQUE (registro_universitario);


--
-- Name: ix_actividades_atencion_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_actividades_atencion_id ON public.actividades_atencion USING btree (id);


--
-- Name: ix_actividades_atencion_periodo; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_actividades_atencion_periodo ON public.actividades_atencion USING btree (periodo);


--
-- Name: ix_actividades_prevencion_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_actividades_prevencion_id ON public.actividades_prevencion USING btree (id);


--
-- Name: ix_actividades_prevencion_periodo; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_actividades_prevencion_periodo ON public.actividades_prevencion USING btree (periodo);


--
-- Name: ix_asignaciones_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_asignaciones_id ON public.asignaciones USING btree (id);


--
-- Name: ix_asignaciones_periodo; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_asignaciones_periodo ON public.asignaciones USING btree (periodo);


--
-- Name: ix_carreras_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_carreras_id ON public.carreras USING btree (id);


--
-- Name: ix_evidencias_actividad_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_evidencias_actividad_id ON public.evidencias USING btree (actividad_id);


--
-- Name: ix_evidencias_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_evidencias_id ON public.evidencias USING btree (id);


--
-- Name: ix_informes_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_informes_id ON public.informes USING btree (id);


--
-- Name: ix_informes_periodo; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_informes_periodo ON public.informes USING btree (periodo);


--
-- Name: ix_logs_actividad_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_logs_actividad_id ON public.logs_actividad USING btree (id);


--
-- Name: ix_roles_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_roles_id ON public.roles USING btree (id);


--
-- Name: ix_tokens_invitacion_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_tokens_invitacion_id ON public.tokens_invitacion USING btree (id);


--
-- Name: ix_tokens_invitacion_token; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE UNIQUE INDEX ix_tokens_invitacion_token ON public.tokens_invitacion USING btree (token);


--
-- Name: ix_usuarios_ci; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE UNIQUE INDEX ix_usuarios_ci ON public.usuarios USING btree (ci);


--
-- Name: ix_usuarios_email; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE UNIQUE INDEX ix_usuarios_email ON public.usuarios USING btree (email);


--
-- Name: ix_usuarios_id; Type: INDEX; Schema: public; Owner: slim_user
--

CREATE INDEX ix_usuarios_id ON public.usuarios USING btree (id);


--
-- Name: actividades_atencion actividades_atencion_asignacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.actividades_atencion
    ADD CONSTRAINT actividades_atencion_asignacion_id_fkey FOREIGN KEY (asignacion_id) REFERENCES public.asignaciones(id);


--
-- Name: actividades_atencion actividades_atencion_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.actividades_atencion
    ADD CONSTRAINT actividades_atencion_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: actividades_prevencion actividades_prevencion_asignacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.actividades_prevencion
    ADD CONSTRAINT actividades_prevencion_asignacion_id_fkey FOREIGN KEY (asignacion_id) REFERENCES public.asignaciones(id);


--
-- Name: actividades_prevencion actividades_prevencion_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.actividades_prevencion
    ADD CONSTRAINT actividades_prevencion_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: asignaciones asignaciones_grupo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.asignaciones
    ADD CONSTRAINT asignaciones_grupo_id_fkey FOREIGN KEY (grupo_id) REFERENCES public.grupos(id);


--
-- Name: asignaciones asignaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.asignaciones
    ADD CONSTRAINT asignaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: comunidades comunidades_municipio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.comunidades
    ADD CONSTRAINT comunidades_municipio_id_fkey FOREIGN KEY (municipio_id) REFERENCES public.municipios(id);


--
-- Name: grupos grupos_comunidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.grupos
    ADD CONSTRAINT grupos_comunidad_id_fkey FOREIGN KEY (comunidad_id) REFERENCES public.comunidades(id);


--
-- Name: informes informes_aprobado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.informes
    ADD CONSTRAINT informes_aprobado_por_fkey FOREIGN KEY (aprobado_por) REFERENCES public.usuarios(id);


--
-- Name: informes informes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.informes
    ADD CONSTRAINT informes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: logs_actividad logs_actividad_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.logs_actividad
    ADD CONSTRAINT logs_actividad_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: tokens_invitacion tokens_invitacion_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.tokens_invitacion
    ADD CONSTRAINT tokens_invitacion_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(id);


--
-- Name: tokens_invitacion tokens_invitacion_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.tokens_invitacion
    ADD CONSTRAINT tokens_invitacion_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuarios(id);


--
-- Name: usuarios usuarios_carrera_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_carrera_id_fkey FOREIGN KEY (carrera_id) REFERENCES public.carreras(id);


--
-- Name: usuarios usuarios_municipio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_municipio_id_fkey FOREIGN KEY (municipio_id) REFERENCES public.municipios(id);


--
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: slim_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

\unrestrict mEQgCZVAxWXpXrxfWWK13Luhkx8aMjUaXJzpAhBSPahz381KyLAl6A9JT7e5hJt

