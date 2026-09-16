@echo off
setlocal EnableDelayedExpansion
title TestCafe - NominaHgi360 (por partes)
cd /d "%~dp0.."

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_INICIO=%%i
set USUARIO=%USERNAME%
set FAILED=0

set TC_OPTS=--concurrency 1 --test-execution-timeout 300000 --assertion-timeout 5000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 5000
set TC_DOCS=--concurrency 1 --test-execution-timeout 600000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 5000

set BASE_REP=Reportes/Hgi360/Nomina
set BASE_SRC=NominaHgi360
set LOG=%BASE_REP%/ejecucion_%FECHA%.log

if not exist "%BASE_REP%" mkdir "%BASE_REP%"
if not exist "%BASE_REP%\Maestros" mkdir "%BASE_REP%\Maestros"
if not exist "%BASE_REP%\Herramientas" mkdir "%BASE_REP%\Herramientas"
if not exist "%BASE_REP%\MovimientosNovedades" mkdir "%BASE_REP%\MovimientosNovedades"
if not exist "%BASE_REP%\Procesos" mkdir "%BASE_REP%\Procesos"
if not exist "%BASE_REP%\MovimientosLiquidacion" mkdir "%BASE_REP%\MovimientosLiquidacion"
if not exist "%BASE_REP%\NominaE" mkdir "%BASE_REP%\NominaE"
if not exist "%BASE_REP%\Reportes" mkdir "%BASE_REP%\Reportes"
if not exist "%BASE_REP%\Utilitarios" mkdir "%BASE_REP%\Utilitarios"
if not exist "%BASE_REP%\PruebasGenerales" mkdir "%BASE_REP%\PruebasGenerales"

REM Subcarpetas por fecha dentro de cada modulo
set REP_M=%BASE_REP%/Maestros/%FECHA%
set REP_H=%BASE_REP%/Herramientas/%FECHA%
set REP_MOV_NOV=%BASE_REP%/MovimientosNovedades/%FECHA%
set REP_PROC=%BASE_REP%/Procesos/%FECHA%
set REP_MOV_LIQ=%BASE_REP%/MovimientosLiquidacion/%FECHA%
set REP_NE=%BASE_REP%/NominaE/%FECHA%
set REP_REP=%BASE_REP%/Reportes/%FECHA%
set REP_UTIL=%BASE_REP%/Utilitarios/%FECHA%
set REP_PG=%BASE_REP%/PruebasGenerales/%FECHA%
if not exist "%BASE_REP%\Maestros\%FECHA%" mkdir "%BASE_REP%\Maestros\%FECHA%"
if not exist "%BASE_REP%\Herramientas\%FECHA%" mkdir "%BASE_REP%\Herramientas\%FECHA%"
if not exist "%BASE_REP%\MovimientosNovedades\%FECHA%" mkdir "%BASE_REP%\MovimientosNovedades\%FECHA%"
if not exist "%BASE_REP%\Procesos\%FECHA%" mkdir "%BASE_REP%\Procesos\%FECHA%"
if not exist "%BASE_REP%\MovimientosLiquidacion\%FECHA%" mkdir "%BASE_REP%\MovimientosLiquidacion\%FECHA%"
if not exist "%BASE_REP%\NominaE\%FECHA%" mkdir "%BASE_REP%\NominaE\%FECHA%"
if not exist "%BASE_REP%\Reportes\%FECHA%" mkdir "%BASE_REP%\Reportes\%FECHA%"
if not exist "%BASE_REP%\Utilitarios\%FECHA%" mkdir "%BASE_REP%\Utilitarios\%FECHA%"
if not exist "%BASE_REP%\PruebasGenerales\%FECHA%" mkdir "%BASE_REP%\PruebasGenerales\%FECHA%"

echo ========================================
echo NominaHgi360 - ejecucion por partes
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Fecha reportes: %FECHA%
echo Estrategia: una carpeta/suite a la vez,
echo   limpia Chrome entre partes, continua si falla,
echo   assertions 5s (15s en liquidacion/movimientos), concurrency 1
echo ========================================
echo.

(
  echo ========================================
  echo NominaHgi360 - ejecucion por partes
  echo Usuario: %USUARIO%
  echo Hora inicio: %HORA_INICIO%
  echo Fecha reportes: %FECHA%
  echo ========================================
) > "%LOG%"

call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 1/14 Maestros - Maestros
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/1.Maestros" %TC_OPTS% --reporter html:%REP_M%/Maestros_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 2/14 Maestros - Configuracion
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/2.Configuracion" %TC_OPTS% --reporter html:%REP_M%/Configuracion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 3/14 Maestros - Parafiscales
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/3.Parafiscales" %TC_OPTS% --reporter html:%REP_M%/Parafiscales_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 4/14 Herramientas - Administracion
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/2.Herramientas/Administracion" %TC_OPTS% --reporter html:%REP_H%/Administracion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 5/14 Herramientas - Interfaz
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/2.Herramientas/Interfaz" %TC_OPTS% --reporter html:%REP_H%/Interfaz_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 6/14 Herramientas - Perfiles
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/2.Herramientas/Perfiles" %TC_OPTS% --reporter html:%REP_H%/Perfiles_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 7/14 Herramientas - Usuarios
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/2.Herramientas/Usuarios" %TC_OPTS% --reporter html:%REP_H%/Usuarios_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 8/14 Movimientos - Novedades
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/3.Movimientos - Novedades" %TC_DOCS% --reporter html:%REP_MOV_NOV%/Novedades_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 9/14 Procesos
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/4.Procesos" %TC_OPTS% --reporter html:%REP_PROC%/Procesos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 10/14 Movimientos - Liquidacion
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/5.Movimientos - Liquidacion" %TC_DOCS% --reporter html:%REP_MOV_LIQ%/Liquidacion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 11/14 NominaE
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/6.NominaE" %TC_OPTS% --reporter html:%REP_NE%/NominaE_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 12/14 Reportes
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/7.Reportes" %TC_OPTS% --reporter html:%REP_REP%/Reportes_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 13/14 Utilitarios
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/8.Utilitarios" %TC_OPTS% --reporter html:%REP_UTIL%/Utilitarios_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 14/14 PruebasGenerales
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/PruebasGenerales" %TC_OPTS% --reporter html:%REP_PG%/PruebasGenerales_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_FIN=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "$ini=[datetime]::ParseExact('%HORA_INICIO%','yyyy-MM-dd HH:mm:ss',$null); $fin=[datetime]::ParseExact('%HORA_FIN%','yyyy-MM-dd HH:mm:ss',$null); $d=$fin-$ini; '{0:00}:{1:00}:{2:00}' -f [int]$d.TotalHours,$d.Minutes,$d.Seconds"`) do set DURACION=%%i

echo.
echo ========================================
if %FAILED% EQU 0 (
    echo NominaHgi360 finalizo correctamente.
    set RESULTADO=OK
) else (
    echo NominaHgi360 finalizo con errores en una o mas partes.
    set RESULTADO=CON ERRORES
)
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Hora fin: %HORA_FIN%
echo Duracion: %DURACION%
echo Reportes en: Reportes\Hgi360\Nomina\*\%FECHA%\
echo Fecha ejecucion: %FECHA%
echo ========================================
echo.

(
  echo.
  echo ========================================
  echo Resultado: !RESULTADO!
  echo Usuario: %USUARIO%
  echo Hora inicio: %HORA_INICIO%
  echo Hora fin: %HORA_FIN%
  echo Duracion: %DURACION%
  echo Reportes: Reportes\Hgi360\Nomina\*\%FECHA%\
  echo ========================================
) >> "%LOG%"

pause
endlocal
