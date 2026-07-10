from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ActividadPrevencion(Base):
    __tablename__ = "actividades_prevencion"

    id            = Column(Integer, primary_key=True, index=True)
    usuario_id    = Column(Integer, ForeignKey("usuarios.id"),     nullable=False)
    asignacion_id = Column(Integer, ForeignKey("asignaciones.id"), nullable=True)
    periodo       = Column(String(7),  nullable=False, index=True)  # YYYY-MM
    fecha         = Column(String(10), nullable=False)               # YYYY-MM-DD

    # ── Campos del Word ───────────────────────────────────────
    # Col 1: NOMBRE DE LA ACTIVIDAD
    nombre        = Column(String(200), nullable=False)
    # Col 2: DESCRIPCIÓN DE LA ACTIVIDAD Y RESULTADOS ALCANZADOS
    descripcion   = Column(Text, nullable=True)
    # Col 3: POBLACIÓN ALCANZADA
    poblacion_mujeres      = Column(Integer, default=0)
    poblacion_hombres      = Column(Integer, default=0)
    poblacion_ninez        = Column(Boolean, default=False)
    poblacion_adulto_mayor = Column(Boolean, default=False)
    poblacion_discapacidad = Column(Boolean, default=False)
    # Col 4: EQUIPO MULTIDISCIPLINARIO DE ESTUDIANTES (CSV de nombres)
    # ej: "Carlos Mamani, Ana Flores, Luis Quispe"
    participantes = Column(Text, nullable=True)
    # Col 5: PUBLICACIÓN EN REDES SOCIALES
    url_redes     = Column(String(500), nullable=True)
    # Col 6: ENLACE A CARPETA DE DRIVE CON ANEXOS
    url_drive     = Column(String(500), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    usuario    = relationship("Usuario",    back_populates="prevenciones")
    asignacion = relationship("Asignacion", back_populates="prevenciones")
