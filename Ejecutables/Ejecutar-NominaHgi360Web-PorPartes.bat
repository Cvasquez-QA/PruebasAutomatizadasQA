@echo off
setlocal EnableDelayedExpansion
title TestCafe - NominaHgi360Web (por partes)
cd /d "%~dp0.."

REM Fecha del reporte (yyyy-MM-dd)
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i
for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set HORA_INICIO=%%i
set USUARIO=%USERNAME%
set FAILED=0

REM Todos los fixtures de NominaHgi360Web apuntan a test.hgi360.com (testNominaConfig / testNomina8901Config): sin filtro

REM Si una prueba pasa de 8 min (10 min en novedades/liquidacion/procesos) se marca fallida y sigue con la siguiente
set TC_OPTS=--concurrency 1 --test-execution-timeout 480000 --assertion-timeout 5000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000

REM Novedades / liquidacion / procesos / documentos: assertion un poco mas holgado
set TC_DOCS=--concurrency 1 --test-execution-timeout 600000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000

set MODULO=NominaHgi360Web
set BASE_REP=Reportes\Hgi360\NominaWeb
set BASE_SRC=NominaHgi360Web
set TOTAL=28
set LOG=%BASE_REP%\ejecucion_%FECHA%.log

if not exist "%BASE_REP%" mkdir "%BASE_REP%"

echo ========================================
echo %MODULO% - ejecucion por partes
echo Fuentes: %BASE_SRC%
echo Usuario: %USUARIO%
echo Hora inicio: %HORA_INICIO%
echo Fecha reportes: %FECHA%
echo Estrategia: una carpeta/suite a la vez,
echo   limpia Chrome entre partes, continua si falla,
echo   assertions 5s (15s en novedades/liquidacion), concurrency 1
echo   maximo 8 min por prueba (10 min en novedades/liquidacion)
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

REM ========== 1. Maestros de nomina ==========
call :parte 1  "Maestros - Maestros de nomina"     "1.Maestros/1.Maestros"             TC_OPTS Maestros     MaestrosNomina
call :parte 2  "Maestros - Configuracion de nomina" "1.Maestros/2.Configuracion"       TC_OPTS Maestros     ConfiguracionNomina
call :parte 3  "Maestros - Parafiscales"           "1.Maestros/3.Parafiscales"         TC_OPTS Maestros     Parafiscales

REM ========== 1. Maestros generales ==========
call :parte 4  "Maestros - Configuracion"          "1.Maestros/Configuracion"          TC_OPTS Maestros     Configuracion
call :parte 5  "Maestros - Impuestos y unidades"   "1.Maestros/Impuestos y unidades"   TC_OPTS Maestros     ImpuestosUnidades
call :parte 6  "Maestros - Localizacion"           "1.Maestros/Localizacion"           TC_OPTS Maestros     Localizacion
call :parte 7  "Maestros - Productos y Servicios"  "1.Maestros/Productos y Servicios"  TC_OPTS Maestros     ProductosYServicios
call :parte 8  "Maestros - Terceros"               "1.Maestros/Terceros"               TC_OPTS Maestros     Terceros

REM ========== 2. Herramientas de nomina y Movimientos generales ==========
call :parte 9  "Herramientas de nomina - Parametros e Interfaz" "2.Herramientas"       TC_OPTS Herramientas HerramientasNomina
call :parte 10 "Movimientos - Documentos / Causaciones / Pagos" "2.Movimientos/Movimientos" TC_DOCS Movimientos DocumentosPagos
call :parte 11 "Movimientos - Herramientas"        "2.Movimientos/Herramientas"        TC_OPTS Movimientos  Herramientas

REM ========== 3. Novedades y Procesos generales ==========
call :parte 12 "Movimientos - Novedades"           "3.Movimientos - Novedades"         TC_DOCS MovimientosNovedades Novedades
call :parte 13 "Procesos generales"                "3.Procesos"                        TC_OPTS Procesos     ProcesosGenerales

REM ========== 4. Herramientas generales y Procesos de nomina ==========
call :parte 14 "Herramientas - Administracion y Parametros" "4.Herramientas/Administracion" TC_OPTS Herramientas Administracion
call :parte 15 "Herramientas - Interfaz"           "4.Herramientas/Interfaz"           TC_DOCS Herramientas Interfaz
call :parte 16 "Herramientas - Perfiles"           "4.Herramientas/Perfiles"           TC_OPTS Herramientas Perfiles
call :parte 17 "Herramientas - Usuarios"           "4.Herramientas/Usuarios"           TC_OPTS Herramientas Usuarios
call :parte 18 "Procesos de nomina"                "4.Procesos"                        TC_DOCS Procesos     ProcesosNomina

REM ========== 5 a 9 ==========
call :parte 19 "Movimientos - Liquidacion"         "5.Movimientos - Liquidacion"       TC_DOCS MovimientosLiquidacion Liquidacion
call :parte 20 "Utilitarios generales"             "5.Utilitarios"                     TC_OPTS Utilitarios  UtilitariosGenerales
call :parte 21 "Nomina electronica"                "6.NominaE"                         TC_DOCS NominaE      NominaE
call :parte 22 "Reportes generales"                "6.Reportes"                        TC_OPTS Reportes     ReportesGenerales
call :parte 23 "Ayuda"                             "7.Ayuda"                           TC_OPTS Ayuda        Ayuda
call :parte 24 "Reportes de nomina"                "7.Reportes"                        TC_DOCS Reportes     ReportesNomina
call :parte 25 "Facturacion Electronica"           "8.Facturacion Electronica"         TC_DOCS FacturacionElectronica FacturacionElectronica
call :parte 26 "Utilitarios de nomina"             "8.Utilitarios"                     TC_OPTS Utilitarios  UtilitariosNomina
call :parte 27 "IA"                                "9.IA"                              TC_OPTS IA           IA

REM ========== Pruebas generales ==========
call :parte 28 "PruebasGenerales"                  "PruebasGenerales"                  TC_OPTS PruebasGenerales PruebasGenerales

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
