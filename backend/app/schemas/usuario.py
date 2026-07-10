from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class UsuarioCreate(BaseModel):
    # Credenciales
    ci: str
    password: str
    rol_id: int = 2  # ESTUDIANTE por defecto

    # Datos personales
    nombres_completos: str
    email: Optional[str] = None
    sexo: Optional[str] = None           # "M" / "F" / "Otro"
    fecha_nacimiento: Optional[date] = None
    registro_universitario: Optional[str] = None
    celular: Optional[str] = None
    modalidad: Optional[str] = None

    # Asignación institucional
    carrera_id:   Optional[int] = None
    municipio_id: Optional[int] = None


class UsuarioUpdate(BaseModel):
    nombres_completos: Optional[str] = None
    email:             Optional[str] = None
    sexo:              Optional[str] = None
    fecha_nacimiento:  Optional[date] = None
    registro_universitario: Optional[str] = None
    celular:           Optional[str] = None
    modalidad:         Optional[str] = None
    carrera_id:        Optional[int] = None
    municipio_id:      Optional[int] = None
    activo:            Optional[bool] = None


class UsuarioOut(BaseModel):
    id: int
    ci: str
    nombres_completos: str
    email:             Optional[str]
    sexo:              Optional[str]
    fecha_nacimiento:  Optional[date]
    registro_universitario: Optional[str]
    celular:           Optional[str]
    modalidad:         Optional[str] = None
    carrera_id:        Optional[int]
    municipio_id:      Optional[int]
    rol_id:            int
    activo:            bool
    created_at:        datetime

    class Config:
        from_attributes = True


# ── Recuperación de contraseña ────────────────────────────────
class RecuperarPasswordRequest(BaseModel):
    ci: str
    # Verifica identidad con uno de estos dos campos
    registro_universitario: Optional[str] = None
    celular:                Optional[str] = None
    nueva_password: str


# ── Invitaciones ──────────────────────────────────────────────
class InvitacionCreate(BaseModel):
    email_destino: Optional[str] = None
    carrera_id:    Optional[int] = None


class InvitacionOut(BaseModel):
    token:         str
    email_destino: Optional[str]
    expira_en:     datetime
    usado:         bool

    class Config:
        from_attributes = True


class RegistroConToken(BaseModel):
    token:            str
    ci:               str
    nombres_completos: str
    password:         str


# ── Lista liviana para selector de participantes ──────────────
class UsuarioParticipanteOut(BaseModel):
    id:               int
    nombres_completos: str
    carrera_id:       Optional[int]

    class Config:
        from_attributes = True
