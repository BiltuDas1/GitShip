#!/bin/sh
# Installs and runs the development server in the docker container

if [ ! -d "node_modules" ]; then 
  npm install
fi

npm run dev