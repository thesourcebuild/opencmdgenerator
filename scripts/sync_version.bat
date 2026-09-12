@echo off
rem Syncs package.json versions with the root version file.
rem
rem   scripts\sync_version.bat
rem   scripts\sync_version.bat -Version 0.1.18
rem
rem -ExecutionPolicy Bypass is passed so this works on machines where running
rem .ps1 files is restricted by policy.

setlocal
set "PSEXE=pwsh"
where /q pwsh || set "PSEXE=powershell"

"%PSEXE%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync_version.ps1" %*
exit /b %ERRORLEVEL%
