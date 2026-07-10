from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ActividadAtencion(Base):
    __tablename__ = "actividades_atencion"

    id            = Column(Integer, primary_key=True, index=True)
    usuario_id    = Column(Integer, ForeignKey("usuarios.id"),     nullable=False)
    asignacion_id = Column(Integer, ForeignKey("asignaciones.id"), nullable=True)
    periodo       = Column(String(7),  nullable=False, index=True)  # YYYY-MM
    fecha         = Column(String(10), nullable=False)               # YYYY-MM-DD

    # ── Campos del Word ───────────────────────────────────────
    # Col 1: ACTIVIDAD
    tipo_actividad = Column(String(100), nullable=False)
    # Col 2: DESCRIPCIÓN DE LA ACTIVIDAD Y RESULTADOS ALCANZADOS
    descripcion    = Column(Text, nullable=True)
    # Col 3: DENUNCIANTE H / M
    denunciantes_h = Column(Integer, default=0)
    denunciantes_m = Column(Integer, default=0)
    # Col 4: SEGUIMIENTO (0 = caso nuevo, 1 = seguimiento)
    seguimiento    = Column(SmallInteger, default=0)
    # Col 5: TIPO DE CASO
    tipo_caso      = Column(String(100), nullable=False)
    # Col 6: TIPO DE DENUNCIA
    tipo_denuncia  = Column(String(150), nullable=False)
    # Col 7: ESTUDIANTES (CSV de nombres)
    # ej: "Carlos Mamani, Ana Flores, Luis Quispe"
    participantes  = Column(Text, nullable=True)

    # Extra (no va en Word pero útil)
    institucion    = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    usuario    = relationship("Usuario",    back_populates="atenciones")
    asignacion = relationship("Asignacion", back_populates="atenciones")
