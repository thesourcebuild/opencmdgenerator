<#
.SYNOPSIS
Builds the Electron desktop app, and optionally packages installers.

.DESCRIPTION
The desktop build is three ordered steps: export the web app, copy that export
into apps/desktop/renderer, then bundle the main and preload processes. The web
export is a genuine prerequisite - Turborepo enforces the order, which is why this
goes through turbo rather than calling the desktop package directly.

.PARAMETER Clean
Delete build output first and bypass the Turborepo cache.

.PARAMETER Smoke
After building, run the headless check that the bundle really loads over app://
with React mounted, the preload bridge present and no Node globals leaked.

.PARAMETER Package
Also build the Windows installer (the setup .exe). Output lands in dist/<version>/
alongside a checksum file, by way of create-package.ps1.

.PARAMETER Arch
Architectures to package. Default x64. Ignored without -Package.

.PARAMETER OutDir
Base output directory for -Package. Default: dist/ at the repo root.

.PARAMETER StagingDir
Where electron-builder works. Default: a folder under TEMP.

.EXAMPLE
.\scripts\build_desktop.ps1
.EXAMPLE
.\scripts\build_desktop.ps1 -Clean -Smoke
.EXAMPLE
.\scripts\build_desktop.ps1 -Package
.EXAMPLE
.\scripts\build_desktop.ps1 -Package -Arch x64,arm64
#>
[CmdletBinding()]
param(
    [switch]$Clean,
    [switch]$Smoke,
    [switch]$Package,
    [ValidateSet('x64', 'arm64')]
    [string[]]$Arch = @('x64'),
    [string]$OutDir,
    [string]$StagingDir
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\..\lib\common.ps1"

$root = Get-RepoRoot
Clear-InheritedElectronEnv
Assert-Dependencies -RepoRoot $root

Push-Location $root
try {
    if ($Clean) {
        Write-Step 'Cleaning previous output'
        Remove-BuildOutput -RepoRoot $root
    }

    Write-Step 'Building the web export, renderer copy and main bundle'
    Write-Note 'Order matters: the renderer copy reads apps/web/out.'
    # The trailing "..." includes @cmdgen/desktop's dependencies, so the web export
    # is built first rather than by luck.
    $turboArgs = @('run', 'build', '--filter=@cmdgen/desktop...')
    if ($Clean) { $turboArgs += '--force' }
    Invoke-Pnpm exec turbo @turboArgs

    Show-Artifacts -RepoRoot $root -Paths @(
        'apps\web\out'
        'apps\desktop\renderer'
        'apps\desktop\dist'
    )

    if ($Smoke) {
        Write-Step 'Verifying the built app loads'
        Invoke-Pnpm --filter '@cmdgen/desktop' smoke
        Write-Host 'Smoke check passed.' -ForegroundColor Green
    }

    if (-not $Package) {
        Write-Host 'Run with -Package to produce installers.' -ForegroundColor DarkGray
        return
    }

    # ------------------------------------------------------------------ package
    # Delegated to create-package.ps1 rather than duplicated. There was a second
    # electron-builder invocation here, which meant two places to keep in step and,
    # worse, a different default output directory: it wrote into apps/desktop/release,
    # where antivirus tends to lock the extracted Electron binaries and fail the build
    # with "EPERM: rename ... win-unpacked.tmp". create-package stages under TEMP and
    # collects only the installer, so this path just works.
    Write-Step 'Creating the installer'
    Write-Note 'via create-package.ps1 - one packaging path for the whole project.'

    $forward = @{ Binary = $true; NoBuild = $true; Arch = $Arch }
    if ($OutDir) { $forward.OutDir = $OutDir }
    if ($StagingDir) { $forward.StagingDir = $StagingDir }
    & "$PSScriptRoot\..\package\create-package.ps1" @forward
}
finally {
    Pop-Location
}
