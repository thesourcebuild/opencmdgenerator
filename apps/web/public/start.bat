@echo off
setlocal
cd /d "%~dp0"
set PORT=8000

set PYCMD=
where python >nul 2>nul
if not errorlevel 1 set PYCMD=python
if not defined PYCMD (
    where python3 >nul 2>nul
    if not errorlevel 1 set PYCMD=python3
)
if not defined PYCMD (
    where py >nul 2>nul
    if not errorlevel 1 set PYCMD=py
)

if not defined PYCMD (
    echo No Python found on PATH.
    echo Serve this folder with any static file server, then open
    echo http://localhost:%PORT%/ in your browser.
    pause
    exit /b 1
)

echo Starting a local server on port %PORT% ...
start "rsync command generator - local server" cmd /k %PYCMD% -m http.server %PORT%
ping -n 3 127.0.0.1 >nul
start "" http://localhost:%PORT%/

echo.
echo Server is running in the other window titled "rsync command generator - local server".
echo Close that window to stop it.
