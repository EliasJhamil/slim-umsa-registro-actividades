from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.usuario import Usuario
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.schemas.auth import LoginRequest, RefreshRequest, TokenResponse

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Autentica con CI + contraseña y devuelve access + refresh token."""
    usuario = db.query(Usuario).filter(
        Usuario.ci == data.ci,
        Usuario.activo == True,
    ).first()

    if not usuario or not verify_password(data.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="CI o contraseña incorrectos",
        )

    return TokenResponse(
        access_token=create_access_token(usuario.id, usuario.rol.nombre),
        refresh_token=create_refresh_token(usuario.id),
        nombre=usuario.nombres_completos,
        rol=usuario.rol.nombre,
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    """Genera un nuevo access token usando el refresh token."""
    payload = decode_token(data.refresh_token)

    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
        )

    usuario = db.query(Usuario).filter(
        Usuario.id == int(payload["sub"]),
        Usuario.activo == True,
    ).first()

    if not usuario:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")

    return TokenResponse(
        access_token=create_access_token(usuario.id, usuario.rol.nombre),
        refresh_token=create_refresh_token(usuario.id),
        nombre=usuario.nombres_completos,
        rol=usuario.rol.nombre,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout():
    """
    El cliente elimina sus tokens localmente.
    En una implementación con blacklist de tokens se agregaría aquí.
    """
    return