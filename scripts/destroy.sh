#!/usr/bin/env bash

source "etc/envs/commons.env"

# Clean up everything
$DOCKER_COMPOSE down
$DOCKER_COMPOSE rm -f
docker network rm $NETWORK_NAME
