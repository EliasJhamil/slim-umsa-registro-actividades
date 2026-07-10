from sqlalchemy.orm import Session
from app.models.prevencion import ActividadPrevencion
from app.models.atencion import ActividadAtencion
from app.models.usuario import Usuario


def totales_por_periodo(db: Session, periodo: str) -> dict:
    """
    Resumen rápido de un periodo completo.
    Usado por el dashboard del admin.
    """
    prevenciones = db.query(ActividadPrevencion).filter(
        ActividadPrevencion.periodo == periodo
    ).all()

    atenciones = db.query(ActividadAtencion).filter(
        ActividadAtencion.periodo == periodo
    ).all()

    return {
        "periodo": periodo,
        "actividades_prevencion": len(prevenciones),
        "actividades_atencion":   len(atenciones),
        "beneficiarios_prevencion": sum(
            a.mujeres + a.hombres + a.ninez + a.adulto_mayor + a.discapacidad
            for a in prevenciones
        ),
        "denunciantes_atencion": sum(
            a.denunciantes_m + a.denunciantes_h for a in atenciones
        ),
    }


def actividad_por_estudiante(db: Session, periodo: str) -> list:
    """
    Lista cuántas actividades registró cada estudiante en el periodo.
    Útil para que el admin detecte quién no ha registrado nada.
    """
    estudiantes = db.query(Usuario).filter(
        Usuario.activo == True,
    ).all()

    resultado = []
    for est in estudiantes:
        n_prev = db.query(ActividadPrevencion).filter(
            ActividadPrevencion.usuario_id == est.id,
            ActividadPrevencion.periodo == periodo,
        ).count()

        n_aten = db.query(ActividadAtencion).filter(
            ActividadAtencion.usuario_id == est.id,
            ActividadAtencion.periodo == periodo,
        ).count()

        resultado.append({
            "usuario_id": est.id,
            "nombre":     est.nombre,
            "ci":         est.ci,
            "prevenciones": n_prev,
            "atenciones":   n_aten,
            "total":        n_prev + n_aten,
        })

    return sorted(resultado, key=lambda x: x["total"], reverse=True)