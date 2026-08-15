@echo off
rem Creates a shareable release package. Forwards all arguments to create-package.ps1.
rem
rem   scripts\create-package.bat -Release -Verify     source + binary, with the quality gate
rem   scripts\create-package.bat -Source              source archive only (seconds)
rem   scripts\create-package.bat -Binary              web zip + installer
rem   scripts\create-package.bat -Release -Zip        also produce one archive of the release
rem   scripts\create-package.bat -Binary -Arch x64,arm64
rem
rem With none of -Source/-Binary/-Release given, it produces the full release.
rem
rem Output lands in dist\<version>\ with SHA256SUMS.txt and RELEASE.md.
rem
rem -ExecutionPolicy Bypass is passed so this works on machines where running
rem .ps1 files is restricted by policy.

setlocal
set "PSEXE=pwsh"
where /q pwsh || set "PSEXE=powershell"

"%PSEXE%" -NoProfile -ExecutionPolicy Bypass -File "%~dp0create-package.ps1" %*
exit /b %ERRORLEVEL%
