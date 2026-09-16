@echo off
REM Cierra solo Chrome lanzado por TestCafe (perfiles en Temp\testcafe), no el Chrome normal del usuario.
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | Where-Object { $_.CommandLine -like '*\testcafe\chrome-profile-*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>&1
exit /b 0
