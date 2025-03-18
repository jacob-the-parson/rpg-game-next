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

# Run SpacetimeDB local server
echo "Starting SpacetimeDB local server..."
spacetime local --db-path .spacetime/localdb

# If the server stops, print a message
echo "SpacetimeDB server stopped." 