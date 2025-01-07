#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define paths dynamically
NETWORK_COMPOSE="$SCRIPT_DIR/Network/docker-compose.yml"
CLOUD_TERRAFORM="$SCRIPT_DIR/Cloud/terraform"
PROCESS_COMPOSE="$SCRIPT_DIR/Process/docker-compose.yml"

# Function to handle errors
handle_error() {
  echo "Error: $1"
  echo "Continuing to the next step..."
}

# Function to validate Docker Compose file
validate_compose_file() {
  if [ ! -f "$1" ]; then
    echo "Error: Compose file $1 does not exist."
    return 1
  elif [ ! -s "$1" ]; then
    echo "Error: Compose file $1 is empty."
    return 1
  fi
  return 0
}

# Start Network services
echo "Starting Network services with Docker Compose..."
if validate_compose_file "$NETWORK_COMPOSE"; then
  docker-compose -f "$NETWORK_COMPOSE" up -d || handle_error "Failed to start Network services."
else
  handle_error "Invalid Docker Compose file for Network services."
fi

# Commenting out Terraform-related sections for now
# echo "Initializing Terraform for Cloud setup..."
# cd "$CLOUD_TERRAFORM" || { handle_error "Failed to access Terraform directory."; exit 1; }

# terraform init || handle_error "Failed to initialize Terraform."

# echo "Checking Terraform plan for existing resources..."
# terraform plan -out=tfplan.out | tee terraform_plan.log
# if grep -q "already exists" terraform_plan.log; then
#   echo "Terraform plan indicates some resources already exist. Skipping apply."
# else
#   echo "Applying Terraform configuration..."
#   terraform apply tfplan.out || handle_error "Failed to apply Terraform configuration."
# fi

# Start Process services
echo "Starting Process services with Docker Compose..."
if validate_compose_file "$PROCESS_COMPOSE"; then
  docker-compose -f "$PROCESS_COMPOSE" up -d || handle_error "Failed to start Process services."
else
  handle_error "Invalid Docker Compose file for Process services."
fi

echo "All steps completed successfully!"