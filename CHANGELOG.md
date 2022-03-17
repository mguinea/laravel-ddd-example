# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- Add possible error responses to endpoints in swagger
- Prometheus & Graphana installed and configured to monitor app (alerts to slack?)
- Setup ELK
- Kafka to manage queues (pub/sub pattern) or RabbitMQ or SQS/SNS
- Usage of MMOCK at some point to mock a third party integration
- Better CI pipelines using Github actions and Circle CI
- Functional tests pointing to swagger definition
- After deciding infra provider, setup Terraform, Ansible and Spinnaker
- Kubernetes environment
- Implement criteria pattern to make searches in repositories

## [0.0.0] - 2022-03-17
### Added
- Docs folder with swagger definition of kanban-api endpoints
