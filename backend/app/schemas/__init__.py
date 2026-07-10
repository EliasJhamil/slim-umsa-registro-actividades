from app.schemas.auth import TokenResponse, LoginRequest, RefreshRequest
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioOut
from app.schemas.territorio import (
    MunicipioCreate, MunicipioOut,
    ComunidadCreate, ComunidadOut,
    GrupoCreate, GrupoOut,
)
from app.schemas.asignacion import AsignacionCreate, AsignacionOut
from app.schemas.prevencion import PrevencionCreate, PrevencionUpdate, PrevencionOut
from app.schemas.atencion import AtencionCreate, AtencionUpdate, AtencionOut
from app.schemas.informe import InformeOut, InformeUpdate