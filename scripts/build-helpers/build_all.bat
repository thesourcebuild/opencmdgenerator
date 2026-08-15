@echo off
rem Builds web and desktop. Forwards all arguments to build_all.ps1.
rem
rem   scripts\build_all.bat                        build both
rem   scripts\build_all.bat -Clean -Verify -Smoke  release build with the full gate
rem   scripts\build_all.bat -Verify -Package       gate, build, then the setup .exe
rem
rem -Package writes the installer to dist\<version>\ via create-package.ps1.
rem
rem -ExecutionPolicy Bypass is passed so this works on machines where running
rem .ps1 files is restricted by policy.

setlocal
set "PSEXE=pwsh"
where /q pwsh || set "PSEXE=powershell"

"%PSEXE%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_all.ps1" %*
exit /b %ERRORLEVEL%
