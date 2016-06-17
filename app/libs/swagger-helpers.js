'use strict';

var http = require('http');
var fs = require('fs');

// utility functions to make working withh swagger easier.
//
module.exports.processError = function processError(err, req, res, next) {
  if (typeof err !== 'object') {
    // If the object is not an Error, create a representation that appears to be
    err = {
        message: String(err) // Coerce to string
    };
  } else {
    // Ensure that err.message is enumerable (It is not by default)
    Object.defineProperty(err, 'message', { enumerable: true });
  }
  console.error(err);
  switch (err.name) {
    case 'MongoError':
      res.statusCode = 400;
      if (err.code === 11000 || err.code === 11001)
        res.statusCode = 409;
      break;

    case 'MongooseError':
      res.statusCode = 400;
      break;

    case 'SyntaxError':
      res.statusCode = 400;
      break;

    default:
      res.statusCode = 400;
      break;

  }
  // Return a JSON representation of #/definitions/errors
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ errors: [ err ] }));
};

module.exports.sendResponse = function sendResponse(statusCode, obj, req, res) {
  res.statusCode = statusCode;
  switch (statusCode) {
    case 200:
    case 201:
    case 409:
    case 500:
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(obj || {}, null, 2));
      break;

    case 202:
    case 204:
      res.end();
      break;

    case 400:
    case 404:
    default:
      res.setHeader('Content-Type', 'application/json');
      var err = { status: statusCode, message: http.STATUS_CODES[statusCode] };
      res.end(JSON.stringify({ errors: [ err ] }, null, 2));
      break;
  }
}

/**
 * Create a response object instance given the passed result instance and the
 * current request and response context.
 */
module.exports.createResponseObject = function createResponseObject(doc, req, res) {
  // take the object passed and place it in return structure adding links and
  // references as required
  var host = req.swagger.swaggerObject.host + req.swagger.swaggerObject.basePath;
  return { data: _addLinksForType(doc.toJSON(), host + req.url) };
}

/**
 * Add the links appropriate for each type. Should be done with a callback
 * but this will do for now.
 */
function _addLinksForType(obj, urlPath) {
  // strip the id from the path if it is going to duplicate
  if (urlPath.endsWith(obj.id)) {
    urlPath = urlPath.slice(0, obj.id.length + 1);
  }

  _addLink(obj, 'self', urlPath + "/" + obj.id);

  if (obj.type === 'Account') {
    _addLink(obj, 'delete', urlPath + "/" + obj.id, 'DELETE');
    _addLink(obj, 'update', urlPath + "/" + obj.id, 'PUT');
    if (obj.applicationId) {
      _addLink(obj, 'application', urlPath + "/" + obj.applicationId);
    }
    if (obj.profileId) {
      _addLink(obj, 'profile', urlPath + "/" + obj.profileId);
    }
  }
  if (obj.type === 'Application') {
    _addLink(obj, 'submit', urlPath + "/" + obj.id + '/submit');
    _addLink(obj, 'delete', urlPath + "/" + obj.id, 'DELETE');
    _addLink(obj, 'update', urlPath + "/" + obj.id, 'PUT');
  }
  if (obj.type === 'Document') {
    _addLink(obj, 'update', urlPath + "/" + obj.id, 'PUT');
    _addLink(obj, 'content', urlPath + "/" + obj.id + '/content');
    if (obj.applicationId) {
      _addLink(obj, 'application', urlPath + "/" + obj.applicationId);
    }
    if (obj.profileId) {
      _addLink(obj, 'profile', urlPath + "/" + obj.profileId);
    }
  }
  if (obj.type === 'Message') {
    _addLink(obj, 'delete', urlPath + "/" + obj.id, 'DELETE');
    if (obj.profileId) {
      _addLink(obj, 'profile', urlPath + "/" + obj.profileId);
    }
  }
  if (obj.type === 'Profile') {
    _addLink(obj, 'delete', urlPath + "/" + obj.id, 'DELETE');
    _addLink(obj, 'update', urlPath + "/" + obj.id, 'PUT');
    _addLink(obj, 'accounts', urlPath + "/" + obj.id + "/accounts");
    _addLink(obj, 'messages', urlPath + "/" + obj.id + "/messages");
  }
  if (obj.type === 'Offer') {
    _addLink(obj, 'delete', urlPath + "/" + obj.id, 'DELETE');
    _addLink(obj, 'update', urlPath + "/" + obj.id, 'PUT');
    if (obj.profileId) {
      _addLink(obj, 'profile', urlPath + "/" + obj.profileId);
    }
  }
  return obj;
}

/**
 * Create a response array of conforming format.
 */
module.exports.createResponseArray = function createResponseArray(objArray, req, res) {
  var swaggerObject = req.swagger.swaggerObject;
  var urlPath = /* swaggerObject.host + */swaggerObject.basePath + req.swagger.apiPath;
  // take the object passed and place it in return structure adding links and
  // references as required
  var data = [];
  for (var i = 0; i < objArray.length; i++) {
    var obj = objArray[i].toJSON();
    data.push(_addLinksForType(obj, urlPath));
  }

  var result = { data: data };

  // add the array self links as well as next and last

  var baseUrl = decodeURI(req.url);

  _addLink(result, 'self', baseUrl);

  // add any params
  var delim = '?';
  for (var key in req.swagger.params) {
    if (!key.startsWith('page')) {
      urlPath += delim + key + "=" + req.swagger.params[key].value;
      delim = '&';
    }
  }

  var offset = 0;
  var limit = 0;
  if (req.swagger.params['page[offset]']) {
    offset = req.swagger.params['page[offset]'].value;
  }
  if (req.swagger.params['page[limit]']) {
    limit = req.swagger.params['page[limit]'].value;
  }

  if (limit > 0) {
    var nextPath = urlPath;
    nextPath += delim + "page[limit]=" + limit;
    delim = '&';

    if (offset > 0) {
      nextPath += delim + "page[offset]=" + (offset + limit);
    }
    else {
      if (objArray.length == limit) {
        nextPath += delim + "page[offset]=" + limit;
      }
    }
    _addLink(result, "next", nextPath);
  }

  // and any actions that we need to know about


  return result;
}

function _addLink(obj, rel, urlPath, method) {
  if (!('links' in obj)) {
    obj.links = [];
  }
  // add only the self link to start with as a test
  var link = { rel: rel, href: urlPath };
  if (method) {
    link.method = method;
  }
  obj.links.push(link);
  return obj;
}

module.exports.convertYaml = function convertYaml(filename, obj) {
  fs.writeFile(filename, JSON.stringify(obj, null, 2), function(err,data) {
    if (err) {
      return console.log(err);
    }
  });
}
