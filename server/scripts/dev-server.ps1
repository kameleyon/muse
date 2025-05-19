# Kill any process on port 9999
Write-Host "Killing any process on port 9999..."
$processes = Get-NetTCPConnection -LocalPort 9999 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($processes) {
    $processes | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    Write-Host "Processes killed successfully"
}

# Start the server
Write-Host "Starting development server..."
npm run dev