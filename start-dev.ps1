param()

function Check-Command($cmd){
	$c = Get-Command $cmd -ErrorAction SilentlyContinue
	return $null -ne $c
}

if (-not (Check-Command node)) {
	Write-Host "ERROR: 'node' no encontrado en PATH. Instala Node.js o añadelo a PATH antes de usar este script." -ForegroundColor Red
	Write-Host "Puedes ejecutar el backend manualmente: npm --prefix backend run start" -ForegroundColor Yellow
	exit 1
}

if (-not (Check-Command npm)) {
	Write-Host "ERROR: 'npm' no encontrado en PATH. Instala Node.js y npm." -ForegroundColor Red
	exit 1
}

Write-Host "Starting backend (npm --prefix backend run start)"
Start-Process powershell -ArgumentList "-NoExit","-Command","Push-Location; Set-Location '$(Resolve-Path backend)'; npm install; npm run start; Pop-Location"
Write-Host "Waiting for backend health endpoint..."
Start-Sleep -Seconds 1
try {
	$resp = Invoke-RestMethod -Uri http://127.0.0.1:8000/api/health -Method Get -TimeoutSec 10 -ErrorAction Stop
	Write-Host "Backend health OK: $($resp | ConvertTo-Json)" -ForegroundColor Green
} catch {
	Write-Host "Warning: Backend health check failed. You can inspect backend/log.txt or run 'npm --prefix backend run start' directly" -ForegroundColor Yellow
}
Write-Host "Starting frontend (npm start)"
Start-Process powershell -ArgumentList "-NoExit","-Command","Push-Location; Set-Location '$(Resolve-Path .)'; npm install; npm start; Pop-Location"
# If using the JSON fallback, run seed (safe to run even if Mongo installed)
Start-Process powershell -ArgumentList "-NoExit","-Command","Push-Location; Set-Location '$(Resolve-Path backend)'; npm run seed; Pop-Location"
