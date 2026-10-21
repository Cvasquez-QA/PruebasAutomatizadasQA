@echo off
title TestCafe - PosHgi360Web Maestros
cd /d "%~dp0.."
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i
set OUT=Reportes\Hgi360\PosWeb\Maestros\%FECHA%
if not exist "%OUT%" mkdir "%OUT%"
if exist "%OUT%\Maestros_FIN.txt" del "%OUT%\Maestros_FIN.txt"
set TC_OPTS=--concurrency 1 --test-execution-timeout 480000 --assertion-timeout 5000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000
set FAILED=0
echo %TIME% inicio Configuracion>> "%OUT%\Maestros_progreso.txt"
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "PosHgi360Web/1.Maestros/Configuracion" %TC_OPTS% --reporter spec:%OUT%\Configuracion_spec.txt,html:%OUT%\Configuracion.html > "%OUT%\Configuracion_consola.txt" 2>&1
if errorlevel 1 set FAILED=1
echo %TIME% fin Configuracion>> "%OUT%\Maestros_progreso.txt"
echo %TIME% inicio ImpuestosUnidades>> "%OUT%\Maestros_progreso.txt"
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "PosHgi360Web/1.Maestros/Impuestos y unidades" %TC_OPTS% --reporter spec:%OUT%\ImpuestosUnidades_spec.txt,html:%OUT%\ImpuestosUnidades.html > "%OUT%\ImpuestosUnidades_consola.txt" 2>&1
if errorlevel 1 set FAILED=1
echo %TIME% fin ImpuestosUnidades>> "%OUT%\Maestros_progreso.txt"
echo %TIME% inicio Localizacion>> "%OUT%\Maestros_progreso.txt"
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "PosHgi360Web/1.Maestros/Localizacion" %TC_OPTS% --reporter spec:%OUT%\Localizacion_spec.txt,html:%OUT%\Localizacion.html > "%OUT%\Localizacion_consola.txt" 2>&1
if errorlevel 1 set FAILED=1
echo %TIME% fin Localizacion>> "%OUT%\Maestros_progreso.txt"
echo %TIME% inicio ProductosServicios>> "%OUT%\Maestros_progreso.txt"
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "PosHgi360Web/1.Maestros/Productos y Servicios" %TC_OPTS% --reporter spec:%OUT%\ProductosServicios_spec.txt,html:%OUT%\ProductosServicios.html > "%OUT%\ProductosServicios_consola.txt" 2>&1
if errorlevel 1 set FAILED=1
echo %TIME% fin ProductosServicios>> "%OUT%\Maestros_progreso.txt"
echo %TIME% inicio Terceros>> "%OUT%\Maestros_progreso.txt"
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "PosHgi360Web/1.Maestros/Terceros" %TC_OPTS% --reporter spec:%OUT%\Terceros_spec.txt,html:%OUT%\Terceros.html > "%OUT%\Terceros_consola.txt" 2>&1
if errorlevel 1 set FAILED=1
echo %TIME% fin Terceros>> "%OUT%\Maestros_progreso.txt"
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
echo %FAILED% > "%OUT%\Maestros_FIN.txt"
