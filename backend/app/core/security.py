from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import get_settings

settings = get_settings()

# ── Bcrypt ────────────────────────────────────────────────
# cost factor 12: balance entre seguridad y velocidad (~300ms por hash)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(password: str) -> str:
    """Convierte texto plano a hash bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """Compara texto plano contra hash almacenado."""
    return pwd_context.verify(plain, hashed)


# ── JWT ───────────────────────────────────────────────────
def create_access_token(usuario_id: int, rol: str) -> str:
    """
    Token de corta duración (30 min por defecto).
    Se envía en el header Authorization: Bearer <token>
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {
        "sub": str(usuario_id),
        "rol": rol,
        "exp": expire,
        "type": "access",
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(usuario_id: int) -> str:
    """
    Token de larga duración (7 días por defecto).
    Se usa solo para obtener un nuevo access token.
    """
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload = {
        "sub": str(usuario_id),
        "exp": expire,
        "type": "refresh",
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    """
    Decodifica y valida un JWT.
    Retorna el payload si es válido, None si expiró o es inválido.
    """
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None