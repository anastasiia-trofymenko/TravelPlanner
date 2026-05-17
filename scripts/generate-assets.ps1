Add-Type -AssemblyName System.Drawing
$root = Join-Path $PSScriptRoot '..' | Resolve-Path
$assets = Join-Path $root 'assets'
if (-not (Test-Path $assets)) { New-Item -ItemType Directory -Path $assets | Out-Null }

function New-GradientPng {
    param([string]$Path, [int]$Width, [int]$Height, [string]$ColorA = '#FF6B6B', [string]$ColorB = '#FF3D7F', [string]$Letter = 'A')
    $bmp = New-Object System.Drawing.Bitmap $Width, $Height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $a = [System.Drawing.ColorTranslator]::FromHtml($ColorA)
    $b = [System.Drawing.ColorTranslator]::FromHtml($ColorB)
    $rect = New-Object System.Drawing.Rectangle 0, 0, $Width, $Height
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $a, $b, 45
    $g.FillRectangle($brush, $rect)

    if ($Letter) {
        $fontSize = [int]($Height * 0.5)
        $font = New-Object System.Drawing.Font 'Segoe UI', $fontSize, ([System.Drawing.FontStyle]::Bold)
        $textBrush = [System.Drawing.Brushes]::White
        $size = $g.MeasureString($Letter, $font)
        $x = ($Width - $size.Width) / 2
        $y = ($Height - $size.Height) / 2
        $g.DrawString($Letter, $font, $textBrush, $x, $y)
        $font.Dispose()
    }

    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

New-GradientPng -Path (Join-Path $assets 'icon.png') -Width 1024 -Height 1024 -Letter 'A'
New-GradientPng -Path (Join-Path $assets 'adaptive-icon.png') -Width 1024 -Height 1024 -Letter 'A'
New-GradientPng -Path (Join-Path $assets 'splash.png') -Width 1242 -Height 2436 -Letter 'Arturio'
New-GradientPng -Path (Join-Path $assets 'favicon.png') -Width 96 -Height 96 -Letter 'A'

Write-Host 'Generated icon assets in' $assets
