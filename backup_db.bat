@echo off
setlocal

cd /d "%~dp0"

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm"') do set FECHA=%%i

set BACKUP_DIR=backups
set DB_SERVICE=postgres
set DB_USER=slim_user
set DB_NAME=slim_db

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

set BACKUP_FILE=%BACKUP_DIR%\backup_slim_%FECHA%.sql
set TEMP_FILE=%BACKUP_DIR%\backup_temp.sql

echo ==========================================
echo CREANDO BACKUP DE SLIM-UMSA
echo Fecha: %FECHA%
echo ==========================================
echo.

docker compose ps

echo.
echo Creando backup de PostgreSQL...
docker compose exec -T %DB_SERVICE% pg_dump -U %DB_USER% -d %DB_NAME% > "%TEMP_FILE%"

if errorlevel 1 (
    echo.
    echo ERROR: No se pudo crear el backup.
    echo Revisa DB_SERVICE, DB_USER o DB_NAME.
    if exist "%TEMP_FILE%" del "%TEMP_FILE%"
    pause
    exit /b 1
)

for %%A in ("%TEMP_FILE%") do set SIZE=%%~zA

if "%SIZE%"=="0" (
    echo.
    echo ERROR: El backup se creo vacio.
    echo Posibles causas:
    echo - El servicio no se llama db.
    echo - La base de datos no se llama slim_umsa.
    echo - PostgreSQL no esta levantado.
    del "%TEMP_FILE%"
    pause
    exit /b 1
)

move "%TEMP_FILE%" "%BACKUP_FILE%" > nul

echo.
echo Backup creado correctamente:
echo %BACKUP_FILE%
echo Tamano: %SIZE% bytes

echo.
echo Eliminando backups antiguos, dejando solo los ultimos 4...
powershell -NoProfile -Command "Get-ChildItem -Path '%BACKUP_DIR%' -Filter 'backup_slim_*.sql' | Sort-Object LastWriteTime -Descending | Select-Object -Skip 4 | Remove-Item -Force"

echo.
echo Backups actuales:
dir "%BACKUP_DIR%\backup_slim_*.sql"

echo.
echo Proceso terminado.
pause