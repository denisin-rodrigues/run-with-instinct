# Simple deploy script
param(
    [string]$RemoteUrl,
    [string]$RemoteName = "origin",
    [string]$Branch = "main"
)

Write-Host "Starting deployment..." -ForegroundColor Cyan

# Check prerequisites
Write-Host "Checking Git..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Write-Host "Git not found" -ForegroundColor Red; exit 1 }
Write-Host "Git OK" -ForegroundColor Green

Write-Host "Checking Node.js..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Host "Node.js not found" -ForegroundColor Red; exit 1 }
Write-Host "Node.js OK" -ForegroundColor Green

Write-Host "Checking npm..." -ForegroundColor Yellow
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Write-Host "npm not found" -ForegroundColor Red; exit 1 }
Write-Host "npm OK" -ForegroundColor Green

# Add remote
Write-Host "Adding Git remote..." -ForegroundColor Yellow
git remote add $RemoteName $RemoteUrl 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "Remote add failed, maybe already exists" -ForegroundColor Yellow }

# Push
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u $RemoteName $Branch
if ($LASTEXITCODE -eq 0) { Write-Host "Push successful" -ForegroundColor Green } else { Write-Host "Push failed" -ForegroundColor Red }

# Install Netlify CLI
Write-Host "Installing Netlify CLI..." -ForegroundColor Yellow
npm install -g netlify-cli
if ($LASTEXITCODE -eq 0) { Write-Host "Netlify CLI installed" -ForegroundColor Green } else { Write-Host "Install failed" -ForegroundColor Red }

# Deploy
Write-Host "Deploying to Netlify..." -ForegroundColor Yellow
netlify deploy --prod --dir=public
if ($LASTEXITCODE -eq 0) { Write-Host "Deploy successful" -ForegroundColor Green } else { Write-Host "Deploy failed" -ForegroundColor Red }

Write-Host "Done!" -ForegroundColor Cyan