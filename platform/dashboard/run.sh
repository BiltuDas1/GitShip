#!/bin/sh
# Installs and runs the development server in the docker container
set -e

pnpm install --package-import-method copy
exec pnpm run dev
