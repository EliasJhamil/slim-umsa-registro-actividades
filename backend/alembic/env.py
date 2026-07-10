import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# ── Importar todos los modelos para que Alembic los detecte ──
# Sin estos imports, autogenerate no sabrá qué tablas crear
from app.database import Base
import app.models  # noqa: F401 — fuerza el registro de todos los modelos

config = context.config

# Lee la configuración de logging del alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Base.metadata contiene todas las tablas definidas en los modelos
target_metadata = Base.metadata


def get_url() -> str:
    """
    Lee DATABASE_URL desde variable de entorno.
    En Docker, la variable viene del docker-compose.yml.
    En local, del .env del backend.
    """
    return os.environ.get(
        "DATABASE_URL",
        "postgresql://slim_user:password@localhost:5432/slim_db"
    )


def run_migrations_offline() -> None:
    """
    Modo offline: genera SQL sin conectarse a la BD.
    Útil para revisar el SQL antes de aplicarlo.
    Comando: alembic upgrade head --sql
    """
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,       # detecta cambios de tipo de columna
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Modo online: se conecta a la BD y aplica las migraciones directamente.
    Comando: alembic upgrade head
    """
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = get_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,   # sin pool en migraciones (conexión única)
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()