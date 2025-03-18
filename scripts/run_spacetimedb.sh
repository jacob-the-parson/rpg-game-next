#!/bin/bash

# Check if SpacetimeDB CLI is installed
if ! command -v spacetime &> /dev/null
then
    echo "SpacetimeDB CLI is not installed. Please install it first:"
    echo "cargo install spacetimedb-cli"
    exit 1
fi

# Create data directory if not exists
mkdir -p .spacetime/localdb

# Run SpacetimeDB local server
echo "Starting SpacetimeDB local server on port 3001..."
spacetime start --data-dir .spacetime/localdb --listen-addr 127.0.0.1:3001

# If the server stops, print a message
echo "SpacetimeDB server stopped." 