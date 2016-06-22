'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
console.log("Before app require");
const app = require('./app');
console.log("After app require");
const config = require('./config/config');

/**
 * This badly needs some comments as it is some sort of witchcraft.
 */
http.createServer((req, res) => {
  var location = "https://" + config.https.address + ":" + config.https.port + req.url;
  res.writeHead(301, { "Location": location });
  res.end();
}).listen(config.http.port, () => {
  console.log('server listening on http://%s:%d', config.http.address, config.http.port);
});

const options = {
  key: fs.readFileSync('./config/certs/key.pem'),
  cert: fs.readFileSync('./config/certs/cert.pem')
};

https.createServer(options, app).listen(config.https.port, () => {
  console.log('server listening on https://%s:%d', config.http.address, config.https.port);
});

process.on('uncaughtException', (exception) => {
  console.error(exception);
  // ToDo email on failure
})
