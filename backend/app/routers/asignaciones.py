from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.asignacion import Asignacion
from app.models.territorio import Grupo
from app.models.usuario import Usuario
from app.core.dependencies import require_admin, get_current_user
from app.schemas.asignacion import AsignacionCreate, AsignacionOut

router = APIRouter()


@router.get("", response_model=List[AsignacionOut])
def listar_asignaciones(
    periodo: str = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """
    ADMIN ve todas. ESTUDIANTE solo ve las suyas.
    Filtro opcional por periodo YYYY-MM.
    """
    q = db.query(Asignacion)

    if current_user.rol.nombre == "ESTUDIANTE":
        q = q.filter(Asignacion.usuario_id == current_user.id)

    if periodo:
        q = q.filter(Asignacion.periodo == periodo)

    return q.all()


@router.post("", response_model=AsignacionOut, status_code=201)
def crear_asignacion(
    data: AsignacionCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    # Verificar que el grupo existe y está activo
    grupo = db.query(Grupo).filter(
        Grupo.id == data.grupo_id,
        Grupo.activo == True,
    ).first()
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo no encontrado o inactivo")

    # Verificar que no supera el límite de estudiantes del grupo
    total = db.query(Asignacion).filter(
        Asignacion.grupo_id == data.grupo_id,
        Asignacion.periodo == data.periodo,
        Asignacion.activo == True,
    ).count()
    if total >= grupo.max_estudiantes:
        raise HTTPException(
            status_code=400,
            detail=f"El grupo ya tiene {total}/{grupo.max_estudiantes} estudiantes asignados",
        )

    # Verificar que el estudiante no tiene ya asignación activa en este periodo
    existe = db.query(Asignacion).filter(
        Asignacion.usuario_id == data.usuario_id,
        Asignacion.periodo == data.periodo,
        Asignacion.activo == True,
    ).first()
    if existe:
        raise HTTPException(
            status_code=400,
            detail="El estudiante ya tiene una asignación activa en este periodo",
        )

    asignacion = Asignacion(**data.model_dump())
    db.add(asignacion)
    db.commit()
    db.refresh(asignacion)
    return asignacion


@router.delete("/{id}", status_code=204)
def desactivar_asignacion(
    id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    """Borrado lógico: activo = False."""
    asignacion = db.query(Asignacion).filter(Asignacion.id == id).first()
    if not asignacion:
        raise HTTPException(status_code=404, detail="Asignación no encontrada")
    asignacion.activo = False
    db.commit()