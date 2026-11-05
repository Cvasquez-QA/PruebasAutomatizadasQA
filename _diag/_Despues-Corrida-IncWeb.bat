@echo off
title Espera fin de InconsistenciasWeb, diagnostico de menus y reintento de fallidas
cd /d "%~dp0.."
set C=Reportes\InconsistenciasWeb\Corrida
:esperar
if exist "%C%\_FIN.txt" goto listo
timeout /t 60 /nobreak >nul
goto esperar
:listo
call "%~dp0_Diag-Menus.bat"
powershell -NoProfile -Command "Get-Content '%C%\_RESUMEN.txt' | Where-Object { $_ -match '^\s*([1-9]\d*)\s+(\S+)' } | ForEach-Object { $Matches[2] } | Set-Content -Encoding ascii 'Reportes\InconsistenciasWeb\_fallidas.txt'"
call "%~dp0..\Ejecutables\Ejecutar-InconsistenciasWeb-Lista.bat" "Reportes\InconsistenciasWeb\_fallidas.txt" Reintento
