#!/bin/sh
# Installs and runs the development server in the docker container

poetry install --no-root
poetry run fastapi dev --host 0.0.0.0
