from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AtencionCreate(BaseModel):
    fecha: str  # YYYY-MM-DD
    periodo: Optional[str] = None  # YYYY-MM; si no llega, se calcula desde fecha

    # Col 1
    tipo_actividad: str
    # Col 2
    descripcion: Optional[str] = None
    # Col 3 — Denunciante
    denunciantes_h: int = 0
    denunciantes_m: int = 0
    # Col 4 — Seguimiento
    seguimiento: int = 0  # 0 = nuevo, 1 = seguimiento
    # Col 5
    tipo_caso: str
    # Col 6
    tipo_denuncia: str
    # Col 7 — Estudiantes
    participantes: Optional[str] = None
    # Extra
    institucion: Optional[str] = None


class AtencionUpdate(BaseModel):
    fecha: Optional[str] = None
    periodo: Optional[str] = None
    tipo_actividad: Optional[str] = None
    descripcion: Optional[str] = None
    denunciantes_h: Optional[int] = None
    denunciantes_m: Optional[int] = None
    seguimiento: Optional[int] = None
    tipo_caso: Optional[str] = None
    tipo_denuncia: Optional[str] = None
    participantes: Optional[str] = None
    institucion: Optional[str] = None


class AtencionOut(BaseModel):
    id: int
    usuario_id: int
    asignacion_id: Optional[int] = None
    periodo: str
    fecha: str
    tipo_actividad: str
    descripcion: Optional[str] = None
    denunciantes_h: int = 0
    denunciantes_m: int = 0
    seguimiento: int = 0
    tipo_caso: str
    tipo_denuncia: str
    participantes: Optional[str] = None
    institucion: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
