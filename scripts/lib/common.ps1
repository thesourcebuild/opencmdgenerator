# Shared helpers for the build_*, launch_* and package_* scripts.
# Dot-source it:  . "$PSScriptRoot\..\lib\common.ps1"
#
# Everything here must parse under PowerShell 5.1: the .bat wrappers prefer pwsh
# but fall back to the built-in powershell.exe, so PS7-only syntax (?? ternaries,
# null-coalescing) is out.
#
# ASCII ONLY. These files have no BOM, so PowerShell 5.1 decodes them as cp1252.
# An em-dash then becomes three characters ending in 0x94, which maps to U+201D -
# and PowerShell accepts that as a double-quote delimiter. One em-dash inside a
# double-quoted string silently terminates it and the whole file fails to parse,
# only on 5.1. Run scripts\check_scripts.ps1 after editing.

#Requires -Version 5.1

Set-StrictMode -Version Latest

function Get-RepoRoot {
    # This file lives at scripts\lib\common.ps1, two levels below the repo root.
    Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
}

function Write-Step {
    param([Parameter(Mandatory)][string]$Message)
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Note {
    param([Parameter(Mandatory)][string]$Message)
    Write-Host "    $Message" -ForegroundColor DarkGray
}

function Write-Warn {
    param([Parameter(Mandatory)][string]$Message)
    Write-Host "!!  $Message" -ForegroundColor Yellow
}

<#
.SYNOPSIS
Strips environment variables that VS Code leaks into its integrated terminal.

.DESCRIPTION
The extension host exports ELECTRON_RUN_AS_NODE=1. Any Electron process that
inherits it runs as plain Node instead: require("electron") returns a stub, so
`protocol` and `BrowserWindow` are undefined and the app dies with
"Cannot read properties of undefined (reading 'registerSchemesAsPrivileged')".

apps/desktop/scripts/run-electron.mjs scrubs this too. Doing it here as well means
the whole process tree is clean, including anything a package script spawns.
#>
function Clear-InheritedElectronEnv {
    $leaked = @(
        'ELECTRON_RUN_AS_NODE'
        'VSCODE_ESM_ENTRYPOINT'
        'VSCODE_IPC_HOOK'
        'VSCODE_CODE_CACHE_PATH'
        'VSCODE_HANDLES_UNCAUGHT_ERRORS'
        'VSCODE_CRASH_REPORTER_PROCESS_TYPE'
    )
    $removed = @()
    foreach ($name in $leaked) {
        if (Test-Path "Env:$name") {
            Remove-Item "Env:$name" -ErrorAction SilentlyContinue
            $removed += $name
        }
    }
    if ($removed.Count -gt 0) {
        Write-Note "Cleared inherited: $($removed -join ', ')"
    }
}

<#
.SYNOPSIS
Locates pnpm, falling back to corepack, and fails with instructions if absent.
#>
function Resolve-PackageManager {
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        return [pscustomobject]@{ Name = 'pnpm'; Prefix = @() }
    }
    if (Get-Command corepack -ErrorAction SilentlyContinue) {
        Write-Note 'pnpm not on PATH; using "corepack pnpm".'
        return [pscustomobject]@{ Name = 'corepack'; Prefix = @('pnpm') }
    }
    throw @'
pnpm was not found.

Install it with:
    npm install -g pnpm@11

pnpm 11 requires Node >= 22.13; this project pins it via the
"packageManager" field in package.json.
'@
}

<#
.SYNOPSIS
Runs pnpm in the foreground and throws if it exits non-zero.
#>
function Invoke-Pnpm {
    param([Parameter(Mandatory, ValueFromRemainingArguments)][string[]]$Arguments)

    $pm = Resolve-PackageManager
    $all = @($pm.Prefix) + $Arguments
    Write-Note "$($pm.Name) $($all -join ' ')"

    & $pm.Name @all
    if ($LASTEXITCODE -ne 0) {
        throw "$($pm.Name) $($all -join ' ') failed with exit code $LASTEXITCODE."
    }
}

function Test-PortOpen {
    param(
        [Parameter(Mandatory)][int]$Port,
        [string]$Address = '127.0.0.1',
        [int]$TimeoutMs = 400
    )

    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $connect = $client.ConnectAsync($Address, $Port)
        if ($connect.Wait($TimeoutMs)) { return $client.Connected }
        return $false
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

<#
.SYNOPSIS
Blocks until a TCP port accepts connections.

.DESCRIPTION
Electron must not load its dev URL before Next is listening, or it renders a
connection error and never retries. This is the guard for that race.
#>
function Wait-ForPort {
    param(
        [Parameter(Mandatory)][int]$Port,
        [int]$TimeoutSeconds = 120,
        [string]$Address = '127.0.0.1'
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-PortOpen -Port $Port -Address $Address) { return $true }
        Start-Sleep -Milliseconds 400
    }
    throw "Nothing was listening on ${Address}:${Port} after $TimeoutSeconds seconds."
}

<#
.SYNOPSIS
Kills a process and everything it spawned.

.DESCRIPTION
Stop-Process only kills the named process. The dev server is cmd -> pnpm -> node,
so the node process would survive and keep holding the port. taskkill /T handles
the whole tree.
#>
function Stop-ProcessTree {
    param([Parameter(Mandatory)][int]$ProcessId)

    if (-not (Get-Process -Id $ProcessId -ErrorAction SilentlyContinue)) { return }
    & taskkill.exe /PID $ProcessId /T /F 2>&1 | Out-Null
}

<#
.SYNOPSIS
Fails early if the workspace has not been installed.
#>
function Assert-Dependencies {
    param([Parameter(Mandatory)][string]$RepoRoot)

    if (Test-Path (Join-Path $RepoRoot 'node_modules')) { return }
    throw "node_modules is missing. Run `pnpm install` first."
}

<#
.SYNOPSIS
Deletes build output so the next build cannot reuse anything stale.

.DESCRIPTION
Turborepo will restore removed outputs straight back out of its cache, so callers
that clean must also bypass the cache - every build script here pairs -Clean with
turbo's --force for that reason.
#>
function Remove-BuildOutput {
    param(
        [Parameter(Mandatory)][string]$RepoRoot,
        [switch]$IncludeRelease
    )

    $targets = @(
        'apps\web\out'
        'apps\web\.next'
        'apps\desktop\dist'
        'apps\desktop\renderer'
        '.turbo'
        'apps\web\.turbo'
        'apps\desktop\.turbo'
    )
    if ($IncludeRelease) { $targets += 'apps\desktop\release' }

    foreach ($relative in $targets) {
        $path = Join-Path $RepoRoot $relative
        if (-not (Test-Path $path)) { continue }
        Write-Note "removing $relative"
        Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
        if (Test-Path $path) {
            # Real-time antivirus can hold a lock on freshly extracted Electron
            # binaries; that is a warning, not a reason to abandon the build.
            Write-Warn "could not fully remove $relative (something is holding a file open)"
        }
    }
}

function Get-PathSize {
    param([Parameter(Mandatory)][string]$Path)

    if (-not (Test-Path $Path)) { return $null }
    $item = Get-Item -LiteralPath $Path
    if (-not $item.PSIsContainer) {
        return [pscustomobject]@{ Files = 1; Bytes = $item.Length }
    }
    $files = Get-ChildItem -LiteralPath $Path -Recurse -File -ErrorAction SilentlyContinue
    # Measure-Object returns a null Sum for an empty set. Written out longhand
    # rather than with ?? so this still parses under PowerShell 5.1, which the
    # .bat wrappers fall back to when pwsh is absent.
    $sum = ($files | Measure-Object -Property Length -Sum).Sum
    if ($null -eq $sum) { $sum = 0 }
    return [pscustomobject]@{
        Files = ($files | Measure-Object).Count
        Bytes = $sum
    }
}

<#
.SYNOPSIS
Reports what a build actually produced, and where.

.DESCRIPTION
A build that prints only "success" leaves you guessing which directory to deploy
or which installer to hand over. This names the artifacts and their sizes.
#>
function Show-Artifacts {
    param(
        [Parameter(Mandatory)][string]$RepoRoot,
        [Parameter(Mandatory)][string[]]$Paths
    )

    Write-Host ''
    Write-Host 'Artifacts' -ForegroundColor Green

    foreach ($path in $Paths) {
        # Callers pass repo-relative paths, but -ReleaseDir is an absolute path the
        # user chose. Join-Path would splice that onto the repo root and produce
        # nonsense, so rooted paths are taken as given.
        $full = if ([System.IO.Path]::IsPathRooted($path)) { $path } else { Join-Path $RepoRoot $path }

        $size = Get-PathSize -Path $full
        if (-not $size) {
            Write-Host ("  {0,-34} (not produced)" -f $path) -ForegroundColor DarkGray
            continue
        }
        $mb = [math]::Round($size.Bytes / 1MB, 1)
        $label = if ($size.Files -eq 1) { '1 file' } else { "$($size.Files) files" }
        Write-Host ("  {0,-34} {1,8} MB  {2}" -f $path, $mb, $label)
    }
    Write-Host ''
}

<#
.SYNOPSIS
Lists the distributable installers a packaging run produced.

.DESCRIPTION
The release directory also holds win-unpacked and build intermediates, so its total
size says nothing useful - it is mostly the unpacked Electron runtime. This names
the files you would actually hand to someone.
#>
function Show-Installers {
    param([Parameter(Mandatory)][string]$ReleaseDir)

    if (-not (Test-Path $ReleaseDir)) {
        Write-Warn "Release directory not found: $ReleaseDir"
        return
    }

    $wanted = @('.exe', '.dmg', '.zip', '.appimage', '.deb', '.msi')
    $installers = Get-ChildItem -LiteralPath $ReleaseDir -File -ErrorAction SilentlyContinue |
        Where-Object { $wanted -contains $_.Extension.ToLower() } |
        Where-Object { $_.Name -notlike '*__uninstaller*' } |
        Sort-Object Name

    Write-Host 'Installers' -ForegroundColor Green
    if (-not $installers) {
        Write-Host '  (none found)' -ForegroundColor DarkGray
        Write-Host ''
        return
    }
    foreach ($file in $installers) {
        Write-Host ("  {0,-46} {1,8} MB" -f $file.Name, [math]::Round($file.Length / 1MB, 1))
    }
    Write-Host "  in $ReleaseDir" -ForegroundColor DarkGray
    Write-Host ''
}

<#
.SYNOPSIS
Builds a source archive of the project.

.DESCRIPTION
Prefers `git archive`, because "the files git tracks" is the cleanest possible
definition of source and needs no exclusion list to maintain. Falls back to a
filtered copy when this is not a git repository yet, pruning build output and
dependencies - an archive carrying node_modules would be hundreds of megabytes and
would defeat the point.

Returns a short description of which method was used.
#>
function New-SourceArchive {
    param(
        [Parameter(Mandatory)][string]$RepoRoot,
        [Parameter(Mandatory)][string]$ZipPath
    )

    New-Item -ItemType Directory -Force -Path (Split-Path $ZipPath -Parent) | Out-Null
    if (Test-Path $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }

    if (Get-Command git -ErrorAction SilentlyContinue) {
        # Native stderr becomes a terminating error under $ErrorActionPreference='Stop'
        # (set by the callers) even when redirected, which would abort the whole
        # packaging run before the fallback below could run. Probe with Continue.
        $savedEAP = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        try {
            & git -C $RepoRoot rev-parse --verify HEAD *> $null
        }
        finally {
            $ErrorActionPreference = $savedEAP
        }
        if ($LASTEXITCODE -eq 0) {
            & git -C $RepoRoot archive --format=zip --output $ZipPath HEAD
            if ($LASTEXITCODE -eq 0 -and (Test-Path $ZipPath)) {
                return 'git archive - tracked files at HEAD'
            }
            Write-Warn 'git archive failed; falling back to a filtered copy.'
        }
        else {
            Write-Note 'not a git repository with a commit; using a filtered copy'
        }
    }

    # Directory names pruned wholesale. Pruning as we walk matters: recursing into
    # node_modules first and filtering afterwards would enumerate tens of thousands
    # of files for nothing.
    $prune = @('node_modules', 'dist', 'out', '.next', 'renderer', 'release', '.turbo', '.git', 'graphify-out')
    $staging = Join-Path ([System.IO.Path]::GetTempPath()) "OpenCmdGenerator-source-$([guid]::NewGuid().ToString('N').Substring(0,8))"
    New-Item -ItemType Directory -Force -Path $staging | Out-Null

    try {
        $rootPrefix = $RepoRoot.TrimEnd('\') + '\'
        $queue = [System.Collections.Generic.Queue[string]]::new()
        $queue.Enqueue($RepoRoot)
        $count = 0

        while ($queue.Count -gt 0) {
            $dir = $queue.Dequeue()
            foreach ($item in Get-ChildItem -LiteralPath $dir -Force -ErrorAction SilentlyContinue) {
                if ($item.PSIsContainer) {
                    if ($prune -contains $item.Name) { continue }
                    $queue.Enqueue($item.FullName)
                    continue
                }
                if ($item.Extension -eq '.tsbuildinfo') { continue }

                $relative = $item.FullName.Substring($rootPrefix.Length)
                $destination = Join-Path $staging $relative
                New-Item -ItemType Directory -Force -Path (Split-Path $destination -Parent) | Out-Null
                Copy-Item -LiteralPath $item.FullName -Destination $destination -Force
                $count++
            }
        }

        Compress-DirectoryContents -SourceDir $staging -ZipPath $ZipPath
        return "filtered copy - $count files, no build output or dependencies"
    }
    finally {
        Remove-Item -LiteralPath $staging -Recurse -Force -ErrorAction SilentlyContinue
    }
}

function Get-ProjectVersion {
    param([Parameter(Mandatory)][string]$RepoRoot)

    # The root `version` file is the single source of truth for the project
    # version. Everything that needs it reads this one file: packaging scripts,
    # electron-builder (via extraMetadata), and the web build (NEXT_PUBLIC_APP_VERSION).
    $versionFile = Join-Path $RepoRoot 'version'
    if (-not (Test-Path -LiteralPath $versionFile)) {
        throw "No version file at $versionFile. That file is the project version."
    }
    $version = (Get-Content -Raw -LiteralPath $versionFile).Trim()
    if (-not $version) { throw "The version file at $versionFile is empty." }
    return $version
}

<#
.SYNOPSIS
Rewrites the `version` field in package.json files to match the root `version` file.

.DESCRIPTION
The `version` file is the single source of truth. pnpm and electron-builder still
read package.json versions in some paths (dev-mode app.getVersion, workspace
metadata), so before packaging the package.json files that carry a version are
brought in line. Only the files with a version field are touched, and only when
they differ, so a clean tree stays clean.
#>
function Sync-PackageJsonVersions {
    param(
        [Parameter(Mandatory)][string]$RepoRoot,
        [string]$VersionOverride
    )

    $version = if ($VersionOverride) { $VersionOverride } else { Get-ProjectVersion -RepoRoot $RepoRoot }
    $targets = @(
        (Join-Path $RepoRoot 'package.json'),
        (Join-Path $RepoRoot 'apps\desktop\package.json'),
        (Join-Path $RepoRoot 'apps\web\package.json')
    )
    foreach ($target in $targets) {
        if (-not (Test-Path -LiteralPath $target)) { continue }
        $raw = Get-Content -Raw -LiteralPath $target
        $pattern = '("version"\s*:\s*")[^"]*(")'
        if ($raw -notmatch $pattern) { continue }
        $updated = [regex]::Replace($raw, $pattern, "`${1}$version`${2}", 1)
        if ($updated -ne $raw) {
            [System.IO.File]::WriteAllText($target, $updated, (New-Object System.Text.UTF8Encoding($false)))
            Write-Note "Synced version $version into $target"
        }
    }
    return $version
}

<#
.SYNOPSIS
Zips the CONTENTS of a directory, not the directory itself.

.DESCRIPTION
For a static site this matters: extracting must yield index.html at the top level,
not a nested folder that breaks every relative path.
#>
function Compress-DirectoryContents {
    param(
        [Parameter(Mandatory)][string]$SourceDir,
        [Parameter(Mandatory)][string]$ZipPath
    )

    if (-not (Test-Path $SourceDir)) { throw "Nothing to compress: $SourceDir does not exist." }
    if (Test-Path $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }

    New-Item -ItemType Directory -Force -Path (Split-Path $ZipPath -Parent) | Out-Null
    Compress-Archive -Path (Join-Path $SourceDir '*') -DestinationPath $ZipPath -CompressionLevel Optimal
}

<#
.SYNOPSIS
Writes SHA256SUMS.txt for every file in a directory.

.DESCRIPTION
Written in `sha256sum` format - lowercase hash, two spaces, bare filename - so a
recipient can verify with `sha256sum -c SHA256SUMS.txt` on Linux, macOS or WSL.

This is not decoration. The Windows installer is not code-signed, so a checksum is
the only way someone can confirm they received what you built.
#>
function New-ChecksumFile {
    param(
        [Parameter(Mandatory)][string]$Directory,
        [string]$FileName = 'SHA256SUMS.txt'
    )

    $target = Join-Path $Directory $FileName
    if (Test-Path $target) { Remove-Item -LiteralPath $target -Force }

    $files = Get-ChildItem -LiteralPath $Directory -File | Sort-Object Name
    if (-not $files) { Write-Warn "No files to checksum in $Directory"; return $null }

    $lines = foreach ($f in $files) {
        $hash = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256).Hash.ToLower()
        "$hash  $($f.Name)"
    }
    Set-Content -LiteralPath $target -Value $lines -Encoding ascii
    return $target
}

<#
.SYNOPSIS
Writes a RELEASE.md describing what is in a release folder.

.DESCRIPTION
Generated from what is actually present rather than a fixed template, so it cannot
claim to include an installer that was not built. It also states plainly that the
installers are unsigned - a recipient hitting a SmartScreen warning with no
explanation will reasonably assume the download is malicious.
#>
function Write-ReleaseNotes {
    param(
        [Parameter(Mandatory)][string]$ReleaseDir,
        [Parameter(Mandatory)][string]$Version,
        [Parameter(Mandatory)][string]$RepoRoot,
        # Passed rather than probed: RELEASE.md is written before SHA256SUMS.txt so
        # that the checksum file covers it, which means it cannot detect the file.
        [switch]$WithChecksums
    )

    $files = Get-ChildItem -LiteralPath $ReleaseDir -File | Sort-Object Name
    $webZip = $files | Where-Object { $_.Name -like 'OpenCmdGenerator-web-*.zip' }
    $sourceZip = $files | Where-Object { $_.Name -like '*-source.zip' }
    $installers = $files | Where-Object { $_.Extension -eq '.exe' }

    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("# OpenCmdGenerator $Version")
    $lines.Add('')
    $lines.Add('Builds, validates and explains shell commands - `rsync`, `curl`, `ssh`,')
    $lines.Add('`openssl`, and dozens more - for web and desktop.')
    $lines.Add('')
    $lines.Add('**It generates commands. It never runs them.** Nothing here executes a shell')
    $lines.Add('command, spawns a process, or talks to a network. You copy the command out')
    $lines.Add('and run it yourself, so you can read it before anything touches your files.')
    $lines.Add('(The desktop app has one deliberate, confirmation-gated exception: a Run')
    $lines.Add('button can open a real shell and type the command into it, on Windows and')
    $lines.Add('Linux only - never auto-executed, never in the browser build. See the repo''s')
    $lines.Add('README for the full design rationale.)')
    $lines.Add('')
    $lines.Add('## Contents')
    $lines.Add('')

    if ($webZip) {
        $lines.Add("### $($webZip.Name)")
        $lines.Add('')
        $lines.Add('The web app as a static site. Extract it into any web root, or upload it to')
        $lines.Add('any static host. `index.html` is at the top level of the archive. There is no')
        $lines.Add('server component and no build step for the recipient.')
        $lines.Add('')
        $lines.Add('Do not double-click `index.html` - the browser resolves its asset paths against')
        $lines.Add('the local filesystem root under `file://`, so the page loads unstyled with no')
        $lines.Add('working buttons. Instead, run the included launcher, which starts a local server')
        $lines.Add('and opens the app in your browser: `start.bat` on Windows, `start.sh` on Linux or')
        $lines.Add('macOS (needs Python on PATH). Or upload the extracted folder to a real static host.')
        $lines.Add('')
    }

    if ($sourceZip) {
        $lines.Add("### $($sourceZip.Name)")
        $lines.Add('')
        $lines.Add('Full source. Build it yourself with:')
        $lines.Add('')
        $lines.Add('```sh')
        $lines.Add('npm install -g pnpm@11   # requires Node >= 22.13')
        $lines.Add('pnpm install')
        $lines.Add('pnpm test && pnpm typecheck && pnpm lint')
        $lines.Add('pnpm build')
        $lines.Add('```')
        $lines.Add('')
        $lines.Add('Requires Node 22.13 or newer and pnpm 11.x (pinned via `packageManager`).')
        $lines.Add('`scripts/` holds Windows launchers and build scripts; `tests/` holds the')
        $lines.Add('suite plus ground-truth verifiers that check generated commands against the')
        $lines.Add('real tools (e.g. `verify:rsync` against an actual rsync).')
        $lines.Add('')
    }

    if ($installers) {
        foreach ($exe in $installers) {
            $arch = if ($exe.Name -match '-(x64|arm64)\.exe$') { $Matches[1] } else { 'unknown arch' }
            $lines.Add("### $($exe.Name)")
            $lines.Add('')
            $lines.Add("Windows installer ($arch). Run it and follow the prompts; it installs per-user,")
            $lines.Add('so it needs no administrator rights.')
            $lines.Add('')
        }
        $lines.Add('> **These installers are not code-signed.** Windows SmartScreen will show a')
        $lines.Add('> warning, and Edge or Chrome may flag the download. That is expected, not a')
        $lines.Add('> sign of tampering. Verify the checksum below before trusting the file.')
        $lines.Add('')
    }

    if ($WithChecksums) {
        $lines.Add('## Verifying')
        $lines.Add('')
        $lines.Add('`SHA256SUMS.txt` lists a SHA-256 hash for every file here.')
        $lines.Add('')
        $lines.Add('Linux, macOS or WSL:')
        $lines.Add('')
        $lines.Add('```sh')
        $lines.Add('sha256sum -c SHA256SUMS.txt')
        $lines.Add('```')
        $lines.Add('')
        $lines.Add('Windows PowerShell:')
        $lines.Add('')
        $lines.Add('```powershell')
        $lines.Add('Get-FileHash .\<filename> -Algorithm SHA256 | Format-List')
        $lines.Add('```')
        $lines.Add('')
        $lines.Add('Compare the result against the matching line. If it differs, do not use the file.')
        $lines.Add('')
    }

    $lines.Add('## Notes')
    $lines.Add('')
    $lines.Add('- The web app and the desktop app are the same static bundle. The desktop build')
    $lines.Add('  adds a Run button (open a shell and type the command in, never auto-run), native')
    $lines.Add('  directory pickers and on-disk profiles; the web build keeps profiles in')
    $lines.Add('  browser storage and cannot read real filesystem paths.')
    $lines.Add('- Commands are per-shell: POSIX (`bash`), cmd.exe and PowerShell each get their')
    $lines.Add('  own quoting and dialect. Where a command has real per-platform syntax, the')
    $lines.Add('  app offers a target selector (e.g. `rsync` on Windows: cwRsync, MSYS2 or WSL,')
    $lines.Add('  with drive letters translated for you).')
    $lines.Add('- Commands that delete data always raise a warning and offer a `--dry-run`')
    $lines.Add('  variant. Run that first.')
    $lines.Add('')

    $target = Join-Path $ReleaseDir 'RELEASE.md'
    Set-Content -LiteralPath $target -Value $lines -Encoding utf8
    return $target
}

<#
.SYNOPSIS
Starts a pnpm command in its own console window and returns the process.
#>
function Start-PnpmWindow {
    param(
        [Parameter(Mandatory)][string[]]$Arguments,
        [Parameter(Mandatory)][string]$WorkingDirectory,
        [string]$Title = 'OpenCmdGenerator',
        [hashtable]$EnvVars = @{}
    )

    $pm = Resolve-PackageManager
    $all = @($pm.Prefix) + $Arguments

    # cmd.exe is the launcher because pnpm resolves to a .cmd/.ps1 shim that
    # Start-Process cannot execute directly, and `title` labels the window.
    $parts = @("title $Title")
    foreach ($key in $EnvVars.Keys) { $parts += "set $key=$($EnvVars[$key])" }
    $parts += "$($pm.Name) $($all -join ' ')"

    return Start-Process -FilePath 'cmd.exe' `
        -ArgumentList '/c', ($parts -join ' && ') `
        -WorkingDirectory $WorkingDirectory `
        -PassThru
}
