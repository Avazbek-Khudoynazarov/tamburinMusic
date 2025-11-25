#!/bin/bash

# Tamburin Music - Cafe24 Deployment Script
# Usage: ./deploy-to-cafe24.sh [server_user] [server_ip]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="${1:-your_username}"
SERVER_IP="${2:-114.207.245.104}"
BACKEND_DIR="tamburin_backend"
FRONTEND_DIR="tamburin_frontend"

echo -e "${GREEN}=== Tamburin Music Deployment Script ===${NC}"
echo -e "${YELLOW}Server: $SERVER_USER@$SERVER_IP${NC}"
echo ""

# Step 1: Build Frontend
echo -e "${GREEN}[1/6] Building Frontend...${NC}"
cd Frontend
npm run build
cd ..

# Step 2: Build Backend
echo -e "${GREEN}[2/6] Building Backend...${NC}"
cd Backend
npm run build
cd ..

# Step 3: Create deployment package
echo -e "${GREEN}[3/6] Creating deployment package...${NC}"
mkdir -p deploy_package/backend deploy_package/frontend

# Copy backend files
cp -r Backend/dist deploy_package/backend/
cp Backend/package.json deploy_package/backend/
cp Backend/.env.production deploy_package/backend/.env

# Copy frontend files
cp -r Frontend/dist/* deploy_package/frontend/

# Copy database
cp tamburin_music.sql deploy_package/

echo -e "${GREEN}[4/6] Deployment package created in ./deploy_package/${NC}"

# Step 4: Upload to server
echo -e "${GREEN}[5/6] Uploading to Cafe24 server...${NC}"
echo -e "${YELLOW}You will be prompted for password multiple times${NC}"

# Create directories on server
ssh $SERVER_USER@$SERVER_IP "mkdir -p ~/$BACKEND_DIR ~/$FRONTEND_DIR"

# Upload backend
scp -r deploy_package/backend/* $SERVER_USER@$SERVER_IP:~/$BACKEND_DIR/

# Upload frontend
scp -r deploy_package/frontend/* $SERVER_USER@$SERVER_IP:~/$FRONTEND_DIR/

# Upload database
scp deploy_package/tamburin_music.sql $SERVER_USER@$SERVER_IP:~/

echo -e "${GREEN}[6/6] Files uploaded successfully!${NC}"

# Step 5: Deploy on server
echo -e "${GREEN}Configuring server...${NC}"
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd ~/tamburin_backend
npm install --production

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Stop existing process if running
pm2 stop tamburin-api 2>/dev/null || true

# Start with PM2
pm2 start dist/index.js --name tamburin-api
pm2 save

echo "Backend deployed and started with PM2"
ENDSSH

echo ""
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Import database: ssh $SERVER_USER@$SERVER_IP 'mysql -u user -p tamburinmusic < ~/tamburin_music.sql'"
echo "2. Configure web server to serve frontend from ~/$FRONTEND_DIR"
echo "3. Test: http://$SERVER_IP"
echo "4. Check backend: http://$SERVER_IP:5001/status"
echo ""
