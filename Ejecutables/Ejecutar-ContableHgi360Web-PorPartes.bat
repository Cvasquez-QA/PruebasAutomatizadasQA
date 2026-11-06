@echo off
setlocal EnableDelayedExpansion
title TestCafe - ContableHgi360Web (por partes)
cd /d "%~dp0.."

REM Fecha del reporte (yyyy-MM-dd)
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_INICIO=%%i
set USUARIO=%USERNAME%
set FAILED=0

REM Solo fixtures de test.hgi360.com: muchos archivos traen tambien un fixture "Hgi360 Admin" / "Test Hgi360 Contable"
REM (hgi360.com / mi.hgi360.com = produccion) que NO se ejecuta
set TC_FILTRO=--fixture-grep "Test (Hgi360|Happgi)$"

REM Si una prueba pasa de 8 min (10 min en documentos/FE/interfaz) se marca fallida y sigue con la siguiente
set TC_OPTS=--concurrency 1 --test-execution-timeout 480000 --assertion-timeout 5000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000 %TC_FILTRO%

REM Documentos / movimientos / FE / interfaz: assertion un poco mas holgado
set TC_DOCS=--concurrency 1 --test-execution-timeout 600000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000 %TC_FILTRO%

set MODULO=ContableHgi360Web
set BASE_REP=Reportes\Hgi360\ContableWeb
set BASE_SRC=ContableHgi360Web
set TOTAL=18
set LOG=%BASE_REP%\ejecucion_%FECHA%.log

if not exist "%BASE_REP%" mkdir "%BASE_REP%"

echo ========================================
echo %MODULO% - ejecucion por partes
echo Fuentes: %BASE_SRC%
echo Ambiente: solo fixtures "Test Hgi360" (test.hgi360.com)
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Fecha reportes: %FECHA%
echo Estrategia: una carpeta/suite a la vez,
echo   limpia Chrome entre partes, continua si falla,
echo   assertions 5s (15s en documentos), concurrency 1
echo   maximo 8 min por prueba (10 min en documentos)
echo ========================================
echo.

(
  echo ========================================
  echo %MODULO% - ejecucion por partes
  echo Fuentes: %BASE_SRC%
  echo Usuario: %USUARIO%
  echo Hora inicio: %HORA_INICIO%
  echo Fecha reportes: %FECHA%
  echo ========================================
) > "%LOG%"

call "%~dp0_Limpiar-Chrome-TestCafe.bat"

REM ========== 1. Maestros ==========
call :parte 1  "Maestros - Configuracion"          "1.Maestros/Configuracion"          TC_OPTS Maestros     Configuracion
call :parte 2  "Maestros - Impuestos y unidades"   "1.Maestros/Impuestos y unidades"   TC_OPTS Maestros     ImpuestosUnidades
call :parte 3  "Maestros - Localizacion"           "1.Maestros/Localizacion"           TC_OPTS Maestros     Localizacion
call :parte 4  "Maestros - Productos y Servicios"  "1.Maestros/Productos y Servicios"  TC_OPTS Maestros     ProductosYServicios
call :parte 5  "Maestros - Terceros"               "1.Maestros/Terceros"               TC_OPTS Maestros     Terceros

REM ========== 2. Movimientos ==========
call :parte 6  "Movimientos - Documentos / Causaciones / Pagos" "2.Movimientos/Movimientos" TC_DOCS Movimientos DocumentosPagos
call :parte 7  "Movimientos - Herramientas"        "2.Movimientos/Herramientas"        TC_OPTS Movimientos  Herramientas

REM ========== 3. Procesos ==========
call :parte 8  "Procesos"                          "3.Procesos"                        TC_OPTS Procesos     Procesos

REM ========== 4. Herramientas ==========
call :parte 9  "Herramientas - Administracion y Parametros" "4.Herramientas/Administracion" TC_OPTS Herramientas Administracion
call :parte 10 "Herramientas - Interfaz"           "4.Herramientas/Interfaz"           TC_DOCS Herramientas Interfaz
call :parte 11 "Herramientas - Perfiles"           "4.Herramientas/Perfiles"           TC_OPTS Herramientas Perfiles
call :parte 12 "Herramientas - Usuarios"           "4.Herramientas/Usuarios"           TC_OPTS Herramientas Usuarios

REM ========== 5 a 9 ==========
call :parte 13 "Utilitarios"                       "5.Utilitarios"                     TC_OPTS Utilitarios  Utilitarios
call :parte 14 "Reportes"                          "6.Reportes"                        TC_OPTS Reportes     Reportes
call :parte 15 "Ayuda"                             "7.Ayuda"                           TC_OPTS Ayuda        Ayuda
call :parte 16 "Facturacion Electronica"           "8.Facturacion Electronica"         TC_DOCS FacturacionElectronica FacturacionElectronica
call :parte 17 "IA"                                "9.IA"                              TC_OPTS IA           IA

REM ========== Pruebas generales (validacion de campos e InsertarDuplicados) ==========
call :parte 18 "PruebasGenerales"                  "PruebasGenerales"                  TC_OPTS PruebasGenerales PruebasGenerales

goto :fin

REM ---------------------------------------------------------------
REM :parte  numero  "titulo"  "carpeta fuente"  VARIABLE_OPCIONES  carpetaReporte  nombreReporte
REM ---------------------------------------------------------------
:parte
set REP_DIR=%BASE_REP%\%~5\%FECHA%
if not exist "%REP_DIR%" mkdir "%REP_DIR%"
echo.
echo ========================================
echo %~1/%TOTAL% %~2
echo ========================================
call node_modules\.bin\testcafe chrome "%BASE_SRC%/%~3" !%~4! --reporter html:%REP_DIR%\%~6_%FECHA%.html
if errorlevel 1 (
    set FAILED=1
    echo [FALLO] %~1/%TOTAL% %~2 >> "%LOG%"
) else (
    echo [OK]    %~1/%TOTAL% %~2 >> "%LOG%"
)
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
goto :eof

:fin
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_FIN=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "$ini=[datetime]::ParseExact('%HORA_INICIO%','yyyy-MM-dd HH:mm:ss',$null); $fin=[datetime]::ParseExact('%HORA_FIN%','yyyy-MM-dd HH:mm:ss',$null); $d=$fin-$ini; '{0:00}:{1:00}:{2:00}' -f [int][math]::Floor($d.TotalHours),$d.Minutes,$d.Seconds"`) do set DURACION=%%i

echo.
echo ========================================
if %FAILED% EQU 0 (
    echo %MODULO% finalizo correctamente.
    set RESULTADO=OK
) else (
    echo %MODULO% finalizo con errores en una o mas partes.
    set RESULTADO=CON ERRORES
)
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Hora fin: %HORA_FIN%
echo Duracion: %DURACION%
echo Reportes en: %BASE_REP%\*\%FECHA%\
echo Resumen por parte: %LOG%
echo Fuentes: %BASE_SRC%\
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
  echo Reportes: %BASE_REP%\*\%FECHA%\
  echo Fuentes: %BASE_SRC%\
  echo ========================================
) >> "%LOG%"

pause
endlocal
