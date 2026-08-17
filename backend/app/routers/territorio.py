from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.territorio import Municipio, Comunidad, Grupo
from app.models.usuario import Usuario
from app.core.dependencies import require_admin, get_current_user
from app.schemas.territorio import (
    MunicipioCreate, MunicipioUpdate, MunicipioOut,
    ComunidadCreate, ComunidadOut,
    GrupoCreate, GrupoUpdate, GrupoOut,
)

router = APIRouter()


# ── Municipios ───────────────────────────────────────────
@router.get("/municipios", response_model=List[MunicipioOut])
def listar_municipios(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),   # cualquier usuario autenticado
):
    return db.query(Municipio).all()


@router.put("/municipios/{id}", response_model=MunicipioOut)
def actualizar_municipio(
    id: int,
    data: MunicipioUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    municipio = db.query(Municipio).filter(Municipio.id == id).first()

    if not municipio:
        raise HTTPException(status_code=404, detail="Municipio no encontrado")

    for campo, valor in data.model_dump(exclude_none=True).items():
        setattr(municipio, campo, valor)

    db.commit()
    db.refresh(municipio)

    return municipio


@router.delete("/municipios/{id}", status_code=204)
def eliminar_municipio(
    id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    obj = db.query(Municipio).filter(Municipio.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Municipio no encontrado")
    db.delete(obj)
    db.commit()

@router.post("/municipios", response_model=MunicipioOut, status_code=201)
def crear_municipio(
    data: MunicipioCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin), # o require_user_active según los permisos que necesites
):
    nuevo_municipio = Municipio(**data.model_dump())
    db.add(nuevo_municipio)
    db.commit()
    db.refresh(nuevo_municipio)
    return nuevo_municipio

# ── Comunidades ──────────────────────────────────────────
@router.get("/comunidades", response_model=List[ComunidadOut])
def listar_comunidades(
    municipio_id: int = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    q = db.query(Comunidad)
    if municipio_id:
        q = q.filter(Comunidad.municipio_id == municipio_id)
    return q.all()


@router.post("/comunidades", response_model=ComunidadOut, status_code=201)
def crear_comunidad(
    data: ComunidadCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    comunidad = Comunidad(nombre=data.nombre, municipio_id=data.municipio_id)
    db.add(comunidad)
    db.commit()
    db.refresh(comunidad)
    return comunidad


@router.delete("/comunidades/{id}", status_code=204)
def eliminar_comunidad(
    id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    obj = db.query(Comunidad).filter(Comunidad.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Comunidad no encontrada")
    db.delete(obj)
    db.commit()


# ── Grupos ───────────────────────────────────────────────
@router.get("/grupos", response_model=List[GrupoOut])
def listar_grupos(
    comunidad_id: int = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    q = db.query(Grupo)
    if comunidad_id:
        q = q.filter(Grupo.comunidad_id == comunidad_id)
    return q.all()


@router.post("/grupos", response_model=GrupoOut, status_code=201)
def crear_grupo(
    data: GrupoCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    grupo = Grupo(
        nombre=data.nombre,
        comunidad_id=data.comunidad_id,
        max_estudiantes=data.max_estudiantes,
    )
    db.add(grupo)
    db.commit()
    db.refresh(grupo)
    return grupo


@router.put("/grupos/{id}", response_model=GrupoOut)
def actualizar_grupo(
    id: int,
    data: GrupoUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    grupo = db.query(Grupo).filter(Grupo.id == id).first()
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    for campo, valor in data.model_dump(exclude_none=True).items():
        setattr(grupo, campo, valor)
    db.commit()
    db.refresh(grupo)
    return grupo


@router.delete("/grupos/{id}", status_code=204)
def eliminar_grupo(
    id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    grupo = db.query(Grupo).filter(Grupo.id == id).first()
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    db.delete(grupo)
    db.commit()
