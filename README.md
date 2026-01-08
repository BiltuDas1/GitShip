# GitShip

- [GitShip](#gitship)
  - [Overview](#overview)
  - [Features](#features)
  - [System Architecture](#system-architecture)
  - [Prerequesting](#prerequesting)
  - [Installation and Quick Start](#installation-and-quick-start)
    - [Control Node (Python)](#control-node-python)
    - [Infrastructure (Go)](#infrastructure-go)
    - [Dashboard (React)](#dashboard-react)
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
- **Reverse Proxy:** Reverse Proxy to redirect users to specific app
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

These are the following softwares that need to install in order to work:

- **Docker**: To manage and run containerize applications
- **RabbitMQ**: Used as a Message Broker for deployment orchestration
- **PostgreSQL**: The primary database for storing user information
- **Go**: For the infrastructure services (Deployer and Logger)
- **Python**: For the control node backend
- **Node.js**: For the Dashboard

## Installation and Quick Start

### Control Node (Python)

1. Navigate to the control directory: `platform/control`
2. Install dependencies: `poetry install --no-root --only main`
3. Start the API: `uvicorn main:app`

### Infrastructure (Go)

1. Navigate to the infrastructure directory: `infrastructue`
2. Build the deployer: `go build -o deployer ./cmd/deployer`
3. Build the logger: `go build -o logger ./cmd/logger`

### Dashboard (React)

1. Navigate to the dashboard directory: `platform/dashboard`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## Project Structure

```
GitShip/
├── docs/                                   # Project documentation
│   └── diagrams/                           # Architectural diagrams
│       └── architecture.drawio.svg         # SVG architecture diagram
├── infrastructure/                         # Go-based backend services
│   ├── cmd/                                # Main applications
│   │   ├── deployer/                       # Deployment worker node
│   │   │   ├── deploy.go                   # Logic for container deployment
│   │   │   ├── Dockerfile                  # Containerization for the deployer
│   │   │   └── main.go                     # Entry point for the deployer
│   │   └── logger/                         # Real-time logging service
│   │       ├── ingest.go                   # Log ingestion logic
│   │       ├── init.go                     # Logger initialization
│   │       ├── log.go                      # Log retrieval logic
│   │       └── main.go                     # Entry point for the logger
│   ├── internal/                           # Internal Go packages
│   │   ├── middleware/                     # API middlewares (Auth, Ingestion)
│   │   │   ├── auth_middleware.go          # Authentication logic
│   │   │   └── ingest_middleware.go        # Ingestion validation
│   │   ├── models/                         # Internal data structures
│   │   │   └── deploy_payload.go           # Deployment message schema
│   │   └── utils/                          # Common Go utilities
│   │       ├── error.go                    # Standardized error handling
│   │       └── jwt.go                      # JSON Web Token utilities
│   ├── pkg/                                # Reusable Go libraries
│   │   ├── docker/                         # Docker Engine interactions
│   │   │   ├── conf.go                     # Docker configuration
│   │   │   ├── env.go                      # Container environment setup
│   │   │   ├── init.go                     # Docker client initialization
│   │   │   ├── pull.go                     # Logic to pull images
│   │   │   └── run.go                      # Logic to start containers
│   │   ├── environ/                        # Environment variable management
│   │   │   └── environment.go              # Utility to load environment configs
│   │   ├── progressbar/                    # UI utilities
│   │   │   └── braille_progress.go         # Terminal progress bar implementation
│   │   └── term/                           # Terminal formatting
│   │       └── printer.go                  # Styled terminal output
│   ├── env.json                            # Environment variable definitions
│   ├── go.mod                              # Go module definition
│   └── go.sum                              # Go dependency checksums
└── platform/                               # Web-based management platform
    ├── control/                            # Python FastAPI central hub
    │   ├── core/                           # Core configuration and settings
    │   │   ├── debug.py                    # Debug mode settings
    │   │   ├── environ.py                  # Environment variable loader
    │   │   └── settings.py                 # FastAPI and ORM settings
    │   ├── exceptions/                     # Custom exception handlers
    │   │   ├── dbconnection.py             # Database connection errors
    │   │   └── validation.py               # Pydantic validation errors
    │   ├── models/                         # Database ORM models
    │   │   ├── __init__.py                 # Models package entry
    │   │   └── user.py                     # User account schema
    │   ├── routers/                        # API route definitions
    │   │   └── authRoutes.py               # Authentication endpoints
    │   ├── schemas/                        # Pydantic data schemas
    │   │   └── authSchema.py               # Login/Register request schemas
    │   ├── services/                       # Business logic layer
    │   │   └── register.py                 # User registration service
    │   ├── utils/                          # Python helper utilities
    │   │   ├── status/                     # Standardized API responses
    │   │   │   ├── __init__.py             # Status package entry
    │   │   │   ├── response.py             # JSON response formatter
    │   │   │   └── resultcode.py           # API status codes
    │   │   ├── password.py                 # Password hashing utilities
    │   │   └── security.py                 # JWT generation/validation
    │   ├── main.py                         # Entry point for the Control Node
    │   ├── poetry.lock                     # Python dependency lockfile
    │   ├── pyproject.toml                  # Python project configuration
    │   └── ruff.toml                       # Python linter (Ruff) config
    └── dashboard/                          # React + Vite frontend
        ├── src/                            # Frontend source code
        │   ├── App.tsx                     # Main React component
        │   └── main.tsx                    # Application entry point
        ├── .gitignore                      # Dashboard-specific git ignores
        ├── eslint.config.js                # Frontend linting config
        ├── index.html                      # HTML root template
        ├── package-lock.json               # NPM dependency lockfile
        ├── package.json                    # NPM project configuration
        ├── tsconfig.app.json               # TypeScript app config
        ├── tsconfig.json                   # TypeScript base config
        ├── tsconfig.node.json              # TypeScript Node config
        └── vite.config.ts                  # Vite build configuration
```

## Configuration

### Environment Variables

| Variable         | Description                                   | Component       |
| ---------------- | --------------------------------------------- | --------------- |
| `RABBITMQ_URI`   | Connection string for the message broker      | Deployer        |
| `POSTGRESQL_URI` | Connection string for the PostgreSQL database | Control Node    |
| `LOGGER_SECRET`  | Secret key for authenticating log ingestion   | Deployer/Logger |

## Technical Specifications

- **Control Node**: Built with FastAPI, Tortoise ORM (async), and Pydantic for schema validation.
- **Infrastructure**: Built with Go, utilizing Gin for the logger API and AMQP for message queuing.
- **Concurrency**: The Deployer uses a semaphore pattern to limit simultaneous deployment operations to 3 concurrent routines.
- **Frontend**: Built with React and TypeScript.

## Development Workflow

1. **Environment Setup**: Ensure Docker and RabbitMQ are running locally.
2. **Database Migration**: The Control Node is configured to automatically generate schemas when in debug mode.
3. **Service Orchestration**: Start the RabbitMQ server, followed by the Control Node, then at least one Deployer worker.
4. **Logging**: Use the Logger service to stream container logs.

## Licensing

The Project is Licensed under [MIT License](./LICENSE)
