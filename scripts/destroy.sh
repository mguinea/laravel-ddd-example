#!/usr/bin/env bash
set -eo pipefail

source "./etc/envs/commons.env"

# Clean up everything
$DOCKER_COMPOSE down
$DOCKER_COMPOSE rm -f

docker volume rm laravel-ddd-example_laravel-ddd-example.dbdata
docker volume rm laravel-ddd-example_laravel-ddd-example.prometeus
docker volume rm laravel-ddd-example_laravel-ddd-example.grafana

docker network rm $NETWORK_NAME
