'use strict';

var connect = require('connect');
var db = require('./db');
var swaggerTools = require('swagger-tools');
var swaggerHelpers = require('./libs/swagger-helpers');
var cryptoHelpers = require('./libs/crypto-helpers');
var jsyaml = require('js-yaml');
var fs = require('fs');
var morgan = require('morgan');
var _ = require('underscore');
var api = require('./api');
var requestIp = require('request-ip');

var serveStatic = require('serve-static');

var config = require('../config/config');

var cli = require('./libs/cli');
var args = cli.args();

console.log('running with options - ', args);

/**
* The Swagger runtime is modularised here to allow easier testing and
* sharing across different systems.
*/
var app = connect();

// log all request to console
app.use(morgan('short'));

// test for
app.use((req, res, next) => {
  if (config.label == 'prod') {
    if (_.contains(config.whitelist, requestIp.getClientIp(req))) {
      // whitelisted IP address for when running in Production
      next();
    }
    else {
      res.statusCode = '403';
      res.end('{ "error": "access is restricted to known clients" }');
    }
  }
  else {
    // continue to next middleware if authorised
    next();
  }
})

// swaggerRouter configuration
var options = {
  swaggerUi: '/swagger.json',
  controllers: './app/controllers',
  swaggerUiDir: __dirname + "/dist",
  useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};

// read in the parts of the swagger spec
var components = api.readSpec();

// now combine them into a complete document
var spec = components.info;
// load paths
for (var key in components.parts) {
  if (args.parts && (_.indexOf(args.parts, key) > -1 || args.parts[0] === "all"))
    spec += components.parts[key].path
}

// these elements must be include in any app
spec += components.errors + components.common;

// load definitions
for (var key in components.parts) {
  if (args.parts && (_.indexOf(args.parts, key) > -1 || args.parts[0] === "all"))
    spec += components.parts[key].defn
}

spec += components.security;

// fs.writeFileSync('swagger.yaml',spec);

var swaggerDoc = jsyaml.safeLoad(spec);

// console.log(spec);

// to see what the combined yaml looks like uncomment the below
//swaggerHelpers.convertYaml('./app/api/swagger.json', swaggerDoc);

// Start the server
var serverPort = config.https.port;
var serverAddress = config.https.address;

if (serverAddress && serverPort) {
  swaggerDoc.host = serverAddress + ':' + serverPort;
}

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Provide the security handlers
  app.use(middleware.swaggerSecurity({
    appToken: cryptoHelpers.checkSessionToken,
    userToken: cryptoHelpers.checkSessionToken,
    paymentToken: cryptoHelpers.checkPaymentToken
  }));

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi({
    apiDocs: '/api-docs',
    swaggerUi: '/docs',
    swaggerUiDir: __dirname + '/dist'}
  ));
});

// redirect errors to a helper that sends a conformant error status
// and content.
//
app.use(function (err, req, res, next) {
  swaggerHelpers.processError(err, req, res, next);
});


module.exports = app;
