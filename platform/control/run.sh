#!/bin/sh
# Installs and runs the development server in the docker container

if [ ! -d ".venv" ]; then
  poetry install
fi

poetry run fastapi dev --host 0.0.0.0