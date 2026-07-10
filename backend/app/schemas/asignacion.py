from pydantic import BaseModel, field_validator
from datetime import datetime
import re


class AsignacionCreate(BaseModel):
    usuario_id: int
    grupo_id: int
    periodo: str   # formato YYYY-MM

    @field_validator("periodo")
    @classmethod
    def validar_periodo(cls, v: str) -> str:
        if not re.match(r"^\d{4}-(0[1-9]|1[0-2])$", v):
            raise ValueError("periodo debe tener formato YYYY-MM (ej: 2026-05)")
        return v


class AsignacionOut(BaseModel):
    id: int
    usuario_id: int
    grupo_id: int
    periodo: str
    activo: bool
    created_at: datetime

    model_config = {"from_attributes": True}