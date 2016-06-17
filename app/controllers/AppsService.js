'use strict';

var url = require('url');

var App = require('../models/App');

var events = require("events");
var swaggerHelpers = require('../libs/swagger-helpers');
var cryptoHelpers = require('../libs/crypto-helpers');
var societyclient = require('../libs/societyclient');
var logger = require("loglevel");
var EventEmitter = require('events').EventEmitter;

// When we submit an appication it can take a long time
var submitApplicationProcess = new EventEmitter();

/**
 * Offline processing of an application should be handled here. Ensure that the
 * processing status is updated when you are done.
 */
submitApplicationProcess.on('submit-application', function (application) {
  
  societyclient.sendMessage(application.data.id);
});

module.exports.registerApp = function registerApp(req, res, next) {
  var app = req.swagger.params.body.value;

  logger.debug(app);
  //console.log(app);

  // any transforms should go here
  // var newApp = new App({
  //   id: app.data.name,
  //   content: app.data.email,
  //   notificationType: app.data.email,
  //   partnerCode: app.data.email
  // });

  // we also need to generate a clientSecret based on

  // newApp.save(function (err, savedApp) {
  //   if (err) {
  //     swaggerHelpers.processError(err, req, res, next);
  //   }
  //   else {
  //     swaggerHelpers.sendResponse(201, { data: savedApp }, req, res);
  //   }
  // });

  //emit sync response
  swaggerHelpers.sendResponse(201, app, req, res);
  //then emit save application to PG
  submitApplicationProcess.emit('submit-application', app);


}