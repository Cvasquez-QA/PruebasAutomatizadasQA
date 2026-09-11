@echo off
setlocal EnableDelayedExpansion
title TestCafe - PosHappgi (por partes)
cd /d "%~dp0.."

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_INICIO=%%i
set USUARIO=%USERNAME%
set FAILED=0

set TC_OPTS=--concurrency 1 --test-execution-timeout 300000 --assertion-timeout 5000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 5000
set TC_DOCS=--concurrency 1 --test-execution-timeout 600000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 5000

set BASE_REP=Reportes/Happgi/Pos
set BASE_SRC=PosHappgi
set LOG=%BASE_REP%/ejecucion_%FECHA%.log

if not exist "%BASE_REP%" mkdir "%BASE_REP%"
if not exist "%BASE_REP%\Maestros" mkdir "%BASE_REP%\Maestros"
if not exist "%BASE_REP%\Movimientos" mkdir "%BASE_REP%\Movimientos"
if not exist "%BASE_REP%\Procesos" mkdir "%BASE_REP%\Procesos"
if not exist "%BASE_REP%\Herramientas" mkdir "%BASE_REP%\Herramientas"
if not exist "%BASE_REP%\Reportes" mkdir "%BASE_REP%\Reportes"
if not exist "%BASE_REP%\IA" mkdir "%BASE_REP%\IA"
if not exist "%BASE_REP%\Ayuda" mkdir "%BASE_REP%\Ayuda"
if not exist "%BASE_REP%\FacturacionElectronica" mkdir "%BASE_REP%\FacturacionElectronica"
if not exist "%BASE_REP%\PruebasGenerales" mkdir "%BASE_REP%\PruebasGenerales"

REM Subcarpetas por fecha dentro de cada modulo
set REP_M=%BASE_REP%/Maestros/%FECHA%
set REP_MOV=%BASE_REP%/Movimientos/%FECHA%
set REP_PROC=%BASE_REP%/Procesos/%FECHA%
set REP_H=%BASE_REP%/Herramientas/%FECHA%
set REP_REP=%BASE_REP%/Reportes/%FECHA%
set REP_IA=%BASE_REP%/IA/%FECHA%
set REP_AYUDA=%BASE_REP%/Ayuda/%FECHA%
set REP_FE=%BASE_REP%/FacturacionElectronica/%FECHA%
set REP_PG=%BASE_REP%/PruebasGenerales/%FECHA%
if not exist "%BASE_REP%\Maestros\%FECHA%" mkdir "%BASE_REP%\Maestros\%FECHA%"
if not exist "%BASE_REP%\Movimientos\%FECHA%" mkdir "%BASE_REP%\Movimientos\%FECHA%"
if not exist "%BASE_REP%\Procesos\%FECHA%" mkdir "%BASE_REP%\Procesos\%FECHA%"
if not exist "%BASE_REP%\Herramientas\%FECHA%" mkdir "%BASE_REP%\Herramientas\%FECHA%"
if not exist "%BASE_REP%\Reportes\%FECHA%" mkdir "%BASE_REP%\Reportes\%FECHA%"
if not exist "%BASE_REP%\IA\%FECHA%" mkdir "%BASE_REP%\IA\%FECHA%"
if not exist "%BASE_REP%\Ayuda\%FECHA%" mkdir "%BASE_REP%\Ayuda\%FECHA%"
if not exist "%BASE_REP%\FacturacionElectronica\%FECHA%" mkdir "%BASE_REP%\FacturacionElectronica\%FECHA%"
if not exist "%BASE_REP%\PruebasGenerales\%FECHA%" mkdir "%BASE_REP%\PruebasGenerales\%FECHA%"

echo ========================================
echo PosHappgi - ejecucion por partes
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Fecha reportes: %FECHA%
echo Estrategia: una carpeta/suite a la vez,
echo   limpia Chrome entre partes, continua si falla,
echo   assertions 5s (15s en documentos), concurrency 1
echo ========================================
echo.

(
  echo ========================================
  echo PosHappgi - ejecucion por partes
  echo Usuario: %USUARIO%
  echo Hora inicio: %HORA_INICIO%
  echo Fecha reportes: %FECHA%
  echo ========================================
) > "%LOG%"

call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 1/19 Maestros - Configuracion
echo ========================================
call npx testcafe chrome "%BASE_SRC%/1.Maestros/Configuracion" %TC_OPTS% --reporter html:%REP_M%/Configuracion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 2/19 Maestros - Impuestos y unidades
echo ========================================
call npx testcafe chrome "%BASE_SRC%/1.Maestros/Impuestos y unidades" %TC_OPTS% --reporter html:%REP_M%/ImpuestosUnidades_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 3/19 Maestros - Localizacion
echo ========================================
call npx testcafe chrome "%BASE_SRC%/1.Maestros/Localizacion" %TC_OPTS% --reporter html:%REP_M%/Localizacion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 4/19 Maestros - Productos y Servicios
echo ========================================
call npx testcafe chrome "%BASE_SRC%/1.Maestros/Productos y Servicios" %TC_OPTS% --reporter html:%REP_M%/ProductosYServicios_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 5/19 Maestros - Terceros
echo ========================================
call npx testcafe chrome "%BASE_SRC%/1.Maestros/Terceros" %TC_OPTS% --reporter html:%REP_M%/Terceros_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 6/19 Movimientos - Documentos / Pagos
echo ========================================
call npx testcafe chrome "%BASE_SRC%/2.Movimientos/Movimientos" %TC_DOCS% --reporter html:%REP_MOV%/DocumentosPagos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 7/19 Movimientos - Herramientas
echo ========================================
call npx testcafe chrome "%BASE_SRC%/2.Movimientos/Herramientas" %TC_OPTS% --reporter html:%REP_MOV%/Herramientas_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 8/19 Procesos
echo ========================================
call npx testcafe chrome "%BASE_SRC%/3.Procesos" %TC_OPTS% --reporter html:%REP_PROC%/Procesos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 9/19 Herramientas - Administracion
echo ========================================
call npx testcafe chrome "%BASE_SRC%/4.Herramientas/Administracion" %TC_OPTS% --reporter html:%REP_H%/Administracion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 10/19 Herramientas - Interfaz
echo ========================================
call npx testcafe chrome "%BASE_SRC%/4.Herramientas/Interfaz" %TC_OPTS% --reporter html:%REP_H%/Interfaz_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 11/19 Herramientas - Perfiles
echo ========================================
call npx testcafe chrome "%BASE_SRC%/4.Herramientas/Perfiles" %TC_OPTS% --reporter html:%REP_H%/Perfiles_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 12/19 Herramientas - Usuarios
echo ========================================
call npx testcafe chrome "%BASE_SRC%/4.Herramientas/Usuarios" %TC_OPTS% --reporter html:%REP_H%/Usuarios_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 13/19 Reportes
echo ========================================
call npx testcafe chrome "%BASE_SRC%/Reportes" %TC_OPTS% --reporter html:%REP_REP%/Reportes_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 14/19 IA
echo ========================================
call npx testcafe chrome "%BASE_SRC%/6.IA" %TC_OPTS% --reporter html:%REP_IA%/IA_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 15/19 Ayuda
echo ========================================
call npx testcafe chrome "%BASE_SRC%/7.Ayuda" %TC_OPTS% --reporter html:%REP_AYUDA%/Ayuda_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 16/19 Facturacion Electronica
echo ========================================
call npx testcafe chrome "%BASE_SRC%/Facturacion Electronica" %TC_DOCS% --reporter html:%REP_FE%/FacturacionElectronica_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 17/19 PruebasGenerales - InsertarDuplicados
echo ========================================
call npx testcafe chrome "%BASE_SRC%/PruebasGenerales/InsertarDuplicados" %TC_OPTS% --reporter html:%REP_PG%/InsertarDuplicados_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 18/19 PruebasGenerales - Prueba Pedidos
echo ========================================
call npx testcafe chrome "%BASE_SRC%/PruebasGenerales/Prueba Pedidos" %TC_DOCS% --reporter html:%REP_PG%/PruebaPedidos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 19/19 PruebasGenerales - Saldos / ValoresDocumento
echo ========================================
call npx testcafe chrome "%BASE_SRC%/PruebasGenerales/PruebaSaldos" %TC_OPTS% --reporter html:%REP_PG%/PruebaSaldos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call npx testcafe chrome "%BASE_SRC%/PruebasGenerales/PruebaValoresDocumento" %TC_DOCS% --reporter html:%REP_PG%/ValoresDocumento_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_FIN=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "$ini=[datetime]::ParseExact('%HORA_INICIO%','yyyy-MM-dd HH:mm:ss',$null); $fin=[datetime]::ParseExact('%HORA_FIN%','yyyy-MM-dd HH:mm:ss',$null); $d=$fin-$ini; '{0:00}:{1:00}:{2:00}' -f [int]$d.TotalHours,$d.Minutes,$d.Seconds"`) do set DURACION=%%i

echo.
echo ========================================
if %FAILED% EQU 0 (
    echo PosHappgi finalizo correctamente.
    set RESULTADO=OK
) else (
    echo PosHappgi finalizo con errores en una o mas partes.
    set RESULTADO=CON ERRORES
)
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Hora fin: %HORA_FIN%
echo Duracion: %DURACION%
echo Reportes en: Reportes\Happgi\Pos\*\%FECHA%\
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
  echo Reportes: Reportes\Happgi\Pos\*\%FECHA%\
  echo ========================================
) >> "%LOG%"

pause
endlocal
