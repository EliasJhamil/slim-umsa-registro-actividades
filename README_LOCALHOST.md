# SLIM-UMSA v2 — ejecución local corregida

Puertos usados:

- Frontend/Nginx: http://localhost:8080 o http://127.0.0.1:8080
- Backend/FastAPI: http://localhost:8001/docs
- Health: http://localhost:8001/api/health

Comandos:

```bash
docker compose down
docker compose up --build
```

Si es la primera vez o cambiaste migraciones/base de datos:

```bash
docker compose down -v
docker compose up --build
```

Credenciales iniciales:

- CI: 00000000
- Contraseña: Admin1234!

Nota: si `localhost` no abre en tu navegador, usa `127.0.0.1`. Eso suele ser un problema de resolución local/proxy/IPv6 de Windows o del navegador, no del código del proyecto.
