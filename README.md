# GitShip

- [GitShip](#gitship)
  - [Overview](#overview)
  - [Features](#features)
  - [System Architecture](#system-architecture)
  - [Prerequesting](#prerequesting)
  - [Installation and Quick Start](#installation-and-quick-start)
  - [Project Structure](#project-structure)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)
  - [Technical Specifications](#technical-specifications)
  - [Development Workflow](#development-workflow)
  - [Licensing](#licensing)

## Overview

GitShip is a lightweight, distributed orchestration platform designed to simplify the lifecycle of containerized applications. It provides a unified control plane to manage deployments, monitoring, and logging across a cluster of Docker machines.

Unlike traditional platforms that rely solely on pre-built images, GitShip offers a flexible deployment pipeline that supports two primary sources:

- Docker Registry Deployment: Pull and run standardized images directly from any public or private Docker registry.

- Git-to-Container Deployment: Deploy directly from GitHub or other Git repositories. GitShip automatically handles the process of fetching the source code, building the environment, and launching the containerized application.

## Features

- Hybrid Deployment Sources: Choose between deploying optimized production images from a registry or triggering builds directly from your Git source code.
- Distributed Architecture: Optimized for scalability with dedicated Control, Deploy, and Logger nodes to ensure high availability and separation of concerns.
- Automated Infrastructure:
  - Control Node: A central management hub for authentication, deployment orchestration, and log viewing.
  - Deploy Node: An autonomous worker that consumes tasks from a Message Queue to provision containers on remote Docker machines.
  - Logger Node: A real-time ingestion service that streams and stores logs from active containers for easy debugging.
- Dynamic Reverse Proxy: Automatically routes user traffic to the correct deployed application based on custom configurations.
- Message-Driven Orchestration: Uses a standardized MQ payload format to ensure reliable communication between the control plane and deployment workers.

## System Architecture

![Architecture Diagram](./docs/diagrams/architecture.drawio.svg)

- **User:** The End User
- **DNS:** The Domain Server
- **Reverse Proxy:** Custom Reverse Proxy to redirect users to specific app
- **Control Node:** Handles the server like Authentication/Deploy/View Logs etc.
- **Deploy Node:** Reads from the Message Queue and start deploying docker container to Docker Machine
- **Logger Node:** Reads Logs from Docker Machine and then store it in storage

<!-- ### MQ Deploy Payload Format

The Payload which will be provided to Docker Deploy Service to deploy container

```json
{
  "image": "helloworld:latest",
  "environments": {
    "DEBUG": "true"
  },
  "port": 8080,
  "cmd": "python helloworld.py"
}
```

> The `image` and `port` is required field -->

## Prerequesting

## Installation and Quick Start

## Project Structure

## Configuration

### Environment Variables

## Technical Specifications

## Development Workflow

## Licensing

The Project is Licensed under [MIT License](./LICENSE)
