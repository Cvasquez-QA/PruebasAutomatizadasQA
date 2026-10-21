@echo off
setlocal
title Sincronizar PruebasAutomatizadasQA con GitHub
cd /d "%~dp0.."
set CODIGO=0

rem Uso: doble clic (pide el mensaje del commit) o Sincronizar-Git.bat "mensaje del commit"
for /f "delims=" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm'"') do set "FECHA=%%i"
set "MENSAJE=%~1"
if "%MENSAJE%"=="" set /p "MENSAJE=Mensaje del commit (Enter = automatico): "
if "%MENSAJE%"=="" set "MENSAJE=Sincronizacion automatica %FECHA%"

for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set "RAMA=%%b"
if /i not "%RAMA%"=="main" (
    echo La rama actual es %RAMA% y este archivo solo sincroniza main. Cambia a main con: git checkout main
    goto :error
)

echo.
echo [1/4] Agregando cambios...
git add -A || goto :error

git diff --cached --quiet
if errorlevel 1 (
    echo [2/4] Creando commit: %MENSAJE%
    git commit -m "%MENSAJE%" || goto :error
) else if exist ".git\MERGE_HEAD" (
    echo [2/4] Cerrando el merge pendiente...
    git commit --no-edit || goto :error
) else (
    echo [2/4] No hay cambios locales para commit.
)

echo [3/4] Trayendo cambios de GitHub...
git pull --no-rebase --no-edit origin main
if errorlevel 1 (
    echo.
    echo Hubo conflictos al traer los cambios de GitHub. Resuelvelos, haz commit y vuelve a ejecutar este archivo.
    git status --short
    goto :error
)

echo [4/4] Subiendo a GitHub...
git push origin main || goto :error

echo.
echo Sincronizacion terminada.
git log --oneline -3
goto :fin

:error
echo.
echo *** La sincronizacion NO se completo. Revisa los mensajes de arriba. ***
set CODIGO=1

:fin
if "%~1"=="" pause
exit /b %CODIGO%
