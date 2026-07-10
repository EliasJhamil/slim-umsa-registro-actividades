from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import get_settings

settings = get_settings()

# ── Motor de conexión ────────────────────────────────────
# pool_pre_ping=True: verifica que la conexión sigue viva antes de usarla
# (evita errores si Postgres reinició)
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,          # conexiones simultáneas máximas
    max_overflow=20,       # conexiones extra en picos de carga
)

# ── Fábrica de sesiones ──────────────────────────────────
SessionLocal = sessionmaker(
    autocommit=False,      # control manual de transacciones
    autoflush=False,
    bind=engine,
)


# ── Clase base para todos los modelos ORM ────────────────
class Base(DeclarativeBase):
    pass


# ── Dependencia de FastAPI ───────────────────────────────
def get_db():
    """
    Generador que abre una sesión, la entrega al endpoint,
    y la cierra automáticamente al terminar (con o sin error).

    Uso en un router:
        def mi_endpoint(db: Session = Depends(get_db)):
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()