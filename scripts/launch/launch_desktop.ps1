<#
.SYNOPSIS
Runs the Electron desktop app.

.DESCRIPTION
In dev mode Electron loads the Next dev server, so that server has to be running
first. This script starts it if nothing is already listening, waits for the port
to accept connections, then launches Electron with tsup watching the main and
preload bundles. Anything it started is shut down on exit.

With -Prod it builds the static export, bundles the main process, and runs the
real packaged app - Electron serving the bundle over its own app:// protocol,
exactly as an installed copy behaves.

.PARAMETER Port
Port the dev server listens on. Default 3000.

.PARAMETER Prod
Build and run the production bundle instead of the dev server.

.PARAMETER NoWeb
Do not start the dev server; assume one is already running.

.PARAMETER Smoke
Run the headless smoke check instead of opening a window. Verifies the bundle
loads over app://, React mounted, the preload bridge is present, and no Node
globals leaked. Exits non-zero on failure. Implies -Prod.

.EXAMPLE
.\scripts\launch_desktop.ps1
.EXAMPLE
.\scripts\launch_desktop.ps1 -Prod
.EXAMPLE
.\scripts\launch_desktop.ps1 -Smoke
#>
[CmdletBinding()]
param(
    [int]$Port = 3000,
    [switch]$Prod,
    [switch]$NoWeb,
    [switch]$Smoke
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\..\lib\common.ps1"

$root = Get-RepoRoot
Clear-InheritedElectronEnv

Push-Location $root
try {
    # ---------------------------------------------------------------- production
    if ($Prod -or $Smoke) {
        Write-Step 'Building the web export and the desktop bundle'
        Invoke-Pnpm build

        if ($Smoke) {
            Write-Step 'Running the headless smoke check'
            Invoke-Pnpm --filter '@cmdgen/desktop' smoke
            Write-Host 'Smoke check passed.' -ForegroundColor Green
        }
        else {
            Write-Step 'Launching the production app'
            Write-Note 'Renderer is served over app://bundle, as in an installed copy.'
            Invoke-Pnpm --filter '@cmdgen/desktop' start
        }
        return
    }

    # --------------------------------------------------------------------- dev
    $webProcess = $null
    try {
        if (Test-PortOpen -Port $Port) {
            Write-Step "Reusing the dev server already listening on port $Port"
        }
        elseif ($NoWeb) {
            throw "Nothing is listening on port $Port and -NoWeb was given. Start the web server first, or drop -NoWeb."
        }
        else {
            Write-Step "Starting the Next dev server on port $Port"
            Write-Note 'Opens in a separate window so its output stays readable.'
            $webProcess = Start-PnpmWindow `
                -Arguments @('--filter', '@cmdgen/web', 'dev') `
                -WorkingDirectory $root `
                -Title "OpenCmdGenerator web :$Port" `
                -EnvVars @{ PORT = $Port }

            Write-Step "Waiting for port $Port"
            # Electron must not load the dev URL before Next is listening: it would
            # render a connection error and never retry.
            Wait-ForPort -Port $Port -TimeoutSeconds 180 | Out-Null
            Write-Note 'Dev server is up.'
        }

        # Only defaulted inside run-electron.mjs, so setting it here wins.
        $env:CMD_GENERATOR_DEV_URL = "http://localhost:$Port"

        Write-Step "Launching Electron against $env:CMD_GENERATOR_DEV_URL"
        Write-Note 'tsup watches main and preload; edit either and Electron restarts.'
        Write-Note 'Press Ctrl+C to stop.'
        Invoke-Pnpm --filter '@cmdgen/desktop' dev
    }
    finally {
        if ($webProcess) {
            Write-Step 'Stopping the dev server this script started'
            # cmd -> pnpm -> node, so the whole tree has to go or the port stays held.
            Stop-ProcessTree -ProcessId $webProcess.Id
        }
    }
}
finally {
    Pop-Location
}
