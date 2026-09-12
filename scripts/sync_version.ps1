<#
.SYNOPSIS
Syncs package.json versions with the root version file.

.DESCRIPTION
The root version file is the source of truth. This script updates the version
field in package.json, apps/web/package.json, and apps/desktop/package.json.
Pass -Version to update the root version file first, then sync the manifests.

.EXAMPLE
.\scripts\sync_version.ps1

.EXAMPLE
.\scripts\sync_version.ps1 -Version 0.1.18
#>
[CmdletBinding()]
param(
    [string]$Version
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\lib\common.ps1"

$root = Get-RepoRoot

if ($Version) {
    $Version = $Version.Trim()
    if (-not $Version) { throw 'Version cannot be blank.' }
    [System.IO.File]::WriteAllText((Join-Path $root 'version'), "$Version`n", (New-Object System.Text.UTF8Encoding($false)))
}

$synced = Sync-PackageJsonVersions -RepoRoot $root
Write-Host "Version synced: $synced" -ForegroundColor Green
