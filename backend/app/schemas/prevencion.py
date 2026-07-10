from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PrevencionCreate(BaseModel):
    fecha: str  # YYYY-MM-DD
    periodo: Optional[str] = None  # YYYY-MM; si no llega, se calcula desde fecha

    # Col 1
    nombre: str
    # Col 2
    descripcion: Optional[str] = None
    # Col 3 — Población alcanzada
    poblacion_mujeres: int = 0
    poblacion_hombres: int = 0
    poblacion_ninez: bool = False
    poblacion_adulto_mayor: bool = False
    poblacion_discapacidad: bool = False
    # Col 4 — Equipo multidisciplinario
    participantes: Optional[str] = None
    # Col 5
    url_redes: Optional[str] = None
    # Col 6
    url_drive: Optional[str] = None


class PrevencionUpdate(BaseModel):
    fecha: Optional[str] = None
    periodo: Optional[str] = None
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    poblacion_mujeres: Optional[int] = None
    poblacion_hombres: Optional[int] = None
    poblacion_ninez: Optional[bool] = None
    poblacion_adulto_mayor: Optional[bool] = None
    poblacion_discapacidad: Optional[bool] = None
    participantes: Optional[str] = None
    url_redes: Optional[str] = None
    url_drive: Optional[str] = None


class PrevencionOut(BaseModel):
    id: int
    usuario_id: int
    asignacion_id: Optional[int] = None
    periodo: str
    fecha: str
    nombre: str
    descripcion: Optional[str] = None
    poblacion_mujeres: int = 0
    poblacion_hombres: int = 0
    poblacion_ninez: bool = False
    poblacion_adulto_mayor: bool = False
    poblacion_discapacidad: bool = False
    participantes: Optional[str] = None
    url_redes: Optional[str] = None
    url_drive: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
