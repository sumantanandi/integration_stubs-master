var test = require('tape');
var request = require('supertest');
var app = require('../app');
var _ = require('underscore');

var cli = require('../app/libs/cli');
var args = cli.args();

console.log('testing  - ', args);

// add in each of the test suites here

_.each(args.parts, (key) => {
  switch (key) {
    case "apps":
      var appsTest = require('./apps');
      break;
    case "ping":
      var pingTest = require('./ping');
      break;
    default:
      var appsTest = require('./apps');
      var pingTest = require('./ping');
  }
});

test.onFinish(function() {
  process.exit(0);
});
