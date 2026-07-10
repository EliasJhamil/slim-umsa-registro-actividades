from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class TokenInvitacion(Base):
    """
    Token UUID que el admin genera para que un estudiante
    se registre sin que el admin le entregue contraseña manualmente.
    Expira en 72h y solo puede usarse una vez.
    """
    __tablename__ = "tokens_invitacion"

    id            = Column(Integer, primary_key=True, index=True)
    token         = Column(String(64), nullable=False, unique=True, index=True)
    email_destino = Column(String(150), nullable=True)
    carrera_id    = Column(Integer, ForeignKey("carreras.id"), nullable=True)
    usado         = Column(Boolean, default=False, nullable=False)
    expira_en     = Column(DateTime(timezone=True), nullable=False)
    creado_por    = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    carrera   = relationship("Carrera")
    creador   = relationship("Usuario", foreign_keys=[creado_por])