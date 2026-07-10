from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import decode_token
from app.models.usuario import Usuario

# Extrae el token del header: Authorization: Bearer <token>
bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    """
    Dependencia base: valida el JWT y retorna el usuario activo.
    Se inyecta en cualquier endpoint que requiera autenticación.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_token(credentials.credentials)
    if payload is None or payload.get("type") != "access":
        raise credentials_exception

    usuario_id: int = int(payload.get("sub", 0))
    if not usuario_id:
        raise credentials_exception

    usuario = db.query(Usuario).filter(
        Usuario.id == usuario_id,
        Usuario.activo == True,       # borrado lógico: inactivos no pueden operar
    ).first()

    if usuario is None:
        raise credentials_exception

    return usuario


def require_admin(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    """
    Dependencia de segundo nivel: exige que el usuario sea ADMIN.
    Se inyecta en endpoints exclusivos del administrador.

    Uso en un router:
        def mi_endpoint(admin: Usuario = Depends(require_admin)):
    """
    if current_user.rol.nombre != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requiere rol ADMIN para esta operación",
        )
    return current_user


def require_estudiante(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    """
    Dependencia opcional: garantiza que el usuario es ESTUDIANTE.
    Útil si en el futuro se agregan endpoints exclusivos del estudiante.
    """
    if current_user.rol.nombre != "ESTUDIANTE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requiere rol ESTUDIANTE para esta operación",
        )
    return current_user