@echo off
title TestCafe - PosHgi360Web Herramientas-ArchivosInterfaz
cd /d "%~dp0.."
if not exist "Reportes\Hgi360\PosWeb\Herramientas" mkdir "Reportes\Hgi360\PosWeb\Herramientas"
set OUT=Reportes\Hgi360\PosWeb\Herramientas
if exist "%OUT%\ArchivosInterfaz_FIN.txt" del "%OUT%\ArchivosInterfaz_FIN.txt"
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "PosHgi360Web/4.Herramientas/Interfaz/Herramientas-ArchivosInterfaz.js" --concurrency 1 --test-execution-timeout 600000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000 --reporter spec:%OUT%\ArchivosInterfaz_spec.txt,html:%OUT%\ArchivosInterfaz.html > "%OUT%\ArchivosInterfaz_consola.txt" 2>&1
echo %ERRORLEVEL% > "%OUT%\ArchivosInterfaz_FIN.txt"
