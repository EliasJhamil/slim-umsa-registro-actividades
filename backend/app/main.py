from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import auth, usuarios, territorio, asignaciones, prevencion, atencion, informes, estadisticas

settings = get_settings()

# ── Instancia principal de FastAPI ───────────────────────
app = FastAPI(
    title="SLIM-UMSA API",
    description="Sistema de Gestión de Actividades — DIPGIS UMSA",
    version="1.0.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
)

# ── CORS ─────────────────────────────────────────────────
# Solo acepta requests del dominio del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,            # necesario para cookies httpOnly
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────
# Se importan aquí para evitar imports circulares.
# Se agregan en los pasos siguientes; por ahora el bloque
# queda preparado y comentado para ir descomentando.


app.include_router(auth.router,          prefix="/api/auth",         tags=["Auth"])
app.include_router(usuarios.router,      prefix="/api/usuarios",     tags=["Usuarios"])
app.include_router(territorio.router,    prefix="/api",              tags=["Territorio"])
app.include_router(asignaciones.router,  prefix="/api/asignaciones", tags=["Asignaciones"])
app.include_router(prevencion.router,    prefix="/api/prevenciones", tags=["Prevención"])
app.include_router(atencion.router,      prefix="/api/atenciones",   tags=["Atención"])
app.include_router(informes.router,      prefix="/api/informes",     tags=["Informes"])
app.include_router(estadisticas.router,  prefix="/api/stats",        tags=["Estadísticas"])


# ── Health check ─────────────────────────────────────────

@app.get("/", tags=["Sistema"])
def root():
    return {
        "message": "SLIM-UMSA API funcionando",
        "docs": "/docs",
        "health": "/api/health"
    }


@app.get("/api/health", tags=["Sistema"])
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}