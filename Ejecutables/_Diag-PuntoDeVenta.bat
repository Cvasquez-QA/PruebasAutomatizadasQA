@echo off
cd /d "%~dp0.."
set OUT=Reportes\Hgi360\PosWeb\Movimientos
if exist "%OUT%\DiagPV_FIN.txt" del "%OUT%\DiagPV_FIN.txt"
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "PosHgi360Web/2.Movimientos/Movimientos/_diag_PuntoDeVenta.js" --ajax-request-timeout 60000 --reporter spec:%OUT%\DiagPV_spec.txt > "%OUT%\DiagPV_consola.txt" 2>&1
echo %ERRORLEVEL% > "%OUT%\DiagPV_FIN.txt"
