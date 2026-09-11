@echo off
setlocal EnableDelayedExpansion
title TestCafe - InconsistenciasHgi (por grupos)
cd /d "%~dp0.."

REM Fecha del reporte (yyyy-MM-dd) y metadatos de ejecucion
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_INICIO=%%i
set USUARIO=%USERNAME%
set FAILED=0

REM Timeouts cortos para no quedarse minutos colgado por selector/AJAX/chatbot
set TC_OPTS=--test-execution-timeout 300000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 5000

echo ========================================
echo InconsistenciasHgi - ejecucion por grupos
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Fecha reportes: %FECHA%
echo Estrategia: lotes de 10 archivos INC,
echo   limpia Chrome entre grupos, continua si falla uno,
echo   excluye archivos "copia", genera HTML por grupo + FN
echo ========================================
echo.

call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo Sincronizando grupos...
call node "%~dp0scripts\run-inc-grupos.js" sync
if errorlevel 1 (
    echo Error al sincronizar grupos.json
    pause
    exit /b 1
)

echo.
echo Ejecutando todos los grupos INC + FN...
call node "%~dp0scripts\run-inc-grupos.js" all %TC_OPTS%
if errorlevel 1 set FAILED=1

call "%~dp0_Limpiar-Chrome-TestCafe.bat"

for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_FIN=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "$ini=[datetime]::ParseExact('%HORA_INICIO%','yyyy-MM-dd HH:mm:ss',$null); $fin=[datetime]::ParseExact('%HORA_FIN%','yyyy-MM-dd HH:mm:ss',$null); $d=$fin-$ini; '{0:00}:{1:00}:{2:00}' -f [int]$d.TotalHours,$d.Minutes,$d.Seconds"`) do set DURACION=%%i

echo.
echo ========================================
if %FAILED% EQU 0 (
    echo InconsistenciasHgi finalizo correctamente.
) else (
    echo InconsistenciasHgi finalizo con errores en uno o mas grupos.
)
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Hora fin: %HORA_FIN%
echo Duracion: %DURACION%
echo Reportes:
echo   Reportes\InconsistenciasHgi\INC\%FECHA%\GrupoN_%FECHA%.html
echo   Reportes\InconsistenciasHgi\FN\%FECHA%\FN_%FECHA%.html
echo.
echo Tip: un solo grupo:
echo   node scripts\run-inc-grupos.js 3
echo Listar grupos:
echo   node scripts\run-inc-grupos.js list
echo ========================================
echo.
pause
endlocal
