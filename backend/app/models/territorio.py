from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Municipio(Base):
    __tablename__ = "municipios"

    id         = Column(Integer, primary_key=True)
    nombre     = Column(String(100), unique=True, nullable=False)
    activo     = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    comunidades = relationship("Comunidad", back_populates="municipio")
    usuarios    = relationship("Usuario",   back_populates="municipio")


class Comunidad(Base):
    __tablename__ = "comunidades"

    id           = Column(Integer, primary_key=True)
    nombre       = Column(String(100), nullable=False)
    municipio_id = Column(Integer, ForeignKey("municipios.id"), nullable=False)
    activa       = Column(Boolean, default=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    municipio = relationship("Municipio", back_populates="comunidades")
    grupos    = relationship("Grupo",     back_populates="comunidad")


class Grupo(Base):
    __tablename__ = "grupos"

    id              = Column(Integer, primary_key=True)
    nombre          = Column(String(100), nullable=False)
    comunidad_id    = Column(Integer, ForeignKey("comunidades.id"), nullable=False)
    max_estudiantes = Column(Integer, default=3, nullable=False)  # configurable
    activo          = Column(Boolean, default=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    comunidad    = relationship("Comunidad", back_populates="grupos")
    asignaciones = relationship("Asignacion", back_populates="grupo")
