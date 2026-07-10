from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base
 
 
class Carrera(Base):
    __tablename__ = "carreras"
 
    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String(120), nullable=False, unique=True)
    descripcion = Column(Text, nullable=True)
 
    # Relación inversa: una carrera tiene muchos usuarios
    usuarios = relationship("Usuario", back_populates="carrera")
 
