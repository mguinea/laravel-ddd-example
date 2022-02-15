PROJECT_NAME := laravel-ddd-example
DOCKER_COMPOSE = docker-compose -p $(PROJECT_NAME) -f etc/docker/docker-compose.yml

build:
	$(DOCKER_COMPOSE) build

create-network:
	@docker network create laravel-ddd-example

up:
	$(DOCKER_COMPOSE) up -d --force-recreate

vendors:
	@docker exec -it laravel-ddd-example.kanban-api composer install

bash:
	@docker exec -it laravel-ddd-example.kanban-api bash

bash-db:
	@docker exec -it -w / laravel-ddd-example.db bash

restart:
	$(DOCKER_COMPOSE) restart

stop:
	$(DOCKER_COMPOSE) stop

destroy:
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) rm -f

services:
	$(DOCKER_COMPOSE) ps

networks:
	@docker network ls

migrate:
	@docker exec -it laravel-ddd-example.kanban-api php apps/kanban-api/artisan migrate

.PHONY: tests
tests:
	@docker exec -it laravel-ddd-example.kanban-api php vendor/bin/phpunit apps/kanban-api/tests --order-by=random
