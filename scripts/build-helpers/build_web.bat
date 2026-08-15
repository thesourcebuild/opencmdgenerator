@echo off
rem Builds the web static export. Forwards all arguments to build_web.ps1.
rem
rem   scripts\build_web.bat              build apps/web/out
rem   scripts\build_web.bat -Clean       fresh build, bypassing the turbo cache
rem   scripts\build_web.bat -Serve       build then serve it for a look
rem
rem -ExecutionPolicy Bypass is passed so this works on machines where running
rem .ps1 files is restricted by policy.

setlocal
set "PSEXE=pwsh"
where /q pwsh || set "PSEXE=powershell"

"%PSEXE%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_web.ps1" %*
exit /b %ERRORLEVEL%
