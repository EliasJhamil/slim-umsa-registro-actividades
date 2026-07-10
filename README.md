# slim-umsa-registro-actividades
Sistema web institucional para el registro, seguimiento y generación de informes mensuales del Programa de Vinculación SLIM-UMSA.


# SLIM-UMSA - Registro de Actividades

Sistema web institucional para el registro, seguimiento y generación de informes mensuales del Programa de Vinculación SLIM-UMSA.

La plataforma permite registrar actividades de prevención y atención, administrar estudiantes, municipios, estadísticas e informes mensuales, facilitando el seguimiento y la rendición de cuentas del programa.

---

## Descripción del Proyecto

SLIM-UMSA es una aplicación web orientada a la gestión de registros institucionales del Programa de Vinculación SLIM de la Universidad Mayor de San Andrés.

El sistema permite que los estudiantes registren sus actividades mensuales y que el administrador pueda revisar información consolidada, generar estadísticas y exportar informes en formato Word.

---

## Funcionalidades principales

### Estudiante

- Inicio de sesión con carnet de identidad y contraseña.
- Registro de actividades de prevención.
- Registro de actividades de atención.
- Edición y listado de registros propios.
- Selección de periodo mensual.
- Generación de informe mensual.
- Exportación de informe en formato Word.

### Administrador

- Panel general de administración.
- Gestión de estudiantes.
- Gestión de municipios.
- Revisión de informes mensuales.
- Estadísticas por periodo y municipio.
- Indicadores de prevención y atención.
- Control de usuarios activos e inactivos.

---

## Tecnologías utilizadas

El proyecto fue desarrollado con las siguientes tecnologías:

- Frontend: HTML, CSS y JavaScript
- Backend: FastAPI
- Base de datos: PostgreSQL
- Servidor web: Nginx
- Contenedores: Docker y Docker Compose
- Exportación de documentos: Python DOCX

---

## Estructura del proyecto

```txt
slim-umsa-registro-actividades/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── templates/
│   └── Dockerfile
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
│
├── nginx/
│   └── default.conf
│
├── database/
│   └── init.sql
│
├── backups/
│
├── docker-compose.yml
├── .env.example
├── backup_db.bat
└── README.md
