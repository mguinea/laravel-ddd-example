<h1 align="center">
  Hexagonal Architecture, DDD & CQRS in Laravel PHP
</h1>

<p align="center">
    <a href="https://laravel.com/"><img src="https://img.shields.io/badge/Laravel-8-FF2D20.svg?style=for-the-badge&logo=laravel" alt="Laravel 8"/></a>
    <a href="https://www.php.net/"><img src="https://img.shields.io/badge/PHP-8-777BB4.svg?style=for-the-badge&logo=php" alt="PHP"/></a>
    <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/docker-3-2496ED.svg?style=for-the-badge&logo=docker" alt="Docker"/></a>
    <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/mysql-5.7-4479A1.svg?style=for-the-badge&logo=mysql" alt="MySql"/></a>
    <a href="https://www.terraform.io/"><img src="https://img.shields.io/badge/terraform-1.3-7B42BC.svg?style=for-the-badge&logo=terraform" alt="Terraform"/></a>
    <a href="https://circleci.com/gh/mguinea/laravel-ddd-example/tree/master"><img src="https://circleci.com/gh/mguinea/laravel-ddd-example/tree/master.svg?style=svg" alt="CircleCI"/></a>
    <a href="https://github.com/mguinea/laravel-ddd-example/actions"><img src="https://github.com/mguinea/laravel-ddd-example/actions/workflows/php.yml/badge.svg" alt="GithubActions"/></a>
</p>

<p align="center">
  This is a monorepo containing a <strong>PHP application using Domain-Driven Design (DDD) and Command Query Responsibility Segregation
  (CQRS) principles</strong>.
  <br />
  <br />
  It's a basic implementation of a Kanban manager (at this moment, just only manages Board entity with id and name attributes)
  <br />
  <br />
  The main objective of this implementation is to use Laravel as backend framework but instead of using MVC architecture, go for DDD and Hexagonal. 
  <br />
  <br />
  <a href="https://github.com/mguinea/laravel-ddd-example/issues">Report a bug</a>
  ·
  <a href="https://github.com/mguinea/laravel-ddd-example/issues">Request a feature</a>
</p>

<p align="center">
    <a href="https://github.com/mguinea/laravel-ddd-example/actions"><img src="https://github.com/mguinea/laravel-ddd-example/actions/workflows/php.yml/badge.svg" alt="CI pipeline status" /></a>
</p>

## Installation

### Requirements
- [Install Docker](https://www.docker.com/get-started)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

### Environment

- Clone this project: `git clone https://github.com/mguinea/laravel-ddd-example laravel-ddd-example`
- Move to the project folder: `cd laravel-ddd-example`

### Execution

Install all the dependencies and bring up the project with Docker executing:

`make build`\
`make up`\
`make migrate`
    
Then you'll have 1 app available (an API):

- Kanban API: http://localhost:8080/api/v1/kanban/health-check

### API Documentation

Open API documentation [here](./kanban-api-endpoints.yaml)

Postman API collection [here](./kanban-api-endpoints.postman.json)

### Tests

Execute all test suites: `make tests`

## Project structure and explanation

### Root Folders

#### apps

Here are our implementations of the code we have in our base (src). Here can be any framework, etc...

#### etc

`etc` is for "Editable Text Configurations". So here we can put any configuration by xml, yaml etc... like Docker setup.

#### src

`src` is for "Source". Here we put all our code base being as independent as possible of any implementation (except is there is in `infrastructure` subfolder).

### Bounded contexts

Kanban: Place where the main functionality is implemented. Management of boards...

### Architecture and Structure

This repository follows the Hexagonal Architecture pattern. Also, it's structured using modules. With this, we can see that the current structure:

*Kanban bounded context* containing *Board module* and *Shared bonded context*.

```
$ tree -L 3 src

src
├── Kanban
│   └── Board
│       ├── Application
│       ├── Domain
│       └── Infrastructure
└── Shared
    ├── Domain
    │   ├── Aggregate
    │   └── Bus
    └── Infrastructure
        └── Bus
```

#### Repositories

Repository pattern

Our repositories try to be as simple as possible usually only containing basic CRUD methods (delete, find, save and list using criteria pattern).

#### CQRS

Symfony Messenger has been used to implement commands, queries and events.

## Infrastructure

### RabbitMQ

There is a service with RabbitMQ to manage queues. You can access it going to ` http://localhost:15672` and using `guest` as username and password.

## References

- [Bash best practices](https://gist.github.com/leolorenzoluis/0aad69719267536d0b7a79946edbfcb7)
- [DDD Concepts](https://www.isaqb.org/blog/ddd-confusion-bounded-subdomain-context-module-or-what/)
- [Ansible best practices](https://docs.ansible.com/ansible/2.8/user_guide/playbooks_best_practices.html#content-organization)
- [Terraform first steps](https://www.adictosaltrabajo.com/2020/06/19/primeros-pasos-con-terraform-crear-instancia-ec2-en-aws/)
- [Jenkins in Docker](https://appinventiv.com/blog/jenkins-installation-using-docker-compose/)
- https://stackoverflow.com/questions/59643458/dockerfile-install-amqp-failed
