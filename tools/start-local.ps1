$ErrorActionPreference = 'Stop'

$projectPath = Split-Path -Parent $PSScriptRoot
$port = 4173
$url = "http://127.0.0.1:$port/"

$portInUse = $false
try {
  $portInUse = [bool](Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
} catch {
  $portInUse = $false
}

if (-not $portInUse) {
  Start-Process -FilePath 'npm.cmd' -ArgumentList 'run', 'dev', '--', '--host', '127.0.0.1', '--port', $port -WorkingDirectory $projectPath -WindowStyle Hidden
  Start-Sleep -Seconds 2
}

Start-Process $url
