@echo off
title TestCafe - Generales CambiarPeriodoUsuariosAut
cd /d "%~dp0.."
set OUT=Reportes\Hgi360\Generales
if not exist "%OUT%" mkdir "%OUT%"
if exist "%OUT%\CambiarPeriodo_FIN.txt" del "%OUT%\CambiarPeriodo_FIN.txt"
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "Generales/CambiarPeriodoUsuariosAut.js" --concurrency 1 --test-execution-timeout 600000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000 --screenshots takeOnFails=true,fullPage=true,path=%OUT%\capturas --reporter spec:%OUT%\CambiarPeriodo_spec.txt > "%OUT%\CambiarPeriodo_consola.txt" 2>&1
echo %ERRORLEVEL% > "%OUT%\CambiarPeriodo_FIN.txt"
