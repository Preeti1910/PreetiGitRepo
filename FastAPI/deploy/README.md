---
title: Deployment Guide
description: Instructions for deploying the FastAPI application to Azure App Service
---

## Overview

This folder contains the deployment script and configuration for deploying
the FastAPI Products API to Azure App Service.

## Files

| File | Purpose |
|------|---------|
| `config.psd1` | All configurable deployment values |
| `deploy.ps1` | PowerShell deployment script |

## Prerequisites

- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) installed
- Logged in to Azure: `az login`
- PowerShell 7+ recommended

## Configuration

Edit `config.psd1` before running the script:

```powershell
@{
    ResourceGroup     = "fastapi-rg"
    AppName           = "fastapi-products-app"   # Must be globally unique
    Location          = "eastus"
    CosmosAccountName = "cosmosdbself"
    CosmosResourceGroup = "fastapi-rg"           # RG where Cosmos DB lives
    # ... other settings
}
```

## Usage

### Full deployment (first time)

Creates resource group, App Service plan, web app, configures settings,
enables managed identity, assigns Cosmos DB role, and deploys code:

```powershell
.\deploy\deploy.ps1
```

### Code-only deployment (subsequent updates)

Skips infrastructure creation and only deploys updated code:

```powershell
.\deploy\deploy.ps1 -SkipInfra
```

## What the script does

1. Creates the resource group and App Service plan (Linux, B1 SKU)
2. Creates the web app with Python 3.11 runtime
3. Configures app settings (Cosmos DB endpoint, database, container)
4. Sets the startup command (gunicorn + uvicorn workers)
5. Enables system-assigned managed identity
6. Assigns Cosmos DB Built-in Data Contributor role to the managed identity
7. Deploys the application code via `az webapp up`

## Post-deployment

- Swagger UI: `https://<AppName>.azurewebsites.net/docs`
- API root: `https://<AppName>.azurewebsites.net/`
