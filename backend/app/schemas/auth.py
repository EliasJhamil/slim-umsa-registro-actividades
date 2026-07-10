from pydantic import BaseModel


class LoginRequest(BaseModel):
    ci: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    nombre: str = ""
    rol: str = ""


class TokenPayload(BaseModel):
    """Contenido decodificado del JWT."""
    sub: int        # usuario_id
    rol: str        # "ADMIN" | "ESTUDIANTE"
    exp: int        # timestamp de expiración