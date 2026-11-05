@echo off
setlocal EnableDelayedExpansion
title TestCafe - InconsistenciasWeb (uno por uno)
cd /d "%~dp0.."
set OUT=Reportes\InconsistenciasWeb\Corrida
if not exist "%OUT%" mkdir "%OUT%"
if exist "%OUT%\_FIN.txt" del "%OUT%\_FIN.txt"
set DIR=InconsistenciasWeb
REM Si se pasa un archivo de lista (un nombre sin .js por linea), solo corre esos
set LISTA=%~1
echo Inicio %DATE% %TIME% > "%OUT%\_RESUMEN.txt"
if "%LISTA%"=="" (
    for %%F in ("%DIR%\*.js") do (
        echo %%~nF | findstr /i "copia" >nul
        if errorlevel 1 call :correr "%%~nF"
    )
) else (
    for /f "usebackq delims=" %%N in ("%LISTA%") do call :correr "%%N"
)
echo Fin %DATE% %TIME% >> "%OUT%\_RESUMEN.txt"
echo LISTO > "%OUT%\_FIN.txt"
exit /b 0

:correr
set NOMBRE=%~1
echo Ejecutando %NOMBRE%...
call "%~dp0_Limpiar-Chrome-TestCafe.bat"
call node_modules\.bin\testcafe chrome "%DIR%\%NOMBRE%.js" --test-execution-timeout 300000 --assertion-timeout 15000 --selector-timeout 5000 --page-load-timeout 5000 --browser-init-timeout 30000 --ajax-request-timeout 60000 --screenshots takeOnFails=true,fullPage=true,path=%OUT%\capturas --reporter spec:"%OUT%\%NOMBRE%_spec.txt" > "%OUT%\%NOMBRE%_consola.txt" 2>&1
echo !ERRORLEVEL! %NOMBRE% >> "%OUT%\_RESUMEN.txt"
exit /b 0
