#!/usr/bin/env bash
set -eo pipefail

source "./etc/envs/commons.env"

# Up in detached mode
$DOCKER_COMPOSE up -d --force-recreate
