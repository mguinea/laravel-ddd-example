#!/usr/bin/env bash

source "etc/envs/commons.env"

# Up in detached mode
$DOCKER_COMPOSE up -d --force-recreate
