# Start Olive & Oak Cafe servers
Write-Host "Starting Olive & Oak Cafe servers..." -ForegroundColor Green

# Kill any existing node processes
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start API server
Write-Host "Starting API server on port 5000..." -ForegroundColor Cyan
$apiProcess = Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "C:\Users\Lyns Romero\Desktop\projects\olive-oak-cafe\server" -PassThru

# Wait for API to start
Start-Sleep -Seconds 3

# Start Vite dev server
Write-Host "Starting Vite dev server on port 5173..." -ForegroundColor Cyan
$viteProcess = Start-Process -NoNewWindow -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "C:\Users\Lyns Romero\Desktop\projects\olive-oak-cafe\client" -PassThru

# Wait for Vite to start
Start-Sleep -Seconds 5

Write-Host "Servers started!" -ForegroundColor Green
Write-Host "API: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Admin: http://localhost:5173/admin/login" -ForegroundColor Yellow
Write-Host "Admin credentials: admin@oliveandoak.cafe / OliveOakAdmin2024!" -ForegroundColor Yellow

# Keep script running
Write-Host "Press Ctrl+C to stop servers..."
try {
    while ($true) { Start-Sleep -Seconds 10 }
} finally {
    Write-Host "Stopping servers..." -ForegroundColor Red
    Stop-Process -Id $apiProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $viteProcess.Id -Force -ErrorAction SilentlyContinue
}