#!/usr/bin/env bash
set -eo pipefail

source "./etc/envs/commons.env"

# Create .env file from .env.dist
cp -n ".env.dist" ".env"

# Build Docker
$DOCKER_COMPOSE build

# Create docker network
docker network create $NETWORK_NAME

# Up and run
source "scripts/up.sh"

# Install vendors
docker exec -it laravel-ddd-example.kanban-api composer install
