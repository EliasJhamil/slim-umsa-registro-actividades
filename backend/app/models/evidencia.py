from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Evidencia(Base):
    """
    Polimórfica: puede pertenecer a una actividad de prevención O atención.
    actividad_tipo indica cuál: 'prevencion' | 'atencion'
    actividad_id   es el id en la tabla correspondiente.
    """
    __tablename__ = "evidencias"

    id             = Column(Integer, primary_key=True, index=True)
    actividad_tipo = Column(String(20), nullable=False)   # 'prevencion' | 'atencion'
    actividad_id   = Column(Integer, nullable=False, index=True)
    tipo_archivo   = Column(String(50), nullable=True)    # 'imagen', 'pdf', 'video'
    url            = Column(String(500), nullable=False)
    nombre         = Column(String(255), nullable=True)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())