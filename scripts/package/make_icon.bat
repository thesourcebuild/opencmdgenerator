@echo off
rem Generates the application icon set. Forwards all arguments to make_icon.ps1.
rem
rem   scripts\package\make_icon.bat
rem   scripts\package\make_icon.bat -OutDir <path>
rem
rem -ExecutionPolicy Bypass is passed so this works on machines where running
rem .ps1 files is restricted by policy.

setlocal
set "PSEXE=pwsh"
where /q pwsh || set "PSEXE=powershell"

"%PSEXE%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0make_icon.ps1" %*
exit /b %ERRORLEVEL%