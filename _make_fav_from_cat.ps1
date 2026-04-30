Add-Type -AssemblyName System.Drawing

# Источник — вся кошка на чёрном фоне, просто ресайзим
$srcPath = 'F:\Amber_solutions_Kira\bm_site\_cat_src.jpg'
$outDir  = 'F:\Amber_solutions_Kira\bm_site'

if (-not (Test-Path $srcPath)) {
    Write-Host "File not found: $srcPath"
    exit 1
}

$orig = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source: $($orig.Width) x $($orig.Height)"

function SaveSquare($src, $size, $path) {
    $bmp = [System.Drawing.Bitmap]::new($size, $size)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src, 0, 0, $size, $size)
    $g.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved: $path"
}

SaveSquare $orig 32  "$outDir\favicon-32.png"
SaveSquare $orig 192 "$outDir\favicon-192.png"

# ICO
$ms = [System.IO.MemoryStream]::new()
$bmp32 = [System.Drawing.Bitmap]::FromFile("$outDir\favicon-32.png")
$bmp32.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp32.Dispose()
$pngBytes   = $ms.ToArray(); $ms.Dispose()
$dataSize   = $pngBytes.Length
$dataOffset = 22
$iconDir    = [byte[]](0,0,1,0,1,0)
$entry      = [byte[]](
    32,32,0,0,1,0,32,0,
    ($dataSize -band 0xFF),(($dataSize -shr 8) -band 0xFF),(($dataSize -shr 16) -band 0xFF),(($dataSize -shr 24) -band 0xFF),
    ($dataOffset -band 0xFF),(($dataOffset -shr 8) -band 0xFF),(($dataOffset -shr 16) -band 0xFF),(($dataOffset -shr 24) -band 0xFF)
)
[System.IO.File]::WriteAllBytes("$outDir\favicon.ico", ($iconDir + $entry + $pngBytes))
Write-Host "Saved favicon.ico"
$orig.Dispose()
Write-Host "DONE"
