from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ── Municipio ────────────────────────────────────────────
class MunicipioCreate(BaseModel):
    nombre: str


class MunicipioUpdate(BaseModel):
    nombre: Optional[str] = None
    activo: Optional[bool] = None


class MunicipioOut(BaseModel):
    id: int
    nombre: str
    activo: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Comunidad ────────────────────────────────────────────
class ComunidadCreate(BaseModel):
    nombre: str
    municipio_id: int


class ComunidadOut(BaseModel):
    id: int
    nombre: str
    municipio_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Grupo ────────────────────────────────────────────────
class GrupoCreate(BaseModel):
    nombre: str
    comunidad_id: int
    max_estudiantes: Optional[int] = 5


class GrupoUpdate(BaseModel):
    nombre: Optional[str] = None
    max_estudiantes: Optional[int] = None
    activo: Optional[bool] = None


class GrupoOut(BaseModel):
    id: int
    nombre: str
    comunidad_id: int
    max_estudiantes: int
    activo: bool
    created_at: datetime

    model_config = {"from_attributes": True}