@echo off
cd /d "%~dp0.."
set OUT=Reportes\Hgi360\AdminWeb\Parametros
if exist "%OUT%\_DIAG_FIN.txt" del "%OUT%\_DIAG_FIN.txt"
call "Ejecutables\_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "_diag\DiagParametros.js" --concurrency 1 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000 --reporter spec:"%OUT%\_DIAG_spec.txt" > "%OUT%\_DIAG_consola.txt" 2>&1
echo %ERRORLEVEL% > "%OUT%\_DIAG_FIN.txt"
