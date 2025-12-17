# GitShip

- [GitShip](#gitship)
  - [System Architecture](#system-architecture)
    - [MQ Deploy Payload Format](#mq-deploy-payload-format)

## System Architecture

![Architecture Diagram](./docs/diagrams/architecture.drawio.svg)

- **User:** The End User
- **DNS:** The Domain Server
- **Reverse Proxy:** Custom Reverse Proxy to redirect users to specific app
- **Control Node:** Handles the server like Authentication/Deploy/View Logs etc.
- **Deploy Node:** Reads from the Message Queue and start deploying docker container to Docker Machine
- **Logger Node:** Reads Logs from Docker Machine and then store it in storage

### MQ Deploy Payload Format

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

> The `image` and `port` is required field
