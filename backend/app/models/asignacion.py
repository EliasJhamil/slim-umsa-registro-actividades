from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Asignacion(Base):
    """
    Relación estudiante ↔ grupo por periodo.
    Un estudiante puede tener una sola asignación activa por periodo.
    """
    __tablename__ = "asignaciones"

    id         = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    grupo_id   = Column(Integer, ForeignKey("grupos.id"), nullable=False)
    # Formato YYYY-MM  ej: "2026-05"
    periodo    = Column(String(7), nullable=False, index=True)
    activo     = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # ── Relaciones ───────────────────────────────────────
    usuario      = relationship("Usuario", back_populates="asignaciones")
    grupo        = relationship("Grupo", back_populates="asignaciones")
    prevenciones = relationship("ActividadPrevencion", back_populates="asignacion")
    atenciones   = relationship("ActividadAtencion", back_populates="asignacion")