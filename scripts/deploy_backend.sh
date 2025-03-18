#!/bin/bash

# Check if SpacetimeDB CLI is installed
if ! command -v spacetime &> /dev/null
then
    echo "SpacetimeDB CLI is not installed. Please install it first:"
    echo "cargo install spacetimedb-cli"
    exit 1
fi

# Create data directory if not exists
mkdir -p .spacetime

# Check if it's a local deployment
if [ "$1" == "local" ]; then
    echo "Deploying to local SpacetimeDB instance..."
    spacetime publish src/backend --local
else
    echo "Deploying to SpacetimeDB cloud..."
    spacetime publish src/backend
fi

echo "Backend deployment complete!" 