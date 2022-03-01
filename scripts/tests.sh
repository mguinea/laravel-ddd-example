#!/usr/bin/env bash
set -eo pipefail

source "./etc/envs/commons.env"

# Execute tests
docker exec -it laravel-ddd-example.kanban-api php vendor/bin/phpunit apps/kanban-api/tests --order-by=random
