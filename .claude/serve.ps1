# Minimal static file server for this site (no Node/Python required).
# Serves the current working directory. Usage: powershell -NoProfile -File .claude/serve.ps1 [-Port 8347]
param([int]$Port = 8347)

$root = (Get-Location).Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Output "Serving $root on http://localhost:$Port/"

$mime = @{
    '.html'='text/html; charset=utf-8'; '.css'='text/css'; '.js'='application/javascript'
    '.svg'='image/svg+xml'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png'
    '.gif'='image/gif'; '.webp'='image/webp'; '.pdf'='application/pdf'; '.xml'='application/xml'
    '.txt'='text/plain'; '.ico'='image/x-icon'; '.json'='application/json'; '.woff2'='font/woff2'
}

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
        if ($path.EndsWith('/')) { $path = $path + 'index.html' }
        $file = Join-Path $root ($path.TrimStart('/') -replace '/', '\')
        $fullRoot = [System.IO.Path]::GetFullPath($root)
        $fullFile = [System.IO.Path]::GetFullPath($file)
        if ($fullFile.StartsWith($fullRoot) -and (Test-Path $fullFile -PathType Leaf)) {
            $bytes = [System.IO.File]::ReadAllBytes($fullFile)
            $ext = [System.IO.Path]::GetExtension($fullFile).ToLower()
            if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] } else { $ctx.Response.ContentType = 'application/octet-stream' }
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $ctx.Response.StatusCode = 404
            $body = Join-Path $root '404.html'
            if (Test-Path $body -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($body)
                $ctx.Response.ContentType = 'text/html; charset=utf-8'
                $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        }
        $ctx.Response.Close()
    } catch { }
}
