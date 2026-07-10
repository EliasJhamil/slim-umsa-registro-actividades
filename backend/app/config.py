from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── Base de datos ────────────────────────────────────
    DATABASE_URL: str

    # ── JWT ──────────────────────────────────────────────
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Entorno ──────────────────────────────────────────
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost"

    @property
    def origins_list(self) -> list[str]:
        """Convierte el string CSV de orígenes en lista."""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    class Config:
        env_file = ".env"          # lee el .env en la raíz del backend
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """
    Singleton: la config se carga una sola vez y se cachea.
    Usar como dependencia: settings = get_settings()
    """
    return Settings()