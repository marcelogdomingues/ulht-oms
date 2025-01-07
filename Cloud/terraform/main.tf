provider "azurerm" {
  features {}
  subscription_id = "c207c1ed-eb15-4b2e-8d75-ea277eba64aa"
}

# Namespace do Event Hub
resource "azurerm_eventhub_namespace" "shopping_namespace" {
  name                = "ShoppingOrderNamespace"
  location            = "East US"
  resource_group_name = "ShoppingOrderGroup"
  sku                 = "Standard"
}

# Event Hub
resource "azurerm_eventhub" "shopping_eventhub" {
  name            = "ShoppingOrderEventHub"
  namespace_id    = azurerm_eventhub_namespace.shopping_namespace.id
  partition_count = 2
  message_retention = 7
}