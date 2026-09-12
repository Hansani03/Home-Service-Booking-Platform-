$ErrorActionPreference = "Stop"
$maximumAttempts = 60
$delaySeconds = 5

$checks = @(
    @{ Name = "Frontend"; Url = "http://localhost:5173/" },
    @{ Name = "Provider service"; Url = "http://localhost:8082/api/categories" },
    @{ Name = "Notification service"; Url = "http://localhost:8083/api/notifications/user/1?userType=Customer" }
)

foreach ($check in $checks) {
    $ready = $false

    for ($attempt = 1; $attempt -le $maximumAttempts; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $check.Url -UseBasicParsing -TimeoutSec 10
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
                Write-Host "$($check.Name) is ready: HTTP $($response.StatusCode)"
                $ready = $true
                break
            }
        }
        catch {
            Write-Host "Waiting for $($check.Name) ($attempt/$maximumAttempts)..."
        }

        Start-Sleep -Seconds $delaySeconds
    }

    if (-not $ready) {
        docker compose ps
        docker compose logs --no-color --tail 150
        throw "$($check.Name) did not become ready at $($check.Url)."
    }
}

$bookingPort = Test-NetConnection -ComputerName localhost -Port 8081 -WarningAction SilentlyContinue
if (-not $bookingPort.TcpTestSucceeded) {
    docker compose ps
    docker compose logs --no-color --tail 150 booking-service
    throw "Booking service did not open port 8081."
}

Write-Host "Booking service is ready on port 8081."
Write-Host "All integration smoke tests passed."
