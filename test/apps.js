var test = require('tape');

var request = require('supertest');
var app = require('../app');
var http = require('http');

var assert = require('assert');

// test.skip(name, cb)

test('reset test app registration', function (t) {
  // does the test profile exist already?
  request(app)
    .delete('/api/v0/app/Test')
    .end(function(err, res) {
      t.error(err, 'test app deleted');
      t.end();
    });

});


test('register test app and then authenticate', function (t) {

  var newApp = { data: {
    name: "Test",
    email: "test@test.com"
    }
  };

  request(app)
    .post('/api/v0/app')
    .send(newApp)
    .expect(201)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      t.error(err, 'test app created');

      console.log(res.body);

      var secret = res.body.data.secret;
      var appKey = res.body.data.appKey;

      var authRequest = {
        appKey: appKey,
        appSecret: secret
      };

      request(app)
        .post('/api/v0/app/authenticate')
        .send(authRequest)
        .expect(200)
        .end(function(err, res) {
          t.error(err, 'test app authenticated');


          t.end();
        });
    });
});
