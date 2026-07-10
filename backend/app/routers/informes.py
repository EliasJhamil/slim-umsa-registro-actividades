from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.database import get_db
from app.models.informe import Informe, EstadoInforme
from app.models.usuario import Usuario
from app.core.dependencies import get_current_user, require_admin
from app.schemas.informe import InformeOut, InformeUpdate

router = APIRouter()


def _get_informe_o_404(db: Session, informe_id: int) -> Informe:
    obj = db.query(Informe).filter(Informe.id == informe_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Informe no encontrado")
    return obj


def _get_or_create_informe(db: Session, usuario_id: int, periodo: str) -> Informe:
    informe = db.query(Informe).filter(
        Informe.usuario_id == usuario_id,
        Informe.periodo == periodo,
    ).first()
    if informe:
        return informe

    informe = Informe(usuario_id=usuario_id, periodo=periodo)
    db.add(informe)
    db.commit()
    db.refresh(informe)
    return informe


@router.get("/mio", response_model=List[InformeOut])
def mis_informes(
    periodo: str = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    q = db.query(Informe).filter(Informe.usuario_id == current_user.id)
    if periodo:
        q = q.filter(Informe.periodo == periodo)
    return q.order_by(Informe.created_at.desc()).all()


@router.post("/mio", response_model=InformeOut, status_code=201)
def crear_informe(
    periodo: str,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    existe = db.query(Informe).filter(
        Informe.usuario_id == current_user.id,
        Informe.periodo == periodo,
    ).first()
    if existe:
        return existe

    informe = Informe(usuario_id=current_user.id, periodo=periodo)
    db.add(informe)
    db.commit()
    db.refresh(informe)
    return informe


@router.post("/{id}/enviar", response_model=InformeOut)
def enviar_informe(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    informe = _get_informe_o_404(db, id)

    if informe.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="No es tu informe")

    if informe.estado != EstadoInforme.BORRADOR:
        raise HTTPException(status_code=400, detail="Solo se puede enviar un informe en BORRADOR")

    informe.estado = EstadoInforme.ENVIADO
    informe.fecha_envio = datetime.now(timezone.utc)
    db.commit()
    db.refresh(informe)
    return informe


@router.get("", response_model=List[InformeOut])
def listar_informes(
    periodo: str = None,
    estado: EstadoInforme = None,
    usuario_id: int = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    q = db.query(Informe)
    if periodo:
        q = q.filter(Informe.periodo == periodo)
    if estado:
        q = q.filter(Informe.estado == estado)
    if usuario_id:
        q = q.filter(Informe.usuario_id == usuario_id)
    return q.order_by(Informe.created_at.desc()).all()


@router.post("/{id}/aprobar", response_model=InformeOut)
def aprobar_informe(
    id: int,
    data: InformeUpdate,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(require_admin),
):
    informe = _get_informe_o_404(db, id)

    if informe.estado != EstadoInforme.ENVIADO:
        raise HTTPException(status_code=400, detail="Solo se puede aprobar/rechazar un informe ENVIADO")

    nuevo_estado = data.estado or EstadoInforme.APROBADO
    if nuevo_estado not in (EstadoInforme.APROBADO, EstadoInforme.RECHAZADO):
        raise HTTPException(status_code=400, detail="Estado debe ser APROBADO o RECHAZADO")

    informe.estado = nuevo_estado
    informe.aprobado_por = admin.id
    informe.fecha_aprobacion = datetime.now(timezone.utc)
    informe.observaciones = data.observaciones
    db.commit()
    db.refresh(informe)
    return informe


@router.get("/{usuario_id}/export")
def exportar_informe_por_usuario_periodo(
    usuario_id: int,
    periodo: str,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    import os
    from fastapi.responses import FileResponse
    from app.services.informe_service import generar_docx
    from app.models.prevencion import ActividadPrevencion
    from app.models.atencion import ActividadAtencion

    # El estudiante solo puede descargar su propio informe
    if current_user.rol.nombre == "ESTUDIANTE" and current_user.id != usuario_id:
        raise HTTPException(status_code=403, detail="Sin acceso a este informe")

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Crear o recuperar informe del periodo
    _get_or_create_informe(db, usuario_id, periodo)

    prevenciones = db.query(ActividadPrevencion).filter(
        ActividadPrevencion.usuario_id == usuario_id,
        ActividadPrevencion.periodo == periodo,
    ).order_by(ActividadPrevencion.fecha.asc()).all()

    atenciones = db.query(ActividadAtencion).filter(
        ActividadAtencion.usuario_id == usuario_id,
        ActividadAtencion.periodo == periodo,
    ).order_by(ActividadAtencion.fecha.asc()).all()

    output_dir = "/tmp/slim_informes"
    os.makedirs(output_dir, exist_ok=True)

    ruta_archivo = generar_docx(
        usuario=usuario,
        periodo=periodo,
        prevenciones=prevenciones,
        atenciones=atenciones,
        output_dir=output_dir,
    )

    return FileResponse(
        path=ruta_archivo,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=f"Informe_SLIM_{usuario.ci}_{periodo}.docx",
    )
