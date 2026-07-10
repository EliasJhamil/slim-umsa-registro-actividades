from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.prevencion import ActividadPrevencion
from app.models.atencion import ActividadAtencion
from app.models.territorio import Municipio
from app.models.usuario import Usuario
from app.core.dependencies import require_admin

router = APIRouter()


def _usuarios_por_municipio(db: Session, municipio_id: int | None):
    if not municipio_id:
        return None

    return db.query(Usuario.id).filter(
        Usuario.municipio_id == municipio_id
    ).subquery()


def _filtrar_prevenciones(db: Session, periodo: str | None, municipio_id: int | None):
    q = db.query(ActividadPrevencion)

    if periodo:
        q = q.filter(ActividadPrevencion.periodo == periodo)

    ids = _usuarios_por_municipio(db, municipio_id)
    if ids is not None:
        q = q.filter(ActividadPrevencion.usuario_id.in_(ids))

    return q.all()


def _filtrar_atenciones(db: Session, periodo: str | None, municipio_id: int | None):
    q = db.query(ActividadAtencion)

    if periodo:
        q = q.filter(ActividadAtencion.periodo == periodo)

    ids = _usuarios_por_municipio(db, municipio_id)
    if ids is not None:
        q = q.filter(ActividadAtencion.usuario_id.in_(ids))

    return q.all()


def _sumar_por(lista, campo):
    return sum(getattr(item, campo, 0) or 0 for item in lista)


def _contar_por(lista, campo, default="Sin clasificar"):
    conteo = {}

    for item in lista:
        key = getattr(item, campo, None) or default
        conteo[key] = conteo.get(key, 0) + 1

    return [
        {"label": key, "total": total}
        for key, total in sorted(conteo.items(), key=lambda x: x[1], reverse=True)
    ]


@router.get("/panel")
def panel_estadisticas(
    periodo: str = None,
    municipio_id: int = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    prevenciones = _filtrar_prevenciones(db, periodo, municipio_id)
    atenciones = _filtrar_atenciones(db, periodo, municipio_id)

    prev_mujeres = _sumar_por(prevenciones, "poblacion_mujeres")
    prev_hombres = _sumar_por(prevenciones, "poblacion_hombres")
    prev_total = prev_mujeres + prev_hombres

    aten_mujeres = _sumar_por(atenciones, "denunciantes_m")
    aten_hombres = _sumar_por(atenciones, "denunciantes_h")
    aten_total = aten_mujeres + aten_hombres

    casos_nuevos = sum(1 for a in atenciones if not a.seguimiento)
    seguimientos = sum(1 for a in atenciones if a.seguimiento)

    municipios_q = db.query(Municipio).order_by(Municipio.nombre).all()

    prev_por_municipio = []

    for municipio in municipios_q:
        if municipio_id and municipio.id != municipio_id:
            continue

        ids_usuarios = db.query(Usuario.id).filter(
            Usuario.municipio_id == municipio.id
        ).subquery()

        q = db.query(ActividadPrevencion).filter(
            ActividadPrevencion.usuario_id.in_(ids_usuarios)
        )

        if periodo:
            q = q.filter(ActividadPrevencion.periodo == periodo)

        actividades = q.all()

        mujeres = _sumar_por(actividades, "poblacion_mujeres")
        hombres = _sumar_por(actividades, "poblacion_hombres")

        prev_por_municipio.append({
            "municipio_id": municipio.id,
            "municipio": municipio.nombre,
            "actividades": len(actividades),
            "mujeres": mujeres,
            "hombres": hombres,
            "total": mujeres + hombres,
        })

    municipio_nombre = "Todos los municipios"

    if municipio_id:
        municipio = db.query(Municipio).filter(Municipio.id == municipio_id).first()
        municipio_nombre = municipio.nombre if municipio else "Municipio no encontrado"

    return {
        "periodo": periodo,
        "municipio_id": municipio_id,
        "municipio_nombre": municipio_nombre,

        "municipios": [
            {
                "id": m.id,
                "nombre": m.nombre,
                "activo": m.activo,
            }
            for m in municipios_q
        ],

        "general": {
            "prevenciones": len(prevenciones),
            "atenciones": len(atenciones),
            "mujeres": prev_mujeres + aten_mujeres,
            "hombres": prev_hombres + aten_hombres,
            "total_impacto": prev_total + aten_total,
        },

        "prevencion": {
            "actividades": len(prevenciones),
            "mujeres": prev_mujeres,
            "hombres": prev_hombres,
            "total": prev_total,
            "grupos_especiales": {
                "ninez": sum(1 for p in prevenciones if p.poblacion_ninez),
                "adulto_mayor": sum(1 for p in prevenciones if p.poblacion_adulto_mayor),
                "discapacidad": sum(1 for p in prevenciones if p.poblacion_discapacidad),
            },
            "por_municipio": prev_por_municipio,
        },

        "atencion": {
            "atenciones": len(atenciones),
            "mujeres": aten_mujeres,
            "hombres": aten_hombres,
            "total": aten_total,
            "casos_nuevos": casos_nuevos,
            "seguimientos": seguimientos,
            "por_tipo_caso": _contar_por(atenciones, "tipo_caso"),
            "por_tipo_denuncia": _contar_por(atenciones, "tipo_denuncia"),
            "por_institucion": _contar_por(atenciones, "institucion", "Sin institución"),
        },

        "comparativo": {
            "prevencion_total": prev_total,
            "atencion_total": aten_total,
            "impacto_total": prev_total + aten_total,
        },
    }


@router.get("/resumen")
def resumen(
    periodo: str = None,
    municipio_id: int = None,
    carrera_id: int = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    prev = _filtrar_prevenciones(db, periodo, municipio_id)
    aten = _filtrar_atenciones(db, periodo, municipio_id)

    poblacion_mujeres = _sumar_por(prev, "poblacion_mujeres")
    poblacion_hombres = _sumar_por(prev, "poblacion_hombres")

    denunciantes_m = _sumar_por(aten, "denunciantes_m")
    denunciantes_h = _sumar_por(aten, "denunciantes_h")

    return {
        "periodo": periodo,
        "prevenciones": len(prev),
        "atenciones": len(aten),
        "poblacion_mujeres": poblacion_mujeres,
        "poblacion_hombres": poblacion_hombres,
        "total_poblacion": poblacion_mujeres + poblacion_hombres,
        "denunciantes_m": denunciantes_m,
        "denunciantes_h": denunciantes_h,
        "total_denunciantes": denunciantes_m + denunciantes_h,
        "casos_nuevos": sum(1 for a in aten if not a.seguimiento),
        "seguimientos": sum(1 for a in aten if a.seguimiento),
    }


@router.get("/violencia")
def stats_violencia(
    periodo: str = None,
    municipio_id: int = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    atenciones = _filtrar_atenciones(db, periodo, municipio_id)

    return [
        {"tipo": item["label"], "total": item["total"]}
        for item in _contar_por(atenciones, "tipo_denuncia")
    ]


@router.get("/prevencion-municipio")
def prevencion_por_municipio(
    periodo: str = None,
    municipio_id: int = None,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    data = panel_estadisticas(periodo, municipio_id, db, _)

    return [
        {
            "municipio": item["municipio"],
            "actividades": item["actividades"],
            "poblacion": item["total"],
        }
        for item in data["prevencion"]["por_municipio"]
    ]