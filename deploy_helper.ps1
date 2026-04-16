#!/usr/bin/env pwsh
# Deploy Helper Script for Netlify
# Automates: add remote, push, install netlify-cli, and deploy

param(
    [string]$RemoteUrl,
    [string]$RemoteName = "origin",
    [string]$Branch = "main",
    [switch]$Help
)

function Show-Help {
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║                 Netlify Deploy Helper Script                 ║
╚══════════════════════════════════════════════════════════════╝

USAGE:
  .\deploy_helper.ps1 -RemoteUrl <url> [-RemoteName <name>] [-Branch <name>]
  .\deploy_helper.ps1 -Help

EXAMPLES:
  # Deploy with GitHub remote
  .\deploy_helper.ps1 -RemoteUrl "https://github.com/user/repo.git"

  # Deploy with custom remote name
  .\deploy_helper.ps1 -RemoteUrl "https://github.com/user/repo.git" -RemoteName "upstream"

  # Deploy to specific branch
  .\deploy_helper.ps1 -RemoteUrl "https://github.com/user/repo.git" -Branch "develop"

FEATURES:
  ✓ Adds git remote (if not exists)
  ✓ Pushes current branch to remote
  ✓ Installs netlify-cli (if missing)
  ✓ Deploys to Netlify using NETLIFY_AUTH_TOKEN or interactive mode
  ✓ Helpful error messages and progress updates

REQUIREMENTS:
  • Git must be installed
  • Node.js and npm must be installed
  • NETLIFY_AUTH_TOKEN environment variable (optional)
    - If not set, deploy will run in interactive mode

SETTING NETLIFY_AUTH_TOKEN:
  [System.Environment]::SetEnvironmentVariable('NETLIFY_AUTH_TOKEN', 'your_token', 'User')
  Then restart PowerShell.

"@
}

function Show-Header {
    Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║         Netlify Deploy Helper - Running Deployment            ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
}

function Test-CommandExists {
    param([string]$Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
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
    
    try {
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
    catch {
        Write-Host "✗ Error configuring remote: $_" -ForegroundColor Red
        return $false
    }
}

function Push-ToRemote {
    param([string]$Name, [string]$Branch)
    Write-Host "📤 Pushing to $Name/$Branch..." -ForegroundColor Yellow
    try {
        git push -u $Name $Branch
        Write-Host "✓ Push completed" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Push failed: $_" -ForegroundColor Red
        return $false
    }
}

function Install-NetlifyCLI {
    Write-Host "📦 Checking for netlify-cli..." -ForegroundColor Yellow
    if (-not (Test-CommandExists "netlify")) {
        Write-Host "Installing netlify-cli..." -ForegroundColor Gray
        try {
            npm install -g netlify-cli
            Write-Host "✓ netlify-cli installed" -ForegroundColor Green
        }
        catch {
            Write-Host "✗ Failed to install netlify-cli: $_" -ForegroundColor Red
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
