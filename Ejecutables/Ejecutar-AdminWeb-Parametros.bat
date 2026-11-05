@echo off
title TestCafe - AdministrativoHgi360Web Parametros
cd /d "%~dp0.."
set OUT=Reportes\Hgi360\AdminWeb\Parametros
if not exist "%OUT%" mkdir "%OUT%"
if exist "%OUT%\_FIN.txt" del "%OUT%\_FIN.txt"
set DIR=AdministrativoHgi360Web\4.Herramientas\Administracion\Parametros
echo Inicio %DATE% %TIME% > "%OUT%\_RESUMEN.txt"
for %%F in ("%DIR%\*.js") do call :correr "%%~nF"
echo Fin %DATE% %TIME% >> "%OUT%\_RESUMEN.txt"
echo LISTO > "%OUT%\_FIN.txt"
exit /b 0

:correr
set NOMBRE=%~1
echo Ejecutando %NOMBRE%...
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "%DIR%\%NOMBRE%.js" --concurrency 1 --test-execution-timeout 600000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000 --screenshots takeOnFails=true,fullPage=true,path=%OUT%\capturas --reporter spec:"%OUT%\%NOMBRE%_spec.txt" > "%OUT%\%NOMBRE%_consola.txt" 2>&1
echo %ERRORLEVEL% %NOMBRE% >> "%OUT%\_RESUMEN.txt"
exit /b 0
