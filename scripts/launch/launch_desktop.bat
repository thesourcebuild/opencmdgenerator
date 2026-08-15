@echo off
rem Launches the Electron desktop app. Forwards all arguments to launch_desktop.ps1.
rem
rem   scripts\launch_desktop.bat           dev: starts the web server, waits, runs Electron
rem   scripts\launch_desktop.bat -Prod     build and run the real app over app://
rem   scripts\launch_desktop.bat -Smoke    headless check that the bundle loads
rem   scripts\launch_desktop.bat -NoWeb    assume a dev server is already running
rem
rem -ExecutionPolicy Bypass is passed so this works on machines where running
rem .ps1 files is restricted by policy.

setlocal
set "PSEXE=pwsh"
where /q pwsh || set "PSEXE=powershell"

"%PSEXE%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch_desktop.ps1" %*
exit /b %ERRORLEVEL%
