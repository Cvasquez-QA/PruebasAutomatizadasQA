@echo off
title Parametros: diagnostico + Admin + Pos
call "%~dp0_Diag-Parametros.bat"
call "%~dp0..\Ejecutables\Ejecutar-AdminWeb-Parametros.bat"
call "%~dp0..\Ejecutables\Ejecutar-PosWeb-Parametros.bat"
