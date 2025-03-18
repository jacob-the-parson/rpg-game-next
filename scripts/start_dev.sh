#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting RPG Game Next development environment${NC}"
echo

# Check if Next.js is already running
if lsof -i :3000 > /dev/null; then
    echo -e "${RED}Process already running on port 3000.${NC}"
    echo -e "Please stop it before running this script."
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${BLUE}Creating .env.local file...${NC}"
    echo "NEXT_PUBLIC_SPACETIME_SERVER=localhost:3000" > .env.local
    echo -e "${GREEN}Created .env.local${NC}"
fi

# Start the Next.js development server
echo -e "${BLUE}Starting Next.js development server...${NC}"
npm run dev &
NEXT_PID=$!
echo -e "${GREEN}Next.js server started (PID: $NEXT_PID)${NC}"

# Wait for server to start
echo -e "${BLUE}Waiting for server to start...${NC}"
sleep 5

echo
echo -e "${GREEN}Development environment is running!${NC}"
echo -e "Visit ${BLUE}http://localhost:3000${NC} to see your application."
echo
echo -e "Press Ctrl+C to stop all services."

# Trap Ctrl+C to kill all processes
trap 'echo -e "${RED}Shutting down services...${NC}"; kill $NEXT_PID; echo -e "${GREEN}Services stopped.${NC}"; exit 0' INT

# Keep script running
while true; do
    sleep 1
done 