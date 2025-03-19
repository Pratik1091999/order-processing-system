#!/bin/bash

########################################
# ## Usage ##
# ~ $ ./codegen-node-be.sh <Entity Name in CamelCase>
#
########################################

# Set project paths
BASH_HOME=$(pwd)
PROJECT_HOME="$BASH_HOME/../../"  # Root of your project
SRC_DIR="$PROJECT_HOME/src"  # Correct path to src directory
CONTROLLERS_DIR="$SRC_DIR/controllers/api/v1"
ROUTES_DIR="$SRC_DIR/routes/api/v1"
MODELS_DIR="$SRC_DIR/models"
ERROR_CONFIG_FILE="$SRC_DIR/utils/errorMessage.js"

# Get the entity name from arguments
ENTITY_NAME=$1
ENTITY_NAME_LOWER=$(echo "$ENTITY_NAME" | tr '[:upper:]' '[:lower:]')
ENTITY_NAME_UPPER=$(echo "$ENTITY_NAME" | tr '[:lower:]' '[:upper:]')

# Input validation
if [[ -z "$ENTITY_NAME" ]]; then
    echo "Error: Please provide an Entity Name in CamelCase."
    exit 1
fi

# Create directories if they don't exist
mkdir -p "$CONTROLLERS_DIR" "$ROUTES_DIR" "$MODELS_DIR"

# Define template file paths
CONTROLLER_TEMPLATE="$BASH_HOME/../template/snippet/controllers/entity.js"
ROUTE_TEMPLATE="$BASH_HOME/../template/snippet/routes/entity.js"
MODEL_TEMPLATE="$BASH_HOME/../template/snippet/models/entity.js"

# Create the controller file
controller_file="$CONTROLLERS_DIR/${ENTITY_NAME_LOWER}.js"
if [[ -f "$CONTROLLER_TEMPLATE" ]]; then
    cp "$CONTROLLER_TEMPLATE" "$controller_file"
    sed -i "s/entityNameLower/${ENTITY_NAME_LOWER}/g; s/entityNameUpper/${ENTITY_NAME_UPPER}/g; s/Entity/${ENTITY_NAME}/g" "$controller_file"
    echo "Created controller: $controller_file"
else
    echo "Error: Controller template file not found at $CONTROLLER_TEMPLATE."
    exit 1
fi

# Create the route file
route_file="$ROUTES_DIR/${ENTITY_NAME_LOWER}.js"
if [[ -f "$ROUTE_TEMPLATE" ]]; then
    cp "$ROUTE_TEMPLATE" "$route_file"
    sed -i "s/entityNameLower/${ENTITY_NAME_LOWER}/g; s/entityNameUpper/${ENTITY_NAME_UPPER}/g; s/Entity/${ENTITY_NAME}/g" "$route_file"
    echo "Created route: $route_file"
else
    echo "Error: Route template file not found at $ROUTE_TEMPLATE."
    exit 1
fi

# Create the model file
model_file="$MODELS_DIR/${ENTITY_NAME_LOWER}.js"
if [[ -f "$MODEL_TEMPLATE" ]]; then
    cp "$MODEL_TEMPLATE" "$model_file"
    sed -i "s/entityNameLower/${ENTITY_NAME_LOWER}/g; s/entityNameUpper/${ENTITY_NAME_UPPER}/g; s/Entity/${ENTITY_NAME}/g" "$model_file"
    echo "Created model: $model_file"
else
    echo "Error: Model template file not found at $MODEL_TEMPLATE."
    exit 1
fi

# Update the error configuration file
if [[ -f "$ERROR_CONFIG_FILE" ]]; then
    if grep -q "${ENTITY_NAME_LOWER}:" "$ERROR_CONFIG_FILE"; then
        echo "Error: ${ENTITY_NAME} error configuration already exists in $ERROR_CONFIG_FILE."
        exit 1
    fi

    echo "Adding error messages to $ERROR_CONFIG_FILE"
    sed -i "/module.exports = {/a\\
    ${ENTITY_NAME_LOWER}: {\\
    create_success: '${ENTITY_NAME} created successfully',\\
    create_failed: 'Failed to create ${ENTITY_NAME}',\\
    fetch_single_success: '${ENTITY_NAME} fetched successfully',\\
    fetch_single_failed: 'Failed to fetch ${ENTITY_NAME}',\\
    fetch_all_success: '${ENTITY_NAME}(s) fetched successfully',\\
    fetch_all_failed: 'Failed to fetch ${ENTITY_NAME}(s)',\\
    update_success: '${ENTITY_NAME} update successfully',\\
    update_failed: 'Failed to update ${ENTITY_NAME}',\\
    delete_success: '${ENTITY_NAME} deleted successfully',\\
    delete_failed: 'Failed to delete ${ENTITY_NAME}',\\
    not_found: '${ENTITY_NAME} not found',\\
    unauthorized_access: 'Unauthorized access',\\
    forbidden_access: 'Forbidden access',\\
    internal_server_error: 'Internal server error'\\
    },\\
    " "$ERROR_CONFIG_FILE"
else
    echo "Error: Configuration file $ERROR_CONFIG_FILE does not exist."
    exit 1
fi

echo "Updated error configuration for ${ENTITY_NAME_LOWER}."
