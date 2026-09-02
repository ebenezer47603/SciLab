$base = (Get-Location).Path

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " SciLab Reaction Lab Repair" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$files = @(
    "src\main.js",
    "src\style.css",
    "src\simulations\reaction\core\ReactionSimulator.js",
    "src\simulations\reaction\engine\ReactionEngine.js",
    "src\simulations\reaction\systems\MoleculeSystem.js",
    "src\simulations\reaction\scene\MoleculeRenderer.js",
    "src\simulations\reaction\scene\ReactionScene.js",
    "src\simulations\reaction\scene\ReactionChamber.js",
    "src\simulations\reaction\data\molecules.js",
    "src\simulations\reaction\data\reactions.js",
    "src\styles\reaction.css"
)

Write-Host "Checking project files..." -ForegroundColor Yellow

foreach ($file in $files) {

    $path = Join-Path $base $file

    if (Test-Path $path) {
        Write-Host "[OK] $file" -ForegroundColor Green
    }
    else {
        Write-Host "[MISSING] $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Checking package..." -ForegroundColor Yellow

if (Test-Path ".\package.json") {
    Write-Host "[OK] package.json" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] package.json not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow

npm install

Write-Host ""
Write-Host "Running Vite build..." -ForegroundColor Yellow

npm run build

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Repair/check finished." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""