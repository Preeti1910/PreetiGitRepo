# Deployment Configuration
# Update these values before running deploy.ps1

@{
    # Azure Resource Settings
    ResourceGroup     = "rg_self_learn"
    Location          = "East US 2"
    AppName           = "fastapi-products-app"       # Must be globally unique
    AppServicePlan    = "fastapi-products-app-plan"
    PythonRuntime     = "PYTHON:3.11"
    Sku               = "F1"

    # Cosmos DB Settings
    CosmosAccountName = "cosmosdbself"
    CosmosResourceGroup = "rg_self_learn"              # RG where Cosmos DB lives
    CosmosEndpoint    = "https://cosmosdbself.documents.azure.com:443/"
    CosmosDatabase    = "productsdb"
    CosmosContainer   = "products"
}
