from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Rol(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(20), unique=True, nullable=False)  # ADMIN | ESTUDIANTE

    usuarios = relationship("Usuario", back_populates="rol")


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    # Credenciales
    ci = Column(String(20), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    rol_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    activo = Column(Boolean, default=True, nullable=False)

    # Datos personales
    email = Column(String(150), unique=True, nullable=True, index=True)
    nombres_completos = Column(String(200), nullable=False)
    sexo = Column(String(10), nullable=True)
    fecha_nacimiento = Column(Date, nullable=True)
    registro_universitario = Column(String(50), unique=True, nullable=True)
    celular = Column(String(20), nullable=True)
    modalidad = Column(String(80), nullable=True)

    # Asignación institucional
    carrera_id = Column(Integer, ForeignKey("carreras.id"), nullable=True)
    municipio_id = Column(Integer, ForeignKey("municipios.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones
    rol = relationship("Rol", back_populates="usuarios")
    carrera = relationship("Carrera", back_populates="usuarios")
    municipio = relationship("Municipio", back_populates="usuarios")

    asignaciones = relationship("Asignacion", back_populates="usuario")
    prevenciones = relationship("ActividadPrevencion", back_populates="usuario")
    atenciones = relationship("ActividadAtencion", back_populates="usuario")
    informes = relationship(
        "Informe",
        back_populates="usuario",
        foreign_keys="Informe.usuario_id",
    )
    logs = relationship("LogActividad", back_populates="usuario")

    @property
    def nombre(self) -> str:
        return self.nombres_completos
