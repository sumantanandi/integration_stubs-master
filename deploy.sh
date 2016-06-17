#!/bin/bash
#
# blue/green deployment script

# set the name of the application (this must be unique)
APP=integration_stubs

######################################
# DON'T MODIFY BELOW
######################################

# setup front and back end for this application
curl -L -s http://3.149.12.5:2379/v2/keys/vulcand/backends/$APP-blue/backend -XPUT -d value='{"Type": "http"}'
curl -L -s http://3.149.12.5:2379/v2/keys/vulcand/backends/$APP-blue/servers/blue -XPUT -d value='{"URL": "http://app-blue:80"}'

curl -L -s http://3.149.12.5:2379/v2/keys/vulcand/backends/$APP-green/backend -XPUT -d value='{"Type": "http"}'
curl -L -s http://3.149.12.5:2379/v2/keys/vulcand/backends/$APP-green/servers/green -XPUT -d value='{"URL": "http://app-green:80"}'


# start the loadbalancer
sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d lb

# build the docker container
sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml build app

# determine the next colour
if curl -L -s http://3.149.12.5:2379/v2/keys/BG/$APP/blue | grep "Key not found" > /dev/null
then
  echo "current colour is green, setting next colour to blue"
  COLOUR=green
  NEXTCOLOUR=blue
else
  echo "current colour is blue, setting next colour to green"
  COLOUR=blue
  NEXTCOLOUR=green
fi

# start the app with the next colour
sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop app-$NEXTCOLOUR
sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml rm -f app-$NEXTCOLOUR
sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d app-$NEXTCOLOUR

# delay for x seconds to allow docker to propagate dns entries
sleep 5

# set the next colour in etcd
curl -L -s http://3.149.12.5:2379/v2/keys/vulcand/frontends/$APP/frontend -XPUT -d value='{"Type": "http", "BackendId": "'"$APP-$NEXTCOLOUR"'", "Route": "PathRegexp(`/.*`)"}'
curl -L -s http://3.149.12.5:2379/v2/keys/BG/$APP/$NEXTCOLOUR -XPUT -d value='{"status": "check the vulcand key for the real value"}'
