import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.invitacion import TokenInvitacion


def generar_token_invitacion(
    db: Session,
    creado_por: int,
    email_destino: str = None,
    carrera_id: int = None,
    horas: int = 72,
) -> TokenInvitacion:
    """
    Genera un token UUID de un solo uso.
    Expira en 72 horas por defecto.
    """
    token = secrets.token_urlsafe(48)
    expira = datetime.now(timezone.utc) + timedelta(hours=horas)

    inv = TokenInvitacion(
        token=token,
        email_destino=email_destino,
        carrera_id=carrera_id,
        expira_en=expira,
        creado_por=creado_por,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv


def validar_token_invitacion(db: Session, token: str) -> TokenInvitacion:
    """
    Verifica que el token exista, no haya sido usado y no haya expirado.
    Lanza ValueError si no es válido.
    """
    inv = db.query(TokenInvitacion).filter(TokenInvitacion.token == token).first()

    if not inv:
        raise ValueError("Token de invitación no encontrado")
    if inv.usado:
        raise ValueError("Token ya utilizado")
    if inv.expira_en < datetime.now(timezone.utc):
        raise ValueError("Token expirado")

    return inv


def consumir_token(db: Session, inv: TokenInvitacion) -> None:
    """Marca el token como usado para que no pueda reutilizarse."""
    inv.usado = True
    db.commit()