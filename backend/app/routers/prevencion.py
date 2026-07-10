from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.prevencion import ActividadPrevencion
from app.models.usuario import Usuario
from app.core.dependencies import get_current_user
from app.schemas.prevencion import PrevencionCreate, PrevencionUpdate, PrevencionOut

router = APIRouter()


def _periodo_desde_fecha(fecha: str) -> str:
    if not fecha or len(fecha) < 7:
        raise HTTPException(status_code=400, detail="Fecha inválida; usa formato YYYY-MM-DD")
    return fecha[:7]


@router.get("", response_model=List[PrevencionOut])
def listar_prevenciones(
    periodo: str = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    q = db.query(ActividadPrevencion)

    if current_user.rol.nombre == "ESTUDIANTE":
        q = q.filter(ActividadPrevencion.usuario_id == current_user.id)

    if periodo:
        q = q.filter(ActividadPrevencion.periodo == periodo)

    return q.order_by(ActividadPrevencion.fecha).all()


@router.post("", response_model=PrevencionOut, status_code=201)
def crear_prevencion(
    data: PrevencionCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    datos = data.model_dump()
    datos["periodo"] = datos.get("periodo") or _periodo_desde_fecha(datos["fecha"])

    actividad = ActividadPrevencion(**datos, usuario_id=current_user.id)
    db.add(actividad)
    db.commit()
    db.refresh(actividad)
    return actividad


@router.get("/{id}", response_model=PrevencionOut)
def obtener_prevencion(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    actividad = db.query(ActividadPrevencion).filter(ActividadPrevencion.id == id).first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    if current_user.rol.nombre == "ESTUDIANTE" and actividad.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso a esta actividad")

    return actividad


@router.put("/{id}", response_model=PrevencionOut)
def actualizar_prevencion(
    id: int,
    data: PrevencionUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    actividad = db.query(ActividadPrevencion).filter(ActividadPrevencion.id == id).first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    if current_user.rol.nombre == "ESTUDIANTE" and actividad.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso a esta actividad")

    datos = data.model_dump(exclude_none=True)
    if "fecha" in datos and "periodo" not in datos:
        datos["periodo"] = _periodo_desde_fecha(datos["fecha"])

    for campo, valor in datos.items():
        setattr(actividad, campo, valor)

    db.commit()
    db.refresh(actividad)
    return actividad


@router.delete("/{id}", status_code=204)
def eliminar_prevencion(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    actividad = db.query(ActividadPrevencion).filter(ActividadPrevencion.id == id).first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    if current_user.rol.nombre == "ESTUDIANTE" and actividad.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso a esta actividad")

    db.delete(actividad)
    db.commit()
