@echo off
setlocal EnableDelayedExpansion
title TestCafe - ContableHgi360Legacy (por partes)
cd /d "%~dp0.."

REM Fecha del reporte (yyyy-MM-dd)
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_INICIO=%%i
set USUARIO=%USERNAME%
set FAILED=0

REM Solo fixtures de test.hgi360.com: cada archivo tambien trae un fixture "Mi ERP" (produccion) que NO se ejecuta
set TC_FILTRO=--fixture-grep "Test Contable$"

REM Timeouts cortos para no quedarse colgado (assertions <= 5s fuera de documentos)
REM Si una prueba pasa de 5 min (10 min en documentos/FE) se marca fallida y sigue con la siguiente
set TC_OPTS=--concurrency 1 --test-execution-timeout 300000 --assertion-timeout 5000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 5000 %TC_FILTRO%

REM Documentos / movimientos / FE: assertion un poco mas holgado
set TC_DOCS=--concurrency 1 --test-execution-timeout 600000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 5000 %TC_FILTRO%

set BASE_REP=Reportes/Hgi360/ContableLegacy
set BASE_SRC=ContableHgi360Legacy
set LOG=%BASE_REP%/ejecucion_%FECHA%.log

if not exist "%BASE_REP%" mkdir "%BASE_REP%"
if not exist "%BASE_REP%\Maestros" mkdir "%BASE_REP%\Maestros"
if not exist "%BASE_REP%\Movimientos" mkdir "%BASE_REP%\Movimientos"
if not exist "%BASE_REP%\Procesos" mkdir "%BASE_REP%\Procesos"
if not exist "%BASE_REP%\Herramientas" mkdir "%BASE_REP%\Herramientas"
if not exist "%BASE_REP%\Utilitarios" mkdir "%BASE_REP%\Utilitarios"
if not exist "%BASE_REP%\Reportes" mkdir "%BASE_REP%\Reportes"
if not exist "%BASE_REP%\Ayuda" mkdir "%BASE_REP%\Ayuda"
if not exist "%BASE_REP%\FacturacionElectronica" mkdir "%BASE_REP%\FacturacionElectronica"
if not exist "%BASE_REP%\PruebasGenerales" mkdir "%BASE_REP%\PruebasGenerales"

REM Subcarpetas por fecha dentro de cada modulo
set REP_M=%BASE_REP%/Maestros/%FECHA%
set REP_MOV=%BASE_REP%/Movimientos/%FECHA%
set REP_PROC=%BASE_REP%/Procesos/%FECHA%
set REP_H=%BASE_REP%/Herramientas/%FECHA%
set REP_UTIL=%BASE_REP%/Utilitarios/%FECHA%
set REP_REP=%BASE_REP%/Reportes/%FECHA%
set REP_AYUDA=%BASE_REP%/Ayuda/%FECHA%
set REP_FE=%BASE_REP%/FacturacionElectronica/%FECHA%
set REP_PG=%BASE_REP%/PruebasGenerales/%FECHA%
if not exist "%BASE_REP%\Maestros\%FECHA%" mkdir "%BASE_REP%\Maestros\%FECHA%"
if not exist "%BASE_REP%\Movimientos\%FECHA%" mkdir "%BASE_REP%\Movimientos\%FECHA%"
if not exist "%BASE_REP%\Procesos\%FECHA%" mkdir "%BASE_REP%\Procesos\%FECHA%"
if not exist "%BASE_REP%\Herramientas\%FECHA%" mkdir "%BASE_REP%\Herramientas\%FECHA%"
if not exist "%BASE_REP%\Utilitarios\%FECHA%" mkdir "%BASE_REP%\Utilitarios\%FECHA%"
if not exist "%BASE_REP%\Reportes\%FECHA%" mkdir "%BASE_REP%\Reportes\%FECHA%"
if not exist "%BASE_REP%\Ayuda\%FECHA%" mkdir "%BASE_REP%\Ayuda\%FECHA%"
if not exist "%BASE_REP%\FacturacionElectronica\%FECHA%" mkdir "%BASE_REP%\FacturacionElectronica\%FECHA%"
if not exist "%BASE_REP%\PruebasGenerales\%FECHA%" mkdir "%BASE_REP%\PruebasGenerales\%FECHA%"

echo ========================================
echo ContableHgi360Legacy - ejecucion por partes
echo Fuentes: %BASE_SRC%
echo Ambiente: solo fixtures "Test Contable" (test.hgi360.com)
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Fecha reportes: %FECHA%
echo Estrategia: una carpeta/suite a la vez,
echo   limpia Chrome entre partes, continua si falla,
echo   assertions 5s (15s en documentos), concurrency 1
echo   maximo 5 min por prueba (10 min en documentos)
echo ========================================
echo.

(
  echo ========================================
  echo ContableHgi360Legacy - ejecucion por partes
  echo Fuentes: %BASE_SRC%
  echo Usuario: %USUARIO%
  echo Hora inicio: %HORA_INICIO%
  echo Fecha reportes: %FECHA%
  echo ========================================
) > "%LOG%"

call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 1. Maestros ==========
echo.
echo ========================================
echo 1/21 Maestros - Configuracion
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/Configuracion" %TC_OPTS% --reporter html:%REP_M%/Configuracion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 2/21 Maestros - Impuestos y unidades
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/Impuestos y unidades" %TC_OPTS% --reporter html:%REP_M%/ImpuestosUnidades_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 3/21 Maestros - Localizacion
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/Localizacion" %TC_OPTS% --reporter html:%REP_M%/Localizacion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 4/21 Maestros - Productos y Servicios
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/Productos y Servicios" %TC_OPTS% --reporter html:%REP_M%/ProductosYServicios_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 5/21 Maestros - Terceros
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/Terceros" %TC_OPTS% --reporter html:%REP_M%/Terceros_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 2. Movimientos ==========
echo.
echo ========================================
echo 6/21 Movimientos - Documentos
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/2.Movimientos/Movimientos" %TC_DOCS% --reporter html:%REP_MOV%/Documentos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 7/21 Movimientos - Pagos
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/2.Movimientos/CRUD_Pagos.js" "%BASE_SRC%/2.Movimientos/PagosNew.js" %TC_DOCS% --reporter html:%REP_MOV%/Pagos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 8/21 Movimientos - Herramientas
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/2.Movimientos/Herramientas" %TC_OPTS% --reporter html:%REP_MOV%/Herramientas_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 3. Procesos ==========
echo.
echo ========================================
echo 9/21 Procesos
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/3.Procesos" %TC_OPTS% --reporter html:%REP_PROC%/Procesos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 4. Herramientas ==========
echo.
echo ========================================
echo 10/21 Herramientas - Administracion
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/4.Herramientas/Administracion" %TC_OPTS% --reporter html:%REP_H%/Administracion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 11/21 Herramientas - Interfaz
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/4.Herramientas/Interfaz" %TC_OPTS% --reporter html:%REP_H%/Interfaz_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 12/21 Herramientas - Perfiles
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/4.Herramientas/Perfiles" %TC_OPTS% --reporter html:%REP_H%/Perfiles_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 13/21 Herramientas - Usuarios
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/4.Herramientas/Usuarios" %TC_OPTS% --reporter html:%REP_H%/Usuarios_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 5. Utilitarios ==========
echo.
echo ========================================
echo 14/21 Utilitarios
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/5.Utilitarios" %TC_OPTS% --reporter html:%REP_UTIL%/Utilitarios_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 6. Reportes ==========
echo.
echo ========================================
echo 15/21 Reportes
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/6.Reportes" %TC_OPTS% --reporter html:%REP_REP%/Reportes_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 7. Ayuda ==========
echo.
echo ========================================
echo 16/21 Ayuda
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/7.Ayuda" %TC_OPTS% --reporter html:%REP_AYUDA%/Ayuda_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 8. Facturacion Electronica ==========
echo.
echo ========================================
echo 17/21 Facturacion Electronica
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/8.Facturacion Electronica" %TC_DOCS% --reporter html:%REP_FE%/FacturacionElectronica_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== Pruebas generales ==========
echo.
echo ========================================
echo 18/21 PruebasGenerales - ValidacionStandar / InsertarDuplicados
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/PruebasGenerales/ValidacionStandar.js" "%BASE_SRC%/PruebasGenerales/InsertarDuplicados" %TC_OPTS% --reporter html:%REP_PG%/ValidacionInsertarDuplicados_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 19/21 PruebasGenerales - Prueba Pedidos
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/PruebasGenerales/Prueba Pedidos" %TC_DOCS% --reporter html:%REP_PG%/PruebaPedidos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 20/21 PruebasGenerales - Saldos
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/PruebasGenerales/PruebaSaldos" %TC_OPTS% --reporter html:%REP_PG%/PruebaSaldos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 21/21 PruebasGenerales - ValoresDocumento
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/PruebasGenerales/PruebaValoresDocumento" %TC_DOCS% --reporter html:%REP_PG%/ValoresDocumento_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_FIN=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "$ini=[datetime]::ParseExact('%HORA_INICIO%','yyyy-MM-dd HH:mm:ss',$null); $fin=[datetime]::ParseExact('%HORA_FIN%','yyyy-MM-dd HH:mm:ss',$null); $d=$fin-$ini; '{0:00}:{1:00}:{2:00}' -f [int]$d.TotalHours,$d.Minutes,$d.Seconds"`) do set DURACION=%%i

echo.
echo ========================================
if %FAILED% EQU 0 (
    echo ContableHgi360Legacy finalizo correctamente.
    set RESULTADO=OK
) else (
    echo ContableHgi360Legacy finalizo con errores en una o mas partes.
    set RESULTADO=CON ERRORES
)
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Hora fin: %HORA_FIN%
echo Duracion: %DURACION%
echo Reportes en: Reportes\Hgi360\ContableLegacy\*\%FECHA%\
echo Fuentes: %BASE_SRC%\
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
  echo Reportes: Reportes\Hgi360\ContableLegacy\*\%FECHA%\
  echo Fuentes: %BASE_SRC%\
  echo ========================================
) >> "%LOG%"

pause
endlocal
