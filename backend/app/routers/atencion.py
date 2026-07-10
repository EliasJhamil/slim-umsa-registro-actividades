from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.atencion import ActividadAtencion
from app.models.usuario import Usuario
from app.core.dependencies import get_current_user
from app.schemas.atencion import AtencionCreate, AtencionUpdate, AtencionOut

router = APIRouter()


def _periodo_desde_fecha(fecha: str) -> str:
    if not fecha or len(fecha) < 7:
        raise HTTPException(status_code=400, detail="Fecha inválida; usa formato YYYY-MM-DD")
    return fecha[:7]


@router.get("", response_model=List[AtencionOut])
def listar_atenciones(
    periodo: str = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    q = db.query(ActividadAtencion)

    if current_user.rol.nombre == "ESTUDIANTE":
        q = q.filter(ActividadAtencion.usuario_id == current_user.id)

    if periodo:
        q = q.filter(ActividadAtencion.periodo == periodo)

    return q.order_by(ActividadAtencion.fecha).all()


@router.post("", response_model=AtencionOut, status_code=201)
def crear_atencion(
    data: AtencionCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    datos = data.model_dump()
    datos["periodo"] = datos.get("periodo") or _periodo_desde_fecha(datos["fecha"])

    actividad = ActividadAtencion(**datos, usuario_id=current_user.id)
    db.add(actividad)
    db.commit()
    db.refresh(actividad)
    return actividad


@router.get("/{id}", response_model=AtencionOut)
def obtener_atencion(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    actividad = db.query(ActividadAtencion).filter(ActividadAtencion.id == id).first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    if current_user.rol.nombre == "ESTUDIANTE" and actividad.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso a esta actividad")

    return actividad


@router.put("/{id}", response_model=AtencionOut)
def actualizar_atencion(
    id: int,
    data: AtencionUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    actividad = db.query(ActividadAtencion).filter(ActividadAtencion.id == id).first()
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
def eliminar_atencion(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    actividad = db.query(ActividadAtencion).filter(ActividadAtencion.id == id).first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    if current_user.rol.nombre == "ESTUDIANTE" and actividad.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso a esta actividad")

    db.delete(actividad)
    db.commit()
