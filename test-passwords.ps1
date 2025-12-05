# 🔐 Script para generar y verificar hashes de contraseñas
# Usar: .\test-passwords.ps1

Write-Host "🔐 GENERADOR DE HASHES PARA TESTING" -ForegroundColor Green
Write-Host "=" * 50

# Contraseñas comunes a probar
$passwords = @("admin", "admin123", "123456", "password")

foreach ($pass in $passwords) {
    Write-Host ""
    Write-Host "📝 Contraseña: '$pass'" -ForegroundColor Cyan
    Write-Host "   MD5:    " -NoNewline; (Get-FileHash -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes($pass))) -Algorithm MD5).Hash.ToLower()
    Write-Host "   SHA1:   " -NoNewline; (Get-FileHash -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes($pass))) -Algorithm SHA1).Hash.ToLower()
    Write-Host "   SHA256: " -NoNewline; (Get-FileHash -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes($pass))) -Algorithm SHA256).Hash.ToLower()
}

Write-Host ""
Write-Host "🎯 PRUEBAS DE LOGIN CON HASHES:" -ForegroundColor Yellow
Write-Host "Si tienes la contraseña hasheada de la BD, compárala con estos valores"
Write-Host ""

# Función para probar login con diferentes formatos
function Test-LoginHash {
    param($email, $passwordHash)
    
    $loginData = @{
        email = $email
        password = $passwordHash
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method POST -ContentType "application/json" -Body $loginData -TimeoutSec 3
        Write-Host "✅ Login exitoso con hash: $passwordHash" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Login falló con hash: $($passwordHash.Substring(0,8))..." -ForegroundColor Red
        return $false
    }
}

Write-Host "🧪 ¿Quieres probar un hash específico? (y/n): " -NoNewline
$response = Read-Host
if ($response -eq "y") {
    Write-Host "Introduce el email: " -NoNewline
    $email = Read-Host
    Write-Host "Introduce el hash desde la BD: " -NoNewline
    $hash = Read-Host
    Test-LoginHash $email $hash
}