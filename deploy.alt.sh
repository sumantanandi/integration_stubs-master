#!/bin/bash
#

# build the docker containers
sudo docker-compose -f docker-compose.yml -f docker-compose.alt.yml build app

# start the stack
sudo docker-compose -f docker-compose.yml -f docker-compose.alt.yml up -d
