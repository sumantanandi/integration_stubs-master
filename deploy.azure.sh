#!/bin/bash
#

# build the docker containers
sudo docker-compose -f docker-compose.yml -f docker-compose.azure.yml build app

# start the stack
sudo docker-compose -f docker-compose.yml -f docker-compose.azure.yml up -d
