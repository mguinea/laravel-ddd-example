#!/usr/bin/env bash
set -eo pipefail

source "./etc/envs/commons.env"

# Execute tests
# docker exec -it laravel-ddd-example.kanban-api php vendor/bin/phpunit apps/kanban-api/tests --order-by=random
docker exec -it laravel-ddd-example.app php vendor/bin/phpunit tests --order-by=random --testsuite unit-tests
