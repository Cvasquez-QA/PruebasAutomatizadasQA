@echo off
cd /d "%~dp0.."
set OUT=Reportes\InconsistenciasWeb
if not exist "%OUT%" mkdir "%OUT%"
call "Ejecutables\_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "_diag\DiagMenus.js" --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000 --reporter spec:"%OUT%\_DIAG_MENUS_spec.txt" > "%OUT%\_DIAG_MENUS_consola.txt" 2>&1
echo %ERRORLEVEL% > "%OUT%\_DIAG_MENUS_FIN.txt"
