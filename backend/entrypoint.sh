#!/bin/sh
set -e

echo "⏳ Esperando a PostgreSQL..."

until python -c "
import psycopg2, os, sys
try:
    psycopg2.connect(os.environ.get('DATABASE_URL', ''))
    print('Conexion exitosa')
    sys.exit(0)
except Exception as e:
    print(f'No disponible: {e}')
    sys.exit(1)
" 2>&1; do
  echo "PostgreSQL no listo, reintentando en 3s..."
  sleep 3
done

echo "✅ PostgreSQL listo"

echo "⏳ Aplicando migraciones..."
alembic upgrade head
echo "✅ Migraciones aplicadas"

echo "⏳ Insertando datos semilla..."
python - <<'PY'
from app.database import SessionLocal
from app.models.usuario import Rol, Usuario
from app.models.carrera import Carrera
from app.core.security import hash_password

db = SessionLocal()
try:
    for nombre in ["ADMIN", "ESTUDIANTE"]:
        if not db.query(Rol).filter(Rol.nombre == nombre).first():
            db.add(Rol(nombre=nombre))
    db.commit()

    for nombre in ["Trabajo Social", "Derecho", "Psicologia", "Medicina", "Enfermeria", "Comunicacion Social"]:
        if not db.query(Carrera).filter(Carrera.nombre == nombre).first():
            db.add(Carrera(nombre=nombre))
    db.commit()

    if not db.query(Usuario).filter(Usuario.ci == "00000000").first():
        rol_admin = db.query(Rol).filter(Rol.nombre == "ADMIN").first()
        db.add(Usuario(
            ci="00000000",
            nombres_completos="Administrador SLIM",
            email="admin@umsa.bo",
            password_hash=hash_password("Admin1234!"),
            rol_id=rol_admin.id,
            activo=True,
        ))
        db.commit()
        print("Admin creado")

    print("Semilla lista")
finally:
    db.close()
PY

echo "🚀 Iniciando servidor..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
