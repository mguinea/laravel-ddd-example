#!/usr/bin/env bash
set -eo pipefail

source "./etc/envs/commons.env"

docker exec -it laravel-ddd-example.app ./vendor/phpunit/phpunit/phpunit tests/ --exclude-group=ignore --coverage-text var/coverage
