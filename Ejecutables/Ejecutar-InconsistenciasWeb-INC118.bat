@echo off
title INC118 - Neteo saldos producto 010203 (solo test)
cd /d "%~dp0.."
call "%~dp0Ejecutar-InconsistenciasWeb-Capturas.bat" "Reportes\InconsistenciasWeb\_inc118.txt" INC118
