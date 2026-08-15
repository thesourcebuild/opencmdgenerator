<#
.SYNOPSIS
Checks every script under this folder (including subfolders) parses under both
PowerShell versions.

.DESCRIPTION
The .bat wrappers prefer pwsh but fall back to the built-in powershell.exe, so a
script that only parses under PowerShell 7 works here and breaks on a machine
without pwsh installed. Testing under 7 alone cannot catch that.

Two classes of problem this catches:

  * PS7-only syntax - null-coalescing (??), ternaries (?:).
  * Non-ASCII characters. These files carry no BOM, so 5.1 decodes them as cpanel
    cp1252. An em-dash becomes three characters ending in 0x94, which maps to
    U+201D, and PowerShell treats that as a double-quote delimiter - so one
    em-dash inside a double-quoted string terminates it early and the entire file
    fails to parse. Under 7 the same file is perfectly valid UTF-8.

Exits non-zero on any failure, so it can gate a release.

.EXAMPLE
.\scripts\check_scripts.ps1
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$scripts = Get-ChildItem -LiteralPath $PSScriptRoot -Filter '*.ps1' -File -Recurse | Sort-Object Name
$failures = 0

Write-Host '==> ASCII check' -ForegroundColor Cyan
foreach ($file in $scripts) {
    $text = [System.IO.File]::ReadAllText($file.FullName)
    $offenders = [regex]::Matches($text, '[^\x00-\x7F]')
    if ($offenders.Count -eq 0) { continue }

    $failures++
    $sample = ($offenders | ForEach-Object { $_.Value } | Sort-Object -Unique) -join ' '
    Write-Host ("  FAIL  {0} - {1} non-ASCII character(s): {2}" -f $file.Name, $offenders.Count, $sample) -ForegroundColor Red
}
if ($failures -eq 0) { Write-Host '  all files are ASCII' -ForegroundColor Green }

function Test-ParseWith {
    param([string]$Exe, [string]$Label)

    Write-Host "==> parse check ($Label)" -ForegroundColor Cyan
    if (-not (Test-Path $Exe) -and -not (Get-Command $Exe -ErrorAction SilentlyContinue)) {
        Write-Host "  skipped - $Label not available" -ForegroundColor DarkGray
        return 0
    }

    $command = @'
$bad = 0
Get-ChildItem -LiteralPath "SCRIPT_DIR" -Filter *.ps1 -File -Recurse | Sort-Object Name | ForEach-Object {
  $e = $null
  [System.Management.Automation.Language.Parser]::ParseFile($_.FullName, [ref]$null, [ref]$e) | Out-Null
  if ($e) {
    $bad++
    Write-Output ("  FAIL  " + $_.Name)
    $e | Select-Object -First 3 | ForEach-Object { Write-Output ("        " + $_.Message) }
  }
}
if ($bad -eq 0) { Write-Output "  all files parse" }
exit $bad
'@ -replace 'SCRIPT_DIR', $PSScriptRoot

    # Captured rather than left to stream: anything a PowerShell function writes to
    # the pipeline becomes part of its return value, so printing directly would make
    # this return the child's output lines alongside the exit code.
    $output = & $Exe -NoProfile -Command $command
    $code = $LASTEXITCODE
    foreach ($line in $output) { Write-Host $line }
    return $code
}

$failures += Test-ParseWith -Exe "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe" -Label 'Windows PowerShell 5.1'
$failures += Test-ParseWith -Exe 'pwsh' -Label 'PowerShell 7'

Write-Host ''
if ($failures -gt 0) {
    Write-Host "$failures problem(s) found." -ForegroundColor Red
    exit 1
}
Write-Host 'All scripts are ASCII and parse under both PowerShell versions.' -ForegroundColor Green
exit 0
