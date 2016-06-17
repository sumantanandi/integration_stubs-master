var test = require('tape');
var request = require('supertest');
var app = require('../app');

test('ping test', function(t) {
  request(app)
    .get('/api/v0/ping')
    //.set('x-app-token', 'latitude')
    .expect(200)
    .expect({ message: 'server running' })
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      t.error(err, 'No error');
      t.end();
    });
});
