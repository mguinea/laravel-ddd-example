<h1 align="center">
  Hexagonal Architecture, DDD & CQRS in Laravel PHP
</h1>

<p align="center">
    <a href="https://laravel.com/"><img src="https://img.shields.io/badge/Laravel-8-FF2D20.svg?style=flat-square&logo=laravel" alt="Laravel 8"/></a>
    <!--<a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-2-4FC08D.svg?style=flat-square&logo=vue.js" alt="Vue.js"/></a>-->
    <!--<a href="https://nuxtjs.org/"><img src="https://img.shields.io/badge/Nuxt-2-00C58E.svg?style=flat-square&logo=nuxt.js" alt="Nuxt.js"/></a>-->
    <!--<a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-2-38B2AC.svg?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"/></a>-->
    <a href="https://www.php.net/"><img src="https://img.shields.io/badge/PHP-8-777BB4.svg?style=flat-square&logo=php" alt="PHP"/></a>
    <a href="https://www.jetbrains.com/es-es/phpstorm/?ref=steemhunt"><img src="https://img.shields.io/badge/PhpStorm-2021-000000.svg?style=flat-square&logo=phpstorm" alt="PhpStorm"/></a>
    <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/docker-3-2496ED.svg?style=flat-square&logo=docker" alt="Docker"/></a>
    <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/mysql-5.7-4479A1.svg?style=flat-square&logo=mysql" alt="MySql"/></a>
    <a href="https://circleci.com/gh/mguinea/laravel-ddd-example/tree/master"><img src="https://circleci.com/gh/mguinea/laravel-ddd-example/tree/master.svg?style=svg" alt="CircleCI"/></a>
    <a href="https://github.com/mguinea/laravel-ddd-example/actions"><img src="https://github.com/mguinea/laravel-ddd-example/actions/workflows/php.yml/badge.svg" alt="GithubActions"/></a>
</p>

<p align="center">
  This is a monorepo containing a <strong>PHP application using Domain-Driven Design (DDD) and Command Query Responsibility Segregation
  (CQRS) principles</strong>. It also has a front in <strong>Vue.js and Nuxt.js</strong> (TBD).
  <br />
  <br />
  It's a basic implementation of a Kanban manager (at this moment, just only manages Board entity; not columns or tasks)
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
    <a href="https://github.com/mguinea/laravel-ddd-example/actions"><img src="https://github.com/mguinea/laravel-ddd-example/workflows/CI/badge.svg" alt="CI pipeline status" /></a>
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

`composer build`\
`composer migrate`

and run containers:

`composer up`

    
Then you'll have 2 apps available (1 API and 1 Frontend):

1. Kanban API: http://localhost:8080/api/v1/kanban/health-check
2. Kanban Frontend: TBD

### Tests

Execute all test suites: `composer tests`

## Project structure and explanation

### Root Folders

#### apps

Here are our implementations of the code we have in our base (src). Here can be any framework, etc...

#### etc

`etc` is for "Editable Text Configurations". So here we can put any configuration by xml, yaml etc... like Docker setup.

#### src

`src` is for "Source". Here we put all our code base being as independent as possible of any implementation (except is there is in `infrastructure` subfolder).

The main idea is to use this as our **pure** code, with no vendor 

### Bounded contexts

Kanban: Place where the main functionality is implemented. Management of boards, columns, tasks...

### Architecture and Structure

This repository follows the Hexagonal Architecture pattern. Also, it's structured using modules. With this, we can see that the current structure:

*Kanban bounded context* containing *Board module* and *Shared bonded context*.

```scala
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

Our repositories try to be as simple as possible usually only containing basic CRUD methods (delete, find, save and list).

#### CQRS

Symfony Messenger has been used to implement commands, queries and events.

## References

- [Bash best practices](https://gist.github.com/leolorenzoluis/0aad69719267536d0b7a79946edbfcb7)
