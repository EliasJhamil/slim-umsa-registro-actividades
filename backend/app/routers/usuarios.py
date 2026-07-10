from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta, timezone
import secrets

from app.database import get_db
from app.core.dependencies import require_admin, get_current_user
from app.core.security import hash_password
from app.models.usuario import Usuario, Rol
from app.models.carrera import Carrera
from app.models.invitacion import TokenInvitacion
from app.schemas.usuario import (
    UsuarioCreate, UsuarioOut, UsuarioUpdate,
    InvitacionCreate, InvitacionOut, RegistroConToken,
    RecuperarPasswordRequest, UsuarioParticipanteOut,
)

router = APIRouter()


@router.get("", response_model=List[UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(Usuario).filter(Usuario.activo == True).order_by(Usuario.id).all()


@router.post("", response_model=UsuarioOut, status_code=201)
def crear_usuario(body: UsuarioCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    if db.query(Usuario).filter(Usuario.ci == body.ci).first():
        raise HTTPException(400, "CI ya registrado")

    if body.email and db.query(Usuario).filter(Usuario.email == body.email).first():
        raise HTTPException(400, "Email ya registrado")

    if body.registro_universitario:
        existe_ru = db.query(Usuario).filter(
            Usuario.registro_universitario == body.registro_universitario
        ).first()
        if existe_ru:
            raise HTTPException(400, "Registro universitario ya existe")

    rol = db.query(Rol).filter(Rol.id == body.rol_id).first()
    if not rol:
        raise HTTPException(400, "Rol inválido")

    user = Usuario(
        ci=body.ci,
        password_hash=hash_password(body.password),
        rol_id=body.rol_id,
        nombres_completos=body.nombres_completos,
        email=body.email,
        sexo=body.sexo,
        fecha_nacimiento=body.fecha_nacimiento,
        registro_universitario=body.registro_universitario,
        celular=body.celular,
        modalidad=body.modalidad,
        carrera_id=body.carrera_id,
        municipio_id=body.municipio_id,
        activo=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/{id}", response_model=UsuarioOut)
def actualizar_usuario(
    id: int,
    body: UsuarioUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    user = db.query(Usuario).filter(Usuario.id == id).first()
    if not user:
        raise HTTPException(404, "Usuario no encontrado")

    datos = body.model_dump(exclude_none=True)

    if "email" in datos and datos["email"]:
        existe = db.query(Usuario).filter(Usuario.email == datos["email"], Usuario.id != id).first()
        if existe:
            raise HTTPException(400, "Email ya registrado")

    if "registro_universitario" in datos and datos["registro_universitario"]:
        existe = db.query(Usuario).filter(
            Usuario.registro_universitario == datos["registro_universitario"],
            Usuario.id != id,
        ).first()
        if existe:
            raise HTTPException(400, "Registro universitario ya existe")

    for field, value in datos.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{id}", status_code=204)
def desactivar_usuario(id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    user = db.query(Usuario).filter(Usuario.id == id).first()
    if not user:
        raise HTTPException(404, "Usuario no encontrado")
    user.activo = False
    db.commit()


@router.get("/companeros", response_model=List[UsuarioParticipanteOut])
def companeros_municipio(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    if not current_user.municipio_id:
        return []

    return (
        db.query(Usuario)
        .filter(
            Usuario.municipio_id == current_user.municipio_id,
            Usuario.activo == True,
            Usuario.id != current_user.id,
        )
        .order_by(Usuario.nombres_completos)
        .all()
    )


@router.post("/recuperar-password")
def recuperar_password(body: RecuperarPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.ci == body.ci, Usuario.activo == True).first()
    if not user:
        raise HTTPException(404, "Usuario no encontrado")

    verificado = False
    if body.registro_universitario and user.registro_universitario:
        verificado = user.registro_universitario == body.registro_universitario
    elif body.celular and user.celular:
        verificado = user.celular == body.celular

    if not verificado:
        raise HTTPException(400, "Los datos de verificación no coinciden")

    if len(body.nueva_password) < 6:
        raise HTTPException(400, "La contraseña debe tener al menos 6 caracteres")

    user.password_hash = hash_password(body.nueva_password)
    db.commit()
    return {"detail": "Contraseña actualizada correctamente"}


@router.post("/invitaciones", response_model=InvitacionOut, status_code=201)
def crear_invitacion(
    body: InvitacionCreate,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_admin),
):
    inv = TokenInvitacion(
        token=secrets.token_urlsafe(32),
        email_destino=body.email_destino,
        carrera_id=body.carrera_id,
        expira_en=datetime.now(timezone.utc) + timedelta(hours=72),
        creado_por=admin.id,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv


@router.get("/invitaciones", response_model=List[InvitacionOut])
def listar_invitaciones(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(TokenInvitacion).filter(TokenInvitacion.usado == False).all()


@router.post("/registro", response_model=UsuarioOut, status_code=201)
def registro_con_token(body: RegistroConToken, db: Session = Depends(get_db)):
    inv = db.query(TokenInvitacion).filter(
        TokenInvitacion.token == body.token,
        TokenInvitacion.usado == False,
    ).first()
    if not inv:
        raise HTTPException(400, "Token inválido o ya usado")
    if inv.expira_en < datetime.now(timezone.utc):
        raise HTTPException(400, "Token expirado")
    if db.query(Usuario).filter(Usuario.ci == body.ci).first():
        raise HTTPException(400, "CI ya registrado")

    rol_est = db.query(Rol).filter(Rol.nombre == "ESTUDIANTE").first()
    if not rol_est:
        raise HTTPException(500, "Rol ESTUDIANTE no existe")

    user = Usuario(
        ci=body.ci,
        nombres_completos=body.nombres_completos,
        password_hash=hash_password(body.password),
        carrera_id=inv.carrera_id,
        rol_id=rol_est.id,
        activo=True,
    )
    db.add(user)
    inv.usado = True
    db.commit()
    db.refresh(user)
    return user
