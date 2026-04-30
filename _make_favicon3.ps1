Add-Type -AssemblyName System.Drawing

# Источник — загруженный файл (скопируем его сначала)
$srcPath = 'F:\Amber_solutions_Kira\bm_site\_cat_src.png'
$outDir  = 'F:\Amber_solutions_Kira\bm_site'

$orig = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source size: $($orig.Width) x $($orig.Height)"

# Убираем чёрный фон — делаем прозрачным всё тёмное
$rgba = [System.Drawing.Bitmap]::new($orig.Width, $orig.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $orig.Height; $y++) {
    for ($x = 0; $x -lt $orig.Width; $x++) {
        $px = $orig.GetPixel($x, $y)
        # Яркость пикселя
        $brightness = ($px.R + $px.G + $px.B) / 3
        if ($brightness -lt 50) {
            # Чёрный/тёмный фон — прозрачный
            $rgba.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            $rgba.SetPixel($x, $y, $px)
        }
    }
}

# Функция resize с сохранением пропорций и центрированием
function SaveSquare($src, $size, $path) {
    $bmp = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $ratio = [Math]::Min($size / $src.Width, $size / $src.Height)
    $w  = [int]($src.Width  * $ratio)
    $h  = [int]($src.Height * $ratio)
    $dx = [int](($size - $w) / 2)
    $dy = [int](($size - $h) / 2)
    $g.DrawImage($src, $dx, $dy, $w, $h)
    $g.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved ${size}x${size}: $path"
}

SaveSquare $rgba 32  "$outDir\favicon-32.png"
SaveSquare $rgba 192 "$outDir\favicon-192.png"

# ICO из 32x32
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

$orig.Dispose(); $rgba.Dispose()
Write-Host "DONE"
