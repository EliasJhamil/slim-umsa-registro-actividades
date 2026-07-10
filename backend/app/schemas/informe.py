from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.informe import EstadoInforme


class InformeOut(BaseModel):
    id: int
    usuario_id: int
    periodo: str
    estado: EstadoInforme
    aprobado_por: Optional[int] = None
    fecha_envio: Optional[datetime] = None
    fecha_aprobacion: Optional[datetime] = None
    observaciones: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class InformeUpdate(BaseModel):
    """Solo el admin puede actualizar estado y observaciones."""
    estado: Optional[EstadoInforme] = None
    observaciones: Optional[str] = None