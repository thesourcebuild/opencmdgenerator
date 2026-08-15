<#
.SYNOPSIS
Runs the web app.

.DESCRIPTION
By default starts the Next dev server with hot reload. With -Prod it produces the
static export and serves it, which is the exact bundle the desktop shell loads -
useful for checking the app behaves the same when it is static.

.PARAMETER Port
Port to listen on. Default 3000.

.PARAMETER Prod
Build the static export and serve it instead of running the dev server.

.PARAMETER Open
Open a browser once the port is accepting connections.

.EXAMPLE
.\scripts\launch_web.ps1
.EXAMPLE
.\scripts\launch_web.ps1 -Port 4000 -Open
.EXAMPLE
.\scripts\launch_web.ps1 -Prod
#>
[CmdletBinding()]
param(
    [int]$Port = 3000,
    [switch]$Prod,
    [switch]$Open
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\..\lib\common.ps1"

$root = Get-RepoRoot
Clear-InheritedElectronEnv

if (Test-PortOpen -Port $Port) {
    Write-Warn "Port $Port is already in use. Something is probably already running there."
    Write-Note "Use -Port to pick another, or stop the existing process first."
    exit 1
}

if ($Open) {
    # Poll from a detached shell so the server itself stays in the foreground.
    $psExe = if (Get-Command pwsh -ErrorAction SilentlyContinue) { 'pwsh' } else { 'powershell' }
    $poll = @"
`$deadline = (Get-Date).AddSeconds(120)
while ((Get-Date) -lt `$deadline) {
    `$c = [System.Net.Sockets.TcpClient]::new()
    try { if (`$c.ConnectAsync('127.0.0.1', $Port).Wait(400) -and `$c.Connected) { Start-Process 'http://localhost:$Port'; break } } catch { }
    finally { `$c.Dispose() }
    Start-Sleep -Milliseconds 400
}
"@
    Start-Process -FilePath $psExe -ArgumentList '-NoProfile', '-Command', $poll -WindowStyle Hidden | Out-Null
}

Push-Location $root
try {
    if ($Prod) {
        Write-Step 'Building the static export'
        Invoke-Pnpm --filter '@cmdgen/web' build

        Write-Step "Serving apps/web/out on http://localhost:$Port"
        Write-Note 'This is the identical bundle the desktop shell loads over app://.'
        Write-Note 'Press Ctrl+C to stop.'
        # npx is used rather than a tracked dependency: serving the export is a
        # convenience for eyeballing the build, not part of the product.
        & npx --yes serve@14 "apps/web/out" --listen $Port --single
    }
    else {
        Write-Step "Starting the Next dev server on http://localhost:$Port"
        Write-Note 'Press Ctrl+C to stop.'
        # Next reads PORT from the environment. Passing it as an argument would
        # mean threading `--` through pnpm, and PowerShell strips a bare `--`.
        $env:PORT = "$Port"
        Invoke-Pnpm --filter '@cmdgen/web' dev
    }
}
finally {
    Pop-Location
}
