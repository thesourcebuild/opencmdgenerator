@echo off
rem Launches the web app. Forwards all arguments to launch_web.ps1.
rem
rem   scripts\launch_web.bat                dev server on http://localhost:3000
rem   scripts\launch_web.bat -Port 4000     dev server on another port
rem   scripts\launch_web.bat -Open          open a browser once it is listening
rem   scripts\launch_web.bat -Prod          build the static export and serve it
rem
rem -ExecutionPolicy Bypass is passed so this works on machines where running
rem .ps1 files is restricted by policy.

setlocal
set "PSEXE=pwsh"
where /q pwsh || set "PSEXE=powershell"

"%PSEXE%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch_web.ps1" %*
exit /b %ERRORLEVEL%
