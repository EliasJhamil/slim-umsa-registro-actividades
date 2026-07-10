from sqlalchemy.orm import Session
from app.database import engine, Base
from app.models import *
from app.core.security import hash_password


def init_db(db: Session) -> None:
    Base.metadata.create_all(bind=engine)

    # ── Roles ─────────────────────────────────────────────────
    for nombre in ["ADMIN", "ESTUDIANTE"]:
        if not db.query(Rol).filter_by(nombre=nombre).first():
            db.add(Rol(nombre=nombre))
    db.commit()

    # ── Carreras base ──────────────────────────────────────────
    for nombre in ["Trabajo Social", "Psicología", "Derecho"]:
        if not db.query(Carrera).filter_by(nombre=nombre).first():
            db.add(Carrera(nombre=nombre))
    db.commit()

    # ── Admin por defecto ──────────────────────────────────────
    rol_admin = db.query(Rol).filter_by(nombre="ADMIN").first()
    if not db.query(Usuario).filter_by(ci="admin").first():
        db.add(Usuario(
            ci="admin",
            nombres_completos="Administrador DIPGIS",
            email="admin@umsa.bo",
            password_hash=hash_password("Admin2026!"),
            rol_id=rol_admin.id,
            activo=True,
        ))
        db.commit()
        print("✅ Admin creado: CI=admin / PW=Admin2026!")
    else:
        print("ℹ️  Admin ya existe.")
