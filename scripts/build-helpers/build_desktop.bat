@echo off
rem Builds the Electron desktop app. Forwards all arguments to build_desktop.ps1.
rem
rem   scripts\build_desktop.bat                    web export + renderer + main bundle
rem   scripts\build_desktop.bat -Clean -Smoke      fresh build, then verify it loads
rem   scripts\build_desktop.bat -Package           also build the setup .exe
rem   scripts\build_desktop.bat -Package -Arch x64,arm64
rem
rem -Package writes the installer to dist\<version>\ via create-package.ps1.
rem
rem -ExecutionPolicy Bypass is passed so this works on machines where running
rem .ps1 files is restricted by policy.

setlocal
set "PSEXE=pwsh"
where /q pwsh || set "PSEXE=powershell"

"%PSEXE%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_desktop.ps1" %*
exit /b %ERRORLEVEL%
