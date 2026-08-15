<#
.SYNOPSIS
Generates the application icon set.

.DESCRIPTION
Writes resources/icon.png (512px, used by macOS and Linux and by the window when
running unpackaged) and resources/icon.ico (a multi-size Windows icon, which the
title bar, taskbar, Alt-Tab and the installer all read).

The design is a deliberate placeholder: a dark rounded square with a two-way sync
arrow. Replace both files with real artwork when you have it - nothing in the build
depends on how it looks, only that the files exist. electron-builder needs the .ico
to contain a 256px entry, which this produces.

.EXAMPLE
.\scripts\make_icon.ps1
#>
[CmdletBinding()]
param(
    [string]$OutDir
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\..\lib\common.ps1"

Add-Type -AssemblyName System.Drawing

$root = Get-RepoRoot
if (-not $OutDir) { $OutDir = Join-Path $root 'apps\desktop\resources' }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# Matches the app's dark background (#0f172a) so the icon and window agree.
$bg     = [System.Drawing.Color]::FromArgb(255, 15, 23, 42)
$accent = [System.Drawing.Color]::FromArgb(255, 96, 165, 250)   # blue-400
$light  = [System.Drawing.Color]::FromArgb(255, 226, 232, 240)  # slate-200

function New-IconBitmap {
    param([int]$Size)

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    # Rounded-square background.
    $pad = [math]::Max(1, [int]($Size * 0.06))
    $r = [math]::Max(2, [int]($Size * 0.22))
    $box = New-Object System.Drawing.Rectangle($pad, $pad, ($Size - 2 * $pad), ($Size - 2 * $pad))
    $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
    $gp.AddArc($box.X, $box.Y, $r, $r, 180, 90)
    $gp.AddArc(($box.Right - $r), $box.Y, $r, $r, 270, 90)
    $gp.AddArc(($box.Right - $r), ($box.Bottom - $r), $r, $r, 0, 90)
    $gp.AddArc($box.X, ($box.Bottom - $r), $r, $r, 90, 90)
    $gp.CloseFigure()
    $brush = New-Object System.Drawing.SolidBrush($bg)
    $g.FillPath($brush, $gp)

    # Two opposing arrows: the universal "sync" mark.
    $stroke = [math]::Max(1.0, $Size * 0.075)
    $x1 = $Size * 0.26
    $x2 = $Size * 0.74
    $yTop = $Size * 0.40
    $yBot = $Size * 0.60
    $head = [math]::Max(2.0, $Size * 0.11)

    $penTop = New-Object System.Drawing.Pen($light, $stroke)
    $penTop.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penTop.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penBot = New-Object System.Drawing.Pen($accent, $stroke)
    $penBot.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penBot.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    # Top arrow points right.
    $g.DrawLine($penTop, [single]$x1, [single]$yTop, [single]$x2, [single]$yTop)
    $g.DrawLine($penTop, [single]($x2 - $head), [single]($yTop - $head * 0.72), [single]$x2, [single]$yTop)
    $g.DrawLine($penTop, [single]($x2 - $head), [single]($yTop + $head * 0.72), [single]$x2, [single]$yTop)

    # Bottom arrow points left.
    $g.DrawLine($penBot, [single]$x1, [single]$yBot, [single]$x2, [single]$yBot)
    $g.DrawLine($penBot, [single]($x1 + $head), [single]($yBot - $head * 0.72), [single]$x1, [single]$yBot)
    $g.DrawLine($penBot, [single]($x1 + $head), [single]($yBot + $head * 0.72), [single]$x1, [single]$yBot)

    $penTop.Dispose(); $penBot.Dispose(); $brush.Dispose(); $gp.Dispose(); $g.Dispose()
    return $bmp
}

Write-Step 'Rendering icon.png (512px)'
$png = Join-Path $OutDir 'icon.png'
$big = New-IconBitmap -Size 512
$big.Save($png, [System.Drawing.Imaging.ImageFormat]::Png)
$big.Dispose()
Write-Note $png

Write-Step 'Rendering icon.ico (multi-size)'
# Each entry is stored as a PNG. Windows Vista and later read PNG-compressed ICO
# entries, and it keeps the 256px entry electron-builder requires small.
$sizes = @(16, 24, 32, 48, 64, 128, 256)
$blobs = @()
foreach ($s in $sizes) {
    $bmp = New-IconBitmap -Size $s
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $blobs += , @{ Size = $s; Bytes = $ms.ToArray() }
    $ms.Dispose(); $bmp.Dispose()
}

$ico = Join-Path $OutDir 'icon.ico'
$fs = [System.IO.File]::Create($ico)
$bw = New-Object System.IO.BinaryWriter($fs)
try {
    $bw.Write([uint16]0)                # reserved
    $bw.Write([uint16]1)                # type: icon
    $bw.Write([uint16]$blobs.Count)

    # Directory entries come first, so image data starts after all of them.
    $offset = 6 + (16 * $blobs.Count)
    foreach ($b in $blobs) {
        # 256 is encoded as 0 in a single byte.
        $dim = if ($b.Size -ge 256) { 0 } else { $b.Size }
        $bw.Write([byte]$dim)           # width
        $bw.Write([byte]$dim)           # height
        $bw.Write([byte]0)              # palette count
        $bw.Write([byte]0)              # reserved
        $bw.Write([uint16]1)            # colour planes
        $bw.Write([uint16]32)           # bits per pixel
        $bw.Write([uint32]$b.Bytes.Length)
        $bw.Write([uint32]$offset)
        $offset += $b.Bytes.Length
    }
    foreach ($b in $blobs) { $bw.Write($b.Bytes) }
}
finally {
    $bw.Dispose(); $fs.Dispose()
}
Write-Note "$ico ($($sizes -join ', ') px)"

Write-Host ''
Write-Host 'Icon set written' -ForegroundColor Green
foreach ($f in @($png, $ico)) {
    Write-Host ('  {0,-30} {1,7} KB' -f (Split-Path $f -Leaf), [math]::Round((Get-Item $f).Length / 1KB, 1))
}
Write-Host ''
Write-Note 'Placeholder artwork - replace both files with your own when ready.'
