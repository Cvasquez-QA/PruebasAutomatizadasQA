@echo off
title TestCafe - AdministrativoHappgi (por partes)
cd /d "%~dp0.."

REM Fecha del reporte (yyyy-MM-dd)
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i
set FAILED=0

REM Timeouts cortos para no quedarse colgado (assertions <= 5s fuera de documentos)
set TC_OPTS=--concurrency 1 --test-execution-timeout 300000 --assertion-timeout 5000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 5000

REM Documentos / movimientos / FE: assertion un poco mas holgado
set TC_DOCS=--concurrency 1 --test-execution-timeout 600000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 5000

set BASE_REP=Reportes/Happgi/Administrativo
set BASE_SRC=AdministrativoHappgi

REM Subcarpetas por fecha dentro de cada modulo (ej. Maestros\2026-08-26\)
set REP_M=%BASE_REP%/Maestros/%FECHA%
set REP_MOV=%BASE_REP%/Movimientos/%FECHA%
set REP_PROC=%BASE_REP%/Procesos/%FECHA%
set REP_H=%BASE_REP%/Herramientas/%FECHA%
set REP_REP=%BASE_REP%/Reportes/%FECHA%
set REP_FE=%BASE_REP%/FacturacionElectronica/%FECHA%
set REP_PG=%BASE_REP%/PruebasGenerales/%FECHA%

if not exist "%BASE_REP%" mkdir "%BASE_REP%"
if not exist "%BASE_REP%\Maestros" mkdir "%BASE_REP%\Maestros"
if not exist "%BASE_REP%\Movimientos" mkdir "%BASE_REP%\Movimientos"
if not exist "%BASE_REP%\Procesos" mkdir "%BASE_REP%\Procesos"
if not exist "%BASE_REP%\Herramientas" mkdir "%BASE_REP%\Herramientas"
if not exist "%BASE_REP%\Reportes" mkdir "%BASE_REP%\Reportes"
if not exist "%BASE_REP%\FacturacionElectronica" mkdir "%BASE_REP%\FacturacionElectronica"
if not exist "%BASE_REP%\PruebasGenerales" mkdir "%BASE_REP%\PruebasGenerales"
if not exist "%BASE_REP%\Maestros\%FECHA%" mkdir "%BASE_REP%\Maestros\%FECHA%"
if not exist "%BASE_REP%\Movimientos\%FECHA%" mkdir "%BASE_REP%\Movimientos\%FECHA%"
if not exist "%BASE_REP%\Procesos\%FECHA%" mkdir "%BASE_REP%\Procesos\%FECHA%"
if not exist "%BASE_REP%\Herramientas\%FECHA%" mkdir "%BASE_REP%\Herramientas\%FECHA%"
if not exist "%BASE_REP%\Reportes\%FECHA%" mkdir "%BASE_REP%\Reportes\%FECHA%"
if not exist "%BASE_REP%\FacturacionElectronica\%FECHA%" mkdir "%BASE_REP%\FacturacionElectronica\%FECHA%"
if not exist "%BASE_REP%\PruebasGenerales\%FECHA%" mkdir "%BASE_REP%\PruebasGenerales\%FECHA%"

echo ========================================
echo AdministrativoHappgi - ejecucion por partes
echo Fecha reportes: %FECHA%
echo Estrategia: una carpeta/suite a la vez,
echo   limpia Chrome entre partes, continua si falla,
echo   assertions 5s (15s en documentos), concurrency 1
echo ========================================
echo.

call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 1. Maestros ==========
echo.
echo ========================================
echo 1/19 Maestros - Configuracion
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/Configuracion" %TC_OPTS% --reporter html:%REP_M%/Configuracion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 2/19 Maestros - Impuestos y unidades
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/Impuestos y unidades" %TC_OPTS% --reporter html:%REP_M%/ImpuestosUnidades_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 3/19 Maestros - Localizacion
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/Localizacion" %TC_OPTS% --reporter html:%REP_M%/Localizacion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 4/19 Maestros - Productos y Servicios
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/Productos y Servicios" %TC_OPTS% --reporter html:%REP_M%/ProductosYServicios_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 5/19 Maestros - Terceros
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/1.Maestros/Terceros" %TC_OPTS% --reporter html:%REP_M%/Terceros_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 2. Movimientos ==========
echo.
echo ========================================
echo 6/19 Movimientos - Documentos / Pagos
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/2.Movimientos/Movimientos" %TC_DOCS% --reporter html:%REP_MOV%/DocumentosPagos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 7/19 Movimientos - Herramientas
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/2.Movimientos/Herramientas" %TC_OPTS% --reporter html:%REP_MOV%/Herramientas_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 8/19 Movimientos - mov (CRUD_Pagos)
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/mov" %TC_DOCS% --reporter html:%REP_MOV%/CRUD_Pagos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 3. Procesos ==========
echo.
echo ========================================
echo 9/19 Procesos
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/3.Procesos" %TC_OPTS% --reporter html:%REP_PROC%/Procesos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 4. Herramientas ==========
echo.
echo ========================================
echo 10/19 Herramientas - Administracion
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/4.Herramientas/Administracion" %TC_OPTS% --reporter html:%REP_H%/Administracion_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 11/19 Herramientas - Interfaz
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/4.Herramientas/Interfaz" %TC_OPTS% --reporter html:%REP_H%/Interfaz_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 12/19 Herramientas - Perfiles
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/4.Herramientas/Perfiles" %TC_OPTS% --reporter html:%REP_H%/Perfiles_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 13/19 Herramientas - Usuarios
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/4.Herramientas/Usuarios" %TC_OPTS% --reporter html:%REP_H%/Usuarios_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 6. Reportes ==========
echo.
echo ========================================
echo 14/19 Reportes
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/6.Reportes" %TC_OPTS% --reporter html:%REP_REP%/Reportes_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 8. Facturacion Electronica ==========
echo.
echo ========================================
echo 15/19 Facturacion Electronica
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/8.Facturacion Electronica" %TC_DOCS% --reporter html:%REP_FE%/FacturacionElectronica_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== PruebasGenerales ==========
echo.
echo ========================================
echo 16/19 PruebasGenerales - InsertarDuplicados
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/PruebasGenerales/InsertarDuplicados" %TC_OPTS% --reporter html:%REP_PG%/InsertarDuplicados_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 17/19 PruebasGenerales - Prueba Pedidos
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/PruebasGenerales/Prueba Pedidos" %TC_DOCS% --reporter html:%REP_PG%/PruebaPedidos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 18/19 PruebasGenerales - PruebaSaldos
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/PruebasGenerales/PruebaSaldos" %TC_OPTS% --reporter html:%REP_PG%/PruebaSaldos_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
echo 19/19 PruebasGenerales - ValoresDocumento
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/PruebasGenerales/PruebaValoresDocumento" %TC_DOCS% --reporter html:%REP_PG%/ValoresDocumento_%FECHA%.html
if errorlevel 1 set FAILED=1
call "%~dp0_Limpiar-Chrome-TestCafe.bat"

echo.
echo ========================================
if %FAILED% EQU 0 (
    echo AdministrativoHappgi finalizo correctamente.
) else (
    echo AdministrativoHappgi finalizo con errores en una o mas partes.
)
echo Reportes en: Reportes\Happgi\Administrativo\*\%FECHA%\
echo   Maestros\%FECHA%\  Movimientos\%FECHA%\  Procesos\%FECHA%\
echo   Herramientas\%FECHA%\  Reportes\%FECHA%\  FacturacionElectronica\%FECHA%\
echo   PruebasGenerales\%FECHA%\
echo Fecha ejecucion: %FECHA%
echo ========================================
echo.
pause
