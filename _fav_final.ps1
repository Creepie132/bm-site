Add-Type -AssemblyName System.Drawing

# Скачиваем изображение кошки из загруженного файла
# Пользователь прислал изображение - используем его из uploads
$srcUrl = "https://claude.ai"  # placeholder

# Вместо этого - берём из Logo_Bm_Trans.png который уже есть
# но делаем иначе: качественный ресайз всего логотипа
$srcPath = 'F:\Amber_solutions_Kira\bm_site\media\logo\Logo_Bm_Trans.png'
$outDir  = 'F:\Amber_solutions_Kira\bm_site'

$orig = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source: $($orig.Width) x $($orig.Height)"

function MakeSquare($src, $size, $path) {
    $bmp = [System.Drawing.Bitmap]::new($size, $size)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    # Заполняем чёрным фоном
    $g.Clear([System.Drawing.Color]::Black)
    # Рисуем изображение вписанным по центру
    $ratio = [Math]::Min($size / $src.Width, $size / $src.Height)
    $w  = [int]($src.Width  * $ratio)
    $h  = [int]($src.Height * $ratio)
    $dx = [int](($size - $w) / 2)
    $dy = [int](($size - $h) / 2)
    $g.DrawImage($src, $dx, $dy, $w, $h)
    $g.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved: $path"
}

MakeSquare $orig 32  "$outDir\favicon-32.png"
MakeSquare $orig 192 "$outDir\favicon-192.png"

# ICO
$ms = [System.IO.MemoryStream]::new()
$b  = [System.Drawing.Bitmap]::FromFile("$outDir\favicon-32.png")
$b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$b.Dispose()
$png = $ms.ToArray(); $ms.Dispose()
$sz  = $png.Length; $off = 22
$hdr = [byte[]](0,0,1,0,1,0)
$ent = [byte[]](32,32,0,0,1,0,32,0,($sz -band 255),(($sz -shr 8) -band 255),(($sz -shr 16) -band 255),(($sz -shr 24) -band 255),($off -band 255),(($off -shr 8) -band 255),(($off -shr 16) -band 255),(($off -shr 24) -band 255))
[System.IO.File]::WriteAllBytes("$outDir\favicon.ico", ($hdr + $ent + $png))
Write-Host "Saved: favicon.ico"
$orig.Dispose()
Write-Host "DONE"
