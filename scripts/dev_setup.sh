#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up RPG Game Next development environment${NC}"
echo

# Step 1: Install dependencies
echo -e "${BLUE}Step 1: Installing NPM dependencies...${NC}"
npm install

# Step 2: Check for SpacetimeDB CLI
echo -e "${BLUE}Step 2: Checking for SpacetimeDB CLI...${NC}"
if ! command -v spacetime &> /dev/null
then
    echo -e "${RED}SpacetimeDB CLI not found.${NC}"
    echo -e "You'll need to install Rust and SpacetimeDB CLI:"
    echo -e "1. Install Rust: https://rustup.rs/"
    echo -e "2. Install SpacetimeDB CLI: cargo install spacetimedb-cli"
    echo
    echo -e "Continue with development anyway? [y/N]"
    read -n 1 answer
    if [[ ! "$answer" =~ [yY] ]]; then
        echo -e "${RED}Setup cancelled.${NC}"
        exit 1
    fi
    echo
    echo -e "${BLUE}Continuing without SpacetimeDB CLI...${NC}"
else
    echo -e "${GREEN}SpacetimeDB CLI found!${NC}"
fi

# Step 3: Check for .env.local
echo -e "${BLUE}Step 3: Checking for environment configuration...${NC}"
if [ ! -f .env.local ]; then
    echo -e "Creating .env.local with default settings..."
    echo "NEXT_PUBLIC_SPACETIME_SERVER=localhost:3000" > .env.local
    echo -e "${GREEN}Created .env.local${NC}"
else
    echo -e "${GREEN}.env.local already exists${NC}"
fi

# Step 4: Setup complete
echo
echo -e "${GREEN}Development environment setup complete!${NC}"
echo
echo -e "To run the application:"
echo -e "1. Start the development server: ${BLUE}npm run dev${NC}"
echo -e "2. Open your browser to: ${BLUE}http://localhost:3000${NC}"
echo
echo -e "For multiplayer functionality, run:"
echo -e "1. Start SpacetimeDB: ${BLUE}./scripts/run_spacetimedb.sh${NC}"
echo -e "2. Deploy backend: ${BLUE}./scripts/deploy_backend.sh local${NC}"
echo
echo -e "${GREEN}Happy coding!${NC}" 