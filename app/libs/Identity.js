'use strict';

var url = require('url');

var testapplication = require('./societyclient');

testapplication.sendMessage("API Call");

testapplication.sendMessage = function sendMessage(name) {
	console.log("hello " + name);
}

exports.submitApplication = function (applicationNumber) {
	testapplication.sendMessage(applicationNumber);
}

/*
testapplication.sendMessage("test").then(function(resp) {
console.log("test call");
}
).catch(function(err) {
console.log("test error call");
}
*/