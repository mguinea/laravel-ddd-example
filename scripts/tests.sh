#!/usr/bin/env bash

source "etc/envs/commons.env"
source "etc/envs/${ENVIRONMENT}.env"

# Execute tests
docker exec -it laravel-ddd-example.kanban-api php vendor/bin/phpunit apps/kanban-api/tests --order-by=random
