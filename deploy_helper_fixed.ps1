# deploy_helper.ps1 - Automated deployment script for Run With Instinct site
# Pushes to GitHub and deploys to Netlify

param(
    [string]$RemoteUrl,
    [string]$RemoteName = "origin",
    [string]$Branch = "main",
    [switch]$Help
)

function Show-Help {
    Write-Host "deploy_helper.ps1 - Deploy Run With Instinct site to GitHub and Netlify" -ForegroundColor Cyan
    Write-Host "Usage: .\deploy_helper.ps1 -RemoteUrl <github-repo-url>" -ForegroundColor White
    Write-Host "Parameters:" -ForegroundColor White
    Write-Host "  -RemoteUrl    GitHub repository URL (required)" -ForegroundColor White
    Write-Host "  -RemoteName   Git remote name (default: origin)" -ForegroundColor White
    Write-Host "  -Branch       Branch to push (default: main)" -ForegroundColor White
    Write-Host "  -Help         Show this help" -ForegroundColor White
    Write-Host "Prerequisites: Git, Node.js, npm" -ForegroundColor White
    Write-Host "Environment: Set NETLIFY_AUTH_TOKEN for non-interactive deploy" -ForegroundColor White
}

function Show-Header {
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                 Run With Instinct - Deploy                 ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
}

function Test-CommandExists {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

function Check-Prerequisites {
    Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
    
    if (-not (Test-CommandExists "git")) {
        Write-Host "❌ Git is not installed. Please install Git and try again." -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Git found" -ForegroundColor Green
    
    if (-not (Test-CommandExists "node")) {
        Write-Host "❌ Node.js is not installed. Please install Node.js and try again." -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Node.js found" -ForegroundColor Green
    
    if (-not (Test-CommandExists "npm")) {
        Write-Host "❌ npm is not installed. Please install npm and try again." -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ npm found`n" -ForegroundColor Green
}

function Add-GitRemote {
    param([string]$Url, [string]$Name)
    
    Write-Host "🔗 Setting up Git remote '$Name'..." -ForegroundColor Yellow
    
    $existingRemote = git remote get-url $Name 2>$null
    
    if ($existingRemote) {
        Write-Host "⚠ Remote '$Name' already exists: $existingRemote" -ForegroundColor Yellow
        if ($Url -and $Url -ne $existingRemote) {
            $resp = Read-Host "Replace remote URL? (y/n)"
            if ($resp -eq 'y') { git remote set-url $Name $Url; Write-Host "✓ Remote updated" -ForegroundColor Green }
        }
    }
    else {
        if (-not $Url) { Write-Host "✗ No remote URL provided" -ForegroundColor Red; return $false }
        git remote add $Name $Url
        Write-Host "✓ Remote '$Name' added" -ForegroundColor Green
    }
    return $true
}

function Push-ToRemote {
    param([string]$Name, [string]$Branch)
    Write-Host "📤 Pushing to $Name/$Branch..." -ForegroundColor Yellow
    git push -u $Name $Branch
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Push completed" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ Push failed" -ForegroundColor Red
        return $false
    }
}

function Install-NetlifyCLI {
    Write-Host "📦 Checking for netlify-cli..." -ForegroundColor Yellow
    if (-not (Test-CommandExists "netlify")) {
        Write-Host "Installing netlify-cli..." -ForegroundColor Gray
        npm install -g netlify-cli
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ netlify-cli installed" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to install netlify-cli" -ForegroundColor Red
        }
    } else {
        Write-Host "✓ netlify-cli present" -ForegroundColor Green
    }
}

function Deploy-ToNetlify {
    Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Yellow
    $publishDir = "public"
    if (-not (Test-Path $publishDir)) { Write-Host "✗ Publish dir not found: $publishDir" -ForegroundColor Red; return $false }
    if ($env:NETLIFY_AUTH_TOKEN) {
        Write-Host "Using NETLIFY_AUTH_TOKEN" -ForegroundColor Gray
        netlify deploy --prod --dir=$publishDir
    } else {
        Write-Host "Interactive Netlify auth (if required)" -ForegroundColor Gray
        netlify deploy --prod --dir=$publishDir
    }
    if ($LASTEXITCODE -eq 0) { Write-Host "✓ Netlify deploy success" -ForegroundColor Green; return $true }
    Write-Host "✗ Netlify deploy failed" -ForegroundColor Red; return $false
}

if ($Help -or -not $RemoteUrl) { Show-Help; exit 0 }

Show-Header
Check-Prerequisites
$remoteOk = Add-GitRemote -Url $RemoteUrl -Name $RemoteName
if (-not $remoteOk) { Write-Host "Aborting due to remote error" -ForegroundColor Red; exit 1 }
$pushOk = Push-ToRemote -Name $RemoteName -Branch $Branch
if (-not $pushOk) { Write-Host "Push failed; you can run git push manually later." -ForegroundColor Yellow }
Install-NetlifyCLI
$deployOk = Deploy-ToNetlify
if (-not $deployOk) { Write-Host "Deploy failed or was interrupted." -ForegroundColor Yellow }

Write-Host "`nDone. Check GitHub and Netlify for site status." -ForegroundColor Cyan