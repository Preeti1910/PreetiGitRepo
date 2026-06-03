<#
.SYNOPSIS
    Deploys the FastAPI application to Azure App Service.

.DESCRIPTION
    Creates resource group, App Service plan, web app, configures environment
    variables, enables managed identity, assigns Cosmos DB RBAC role, and deploys code.
    Checks for existing resources and skips or updates as needed.

.EXAMPLE
    .\deploy.ps1
    .\deploy.ps1 -SkipInfra   # Skip resource creation, only deploy code
#>

param(
    [switch]$SkipInfra
)

$ErrorActionPreference = "Stop"

# Load configuration
$config = Import-PowerShellDataFile -Path "$PSScriptRoot\config.psd1"

$rgName           = $config.ResourceGroup
$location         = $config.Location
$appName          = $config.AppName
$planName         = $config.AppServicePlan
$runtime          = $config.PythonRuntime
$sku              = $config.Sku
$cosmosAccount    = $config.CosmosAccountName
$cosmosRg         = $config.CosmosResourceGroup
$cosmosEndpoint   = $config.CosmosEndpoint
$cosmosDatabase   = $config.CosmosDatabase
$cosmosContainer  = $config.CosmosContainer

Write-Host "=== FastAPI Azure Deployment ===" -ForegroundColor Cyan
Write-Host "App Name: $appName"
Write-Host "Resource Group: $rgName"
Write-Host "Location: $location"
Write-Host ""

# --- Step 1: Create Infrastructure ---
if (-not $SkipInfra) {
    # Resource Group
    Write-Host "[1/6] Checking resource group..." -ForegroundColor Yellow
    $rgExists = az group exists --name $rgName --output tsv
    if ($rgExists -eq "true") {
        Write-Host "      Resource group '$rgName' already exists. Skipping." -ForegroundColor DarkGray
    }
    else {
        az group create --name $rgName --location $location --output none
        Write-Host "      Resource group '$rgName' created." -ForegroundColor Green
    }

    # App Service Plan
    Write-Host "[2/6] Checking App Service plan..." -ForegroundColor Yellow
    $planInfo = az appservice plan show --name $planName --resource-group $rgName 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($planInfo) {
        $currentSku = $planInfo.sku.name
        if ($currentSku -ne $sku) {
            Write-Host "      Plan exists but SKU differs ($currentSku -> $sku). Updating..." -ForegroundColor DarkYellow
            az appservice plan update --name $planName --resource-group $rgName --sku $sku --output none
            Write-Host "      Plan '$planName' updated to $sku." -ForegroundColor Green
        }
        else {
            Write-Host "      Plan '$planName' already exists ($sku). Skipping." -ForegroundColor DarkGray
        }
    }
    else {
        az appservice plan create `
            --name $planName `
            --resource-group $rgName `
            --is-linux `
            --sku $sku `
            --output none
        Write-Host "      Plan '$planName' created ($sku)." -ForegroundColor Green
    }

    # Web App
    Write-Host "[3/6] Checking web app..." -ForegroundColor Yellow
    $appInfo = az webapp show --name $appName --resource-group $rgName 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($appInfo) {
        Write-Host "      Web app '$appName' already exists. Skipping creation." -ForegroundColor DarkGray
    }
    else {
        az webapp create `
            --name $appName `
            --resource-group $rgName `
            --plan $planName `
            --runtime $runtime `
            --output none
        Write-Host "      Web app '$appName' created." -ForegroundColor Green
    }
}
else {
    Write-Host "[1-3/6] Skipping infrastructure creation (--SkipInfra)." -ForegroundColor DarkGray
}

# --- Step 2: Configure App Settings ---
Write-Host "[4/6] Configuring app settings..." -ForegroundColor Yellow

# Check current settings and update only if changed
$currentSettings = az webapp config appsettings list --name $appName --resource-group $rgName 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue
$settingsMap = @{}
if ($currentSettings) {
    foreach ($s in $currentSettings) { $settingsMap[$s.name] = $s.value }
}

$needsUpdate = ($settingsMap["COSMOS_ENDPOINT"] -ne $cosmosEndpoint) -or
               ($settingsMap["COSMOS_DATABASE"] -ne $cosmosDatabase) -or
               ($settingsMap["COSMOS_CONTAINER"] -ne $cosmosContainer) -or
               ($settingsMap["SCM_DO_BUILD_DURING_DEPLOYMENT"] -ne "true")

if ($needsUpdate) {
    az webapp config appsettings set `
        --name $appName `
        --resource-group $rgName `
        --settings `
            COSMOS_ENDPOINT=$cosmosEndpoint `
            COSMOS_DATABASE=$cosmosDatabase `
            COSMOS_CONTAINER=$cosmosContainer `
            SCM_DO_BUILD_DURING_DEPLOYMENT=true `
        --output none
    Write-Host "      App settings updated." -ForegroundColor Green
}
else {
    Write-Host "      App settings unchanged. Skipping." -ForegroundColor DarkGray
}

# Check startup command
$currentConfig = az webapp config show --name $appName --resource-group $rgName 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue
if ($currentConfig -and $currentConfig.appCommandLine -ne "startup.sh") {
    az webapp config set `
        --name $appName `
        --resource-group $rgName `
        --startup-file "startup.sh" `
        --output none
    Write-Host "      Startup command updated." -ForegroundColor Green
}
else {
    Write-Host "      Startup command unchanged. Skipping." -ForegroundColor DarkGray
}

# --- Step 3: Enable Managed Identity & Assign Cosmos DB Role ---
Write-Host "[5/6] Enabling managed identity and assigning Cosmos DB role..." -ForegroundColor Yellow

$identity = az webapp identity show --name $appName --resource-group $rgName 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue
if ($identity -and $identity.principalId) {
    $principalId = $identity.principalId
    Write-Host "      Managed identity already enabled. Principal ID: $principalId" -ForegroundColor DarkGray
}
else {
    az webapp identity assign --name $appName --resource-group $rgName --output none
    $principalId = az webapp identity show `
        --name $appName `
        --resource-group $rgName `
        --query principalId `
        --output tsv
    Write-Host "      Managed identity enabled. Principal ID: $principalId" -ForegroundColor Green
}

# Cosmos DB Built-in Data Contributor role
$roleDefinitionId = "00000000-0000-0000-0000-000000000002"

# Check if role assignment already exists
$existingRoles = az cosmosdb sql role assignment list `
    --account-name $cosmosAccount `
    --resource-group $cosmosRg `
    --query "[?principalId=='$principalId']" `
    --output json 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue

if ($existingRoles -and $existingRoles.Count -gt 0) {
    Write-Host "      Cosmos DB role already assigned. Skipping." -ForegroundColor DarkGray
}
else {
    az cosmosdb sql role assignment create `
        --account-name $cosmosAccount `
        --resource-group $cosmosRg `
        --role-definition-id $roleDefinitionId `
        --principal-id $principalId `
        --scope "/" `
        --output none 2>$null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "      Cosmos DB role assigned." -ForegroundColor Green
    }
    else {
        Write-Host "      Cosmos DB role assignment failed (may already exist)." -ForegroundColor DarkYellow
    }
}

# --- Step 4: Deploy Code ---
Write-Host "[6/6] Deploying application code..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\.."
az webapp up `
    --name $appName `
    --resource-group $rgName `
    --runtime $runtime
Pop-Location
Write-Host "      Deployment complete." -ForegroundColor Green

# --- Summary ---
Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Cyan
Write-Host "URL: https://$appName.azurewebsites.net" -ForegroundColor Green
Write-Host "Swagger: https://$appName.azurewebsites.net/docs" -ForegroundColor Green
