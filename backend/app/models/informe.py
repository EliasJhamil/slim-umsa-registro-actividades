import enum
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class EstadoInforme(str, enum.Enum):
    BORRADOR  = "BORRADOR"
    ENVIADO   = "ENVIADO"
    APROBADO  = "APROBADO"
    RECHAZADO = "RECHAZADO"


class Informe(Base):
    __tablename__ = "informes"

    id          = Column(Integer, primary_key=True, index=True)
    usuario_id  = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    # Formato YYYY-MM — el informe agrupa todas las actividades del mes
    periodo     = Column(String(7), nullable=False, index=True)
    estado      = Column(Enum(EstadoInforme), default=EstadoInforme.BORRADOR, nullable=False)

    # Admin que aprobó o rechazó
    aprobado_por     = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    fecha_envio      = Column(DateTime(timezone=True), nullable=True)
    fecha_aprobacion = Column(DateTime(timezone=True), nullable=True)
    observaciones    = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ── Relaciones ───────────────────────────────────────
    usuario   = relationship("Usuario", back_populates="informes",
                             foreign_keys=[usuario_id])
    aprobador = relationship("Usuario", foreign_keys=[aprobado_por])