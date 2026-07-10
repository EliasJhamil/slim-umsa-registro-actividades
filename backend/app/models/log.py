from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class LogActividad(Base):
    """
    Auditoría básica: cada acción relevante (crear, editar, eliminar,
    aprobar informe, etc.) queda registrada con usuario, IP y timestamp.
    """
    __tablename__ = "logs_actividad"

    id         = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    accion     = Column(String(100), nullable=False)   # ej: "CREAR_PREVENCION"
    entidad    = Column(String(100), nullable=True)    # ej: "actividades_prevencion"
    entidad_id = Column(Integer, nullable=True)        # id del registro afectado
    ip         = Column(String(45), nullable=True)     # IPv4 o IPv6
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario", back_populates="logs")