install:
	@docker network inspect laravel-ddd-example > /dev/null || docker network create laravel-ddd-example
	@make composer-install

composer-install:
	@docker exec -it kanban-api-php composer install

composer-update:
	@docker exec -it kanban-api-php composer update

up:
	@docker-compose up -d --force-recreate

restart:
	@docker-compose restart

destroy:
	@docker-compose down
	@docker-compose rm -f

services:
	@docker-compose ps

networks:
	@docker network ls

migrate:
	@docker exec -it kanban-api-php php apps/kanban-api/artisan migrate

migrate-fresh:
	@docker exec -it kanban-api-php php apps/kanban-api/artisan migrate:fresh

bash:
	@docker exec -it kanban-api-php bash

.PHONY: tests
tests:
	@make core-tests
	@make kanban-api-tests

core-tests:
	@docker exec -it kanban-api-php php vendor/bin/phpunit --order-by=random

kanban-api-tests:
	@docker exec -it kanban-api-php php vendor/bin/phpunit apps/kanban-api/tests --order-by=random

kanban-front-tests:
	@docker exec -it kanban-front-webserver npm run test
