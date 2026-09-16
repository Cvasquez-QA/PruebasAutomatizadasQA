@echo off
cd /d "D:\QA\PRUEBAS_AUTOMATIZADAS\PruebasAutomatizadasQA"
echo CWD=%CD%
echo NODE_PATH before=%NODE_PATH%
dir node_modules\testcafe-reporter-html\package.json
set NODE_PATH=%CD%\node_modules
call "%CD%\node_modules\.bin\testcafe.cmd" chrome "AdministrativoHgi360/1.Maestros/Configuracion/CRUD_EmpresasUX.js" --concurrency 1 --test-execution-timeout 30000 --reporter html:Reportes/_probe2.html
echo EXIT=%ERRORLEVEL%
