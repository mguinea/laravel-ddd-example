PROJECT_NAME="laravel-ddd-example"
DOCKER_COMPOSE=docker-compose -p $(PROJECT_NAME) -f ./etc/docker/docker-compose.yml

## ----------------------
## Docker composer management
## ----------------------

.PHONY: build
build: ## Build the stack
	$(DOCKER_COMPOSE) build --no-cache

.PHONY: up
up: ## Environment up!
	$(DOCKER_COMPOSE) up -d --build --force-recreate --renew-anon-volumes

.PHONY: restart
restart: ## Restart environment.
	$(DOCKER_COMPOSE) restart

.PHONY: bash
bash:
	$(DOCKER_COMPOSE) exec -it app bash

.PHONY: destroy
destroy:
	$(DOCKER_COMPOSE) down --remove-orphans --volumes
	$(DOCKER_COMPOSE) rm --stop --volumes --force

.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs app

## ----------------------
## Docker composer informational
## ----------------------

.PHONY: services
services:
	$(DOCKER_COMPOSE) ps

.PHONY: networks
networks:
	docker network ls

.PHONY: volumes
volumes:
	docker volume ls

## ----------------------
## Laravel commands
## ----------------------

.PHONY: migrate
migrate:
	$(DOCKER_COMPOSE) exec app bash -c "php ./apps/kanban-api/artisan migrate"

.PHONY: clean
clean:
	$(DOCKER_COMPOSE) exec app bash -c "php ./apps/kanban-api/artisan cache:clear"

## ----------------------
## Helpers
## ----------------------

.PHONY: mac-restart-docker
mac-restart-docker:
	killall Docker && open /Applications/Docker.app
