<h1 align="center">
  Hexagonal Architecture, DDD & CQRS in Laravel PHP
</h1>

<p align="center">
    <a href="https://laravel.com/"><img src="https://img.shields.io/badge/Laravel-8-FF2D20.svg?style=flat-square&logo=laravel" alt="Laravel 8"/></a>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-2-4FC08D.svg?style=flat-square&logo=vue.js" alt="Vue.js"/></a>
    <a href="https://nuxtjs.org/"><img src="https://img.shields.io/badge/Nuxt-2-00C58E.svg?style=flat-square&logo=nuxt.js" alt="Nuxt.js"/></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-2-38B2AC.svg?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"/></a>
    <a href="https://www.php.net/"><img src="https://img.shields.io/badge/PHP-7-777BB4.svg?style=flat-square&logo=php" alt="PHP"/></a>
    <a href="https://www.jetbrains.com/es-es/phpstorm/?ref=steemhunt"><img src="https://img.shields.io/badge/PhpStorm-2021-000000.svg?style=flat-square&logo=phpstorm" alt="PhpStorm"/></a>
    <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/docker-3-2496ED.svg?style=flat-square&logo=docker" alt="Docker"/></a>
    <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/mysql-8-4479A1.svg?style=flat-square&logo=mysql" alt="MySql"/></a>
    <a href="https://www.sqlite.org/index.html"><img src="https://img.shields.io/badge/sqlite-3-003B57.svg?style=flat-square&logo=sqlite" alt="SQLite"/></a>
    <a href="#"><img src="https://img.shields.io/badge/github_actions-2088FF.svg?style=flat-square&logo=github-actions" alt="Github Actions"/></a>
</p>

<p align="center">
  This is a monorepo containing a <strong>PHP application using Domain-Driven Design (DDD) and Command Query Responsibility Segregation
  (CQRS) principles</strong>. It also has a front in <strong>Vue.js and Nuxt.js</strong>.
  <br />
  <br />
  It's a basic implementation of a Kanban manager (at this moment, just only manages Board entity; not columns or tasks)
  <br />
  <br />
  <a href="https://github.com/mguinea/laravel-ddd-example/issues">Report a bug</a>
  ·
  <a href="https://github.com/mguinea/laravel-ddd-example/issues">Request a feature</a>
</p>

<p align="center">
    <a href="https://github.com/mguinea/laravel-ddd-example/actions"><img src="https://github.com/mguinea/laravel-ddd-example/workflows/CI/badge.svg" alt="CI pipeline status" /></a>
</p>

## Installation

### Requirements 
- [Install Docker](https://www.docker.com/get-started)

### Environment

- Clone this project: `git clone https://github.com/mguinea/laravel-ddd-example laravel-ddd-example`
- Move to the project folder: `cd laravel-ddd-example`
- Create a local environment file `cp .env.dist .env`

### Execution

Install all the dependencies and bring up the project with Docker executing: `make install`
    
Then you'll have 2 apps available (1 API and 1 Frontend):
1. Kanban API: http://localhost:8180/api/v1/kanban/health-check
2. Kanban Frontend: TBD

### Tests

Install the dependencies if you haven't done it previously: `make composer-install`

Execute all test suites: `make tests`

## Monitoring

TODO

## Project structure and explanation

### Bounded contexts

Kanban: Place where the main functionality is implemented. Management of boards, columns, tasks...

### Architecture and Structure

This repository follows the Hexagonal Architecture pattern. Also, it's structured using modules. With this, we can see that the current structure of a Bounded Context is:

```scala
$ tree -L 4 src

src
├── Kanban
│   ├── Board
│   │   ├── Application
│   │   │   ├── BoardResponse.php
│   │   │   ├── BoardsResponse.php
│   │   │   ├── Create
│   │   │   ├── Delete
│   │   │   ├── Get
│   │   │   ├── Search
│   │   │   └── Update
│   │   ├── Domain
│   │   │   ├── BoardAlreadyExists.php
│   │   │   ├── BoardId.php
│   │   │   ├── BoardName.php
│   │   │   ├── BoardNotFound.php
│   │   │   ├── Board.php
│   │   │   ├── BoardRepository.php
│   │   │   └── Boards.php
│   │   └── Infrastructure
│   │       ├── Laravel
│   │       └── Persistence
│   └── Shared
│       └── Infrastructure
│           └── Laravel
└── Shared
    ├── Domain
    │   ├── Aggregate
    │   │   └── AggregateRoot.php
    │   ├── Bus
    │   │   ├── Command
    │   │   ├── Event
    │   │   └── Query
    │   ├── CollectionInterface.php
    │   ├── Collection.php
    │   ├── Criteria
    │   │   ├── Criteria.php
    │   │   ├── FilterField.php
    │   │   ├── FilterOperator.php
    │   │   ├── Filter.php
    │   │   ├── Filters.php
    │   │   ├── FilterValue.php
    │   │   ├── OrderBy.php
    │   │   ├── Order.php
    │   │   └── OrderType.php
    │   ├── DomainException.php
    │   └── ValueObject
    │       ├── EnumValueObject.php
    │       ├── StringValueObject.php
    │       └── UuidValueObject.php
    └── Infrastructure
        ├── Bus
        │   └── Laravel
        ├── InfrastructureException.php
        └── Laravel
            └── SharedServiceProvider.php

```

#### Repositories

Repository pattern

Our repositories try to be as simple as possible usually only containing basic CRUD methods (delete, find, save and search). 
If we need some query with more filters we use the Specification pattern also known as Criteria pattern. So we add a `search` method.

#### CQRS

Laravel Job has been used to implement commands, queries and events.

#### My conventions

There are some opinionated resolutions / approaches in this project.

##### Generic methods (CRUDs)

> `get` retrieve an entity. If not found, throw an exception.

> `find` retrieve an entity. If not found, return null.

> `delete` delete an entity. If not found, throw an exception.

> `create` create an entity. If found, throw an exception.

> `update` update an entity. If not found, throw an exception.

> `search` retrieve a collection of entities by criteria. If nothing found, returns an empty collection.

> `listing` retrieve a collection of entities with no criteria. If nothing found, returns an empty collection.


