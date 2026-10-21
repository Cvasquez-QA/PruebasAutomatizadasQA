@echo off
title TestCafe - PosHgi360Web PuntoDeVenta
cd /d "%~dp0.."
set OUT=Reportes\Hgi360\PosWeb\Movimientos
if not exist "%OUT%" mkdir "%OUT%"
if exist "%OUT%\PuntoDeVenta_FIN.txt" del "%OUT%\PuntoDeVenta_FIN.txt"
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "PosHgi360Web/2.Movimientos/Movimientos/PuntoDeVenta.js" --concurrency 1 --test-execution-timeout 600000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000 --screenshots takeOnFails=true,fullPage=true,path=%OUT%\capturas --reporter spec:%OUT%\PuntoDeVenta_spec.txt > "%OUT%\PuntoDeVenta_consola.txt" 2>&1
echo %ERRORLEVEL% > "%OUT%\PuntoDeVenta_FIN.txt"
