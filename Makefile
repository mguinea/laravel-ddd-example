PROJECT_NAME="laravel-ddd-example"
NETWORK_NAME="laravel-ddd-example.network"
DOCKER_COMPOSE=docker-compose -p $(PROJECT_NAME) -f etc/docker/docker-compose.yml

## ----------------------
## Docker composer management
## ----------------------

.PHONY: build
build: ## Build the stack
	@$(DOCKER_COMPOSE) build

.PHONY: up
up: ## Environment up!
	@$(DOCKER_COMPOSE) up -d --build --remove-orphans

.PHONY: bash
bash:
	@$(DOCKER_COMPOSE) up -d --build --remove-orphans

.PHONY: destroy
destroy:
	$(DOCKER_COMPOSE) down --remove-orphans --volumes
	$(DOCKER_COMPOSE) rm --stop --volumes --force
	docker network rm $(NETWORK_NAME)

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
## Helpers
## ----------------------

.PHONY: mac-restart-docker
mac-restart-docker:
	killall Docker && open /Applications/Docker.app
