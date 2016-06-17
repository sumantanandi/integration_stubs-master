'use strict';

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

var config = require('../../config/config');

var superSecret = 'getthisfromconfig';
/**
 * crypto functions used for token generation, comparison and transaction
 * signatures.
 */

/**
 * Generate a signed token that expires after 24 hours.
 */
module.exports.generateToken = function(content) {
  return jwt.sign(content, superSecret, {
            expiresIn: '1d'
          });
}

/**
 * Verify a token against the reference content. The token must not be expired.
 */
function verifyToken(token) {
  try {
    var decoded = jwt.verify(token, superSecret);
    console.log(decoded);
    return true;
  }
  catch (error) {
    console.error(error);
    return false;
  }
}
module.exports.verifyToken = verifyToken;


/**
 * Decode the content of the token and return it.
 */
module.exports.decodeToken = function(token) {
  return jwt.decode(token);
}

/**
 * Not really crypto but this is a good place to put the code generator for
 * 2 factor checks to avoid it being everywhere.
 */
module.exports.generateCode = function() {
  // return a 6 digit number between 100000 and 999999
  //
  return Math.floor(Math.random() * 900000) + 100000;
}

/**
 * Generate a randon id for server allocated keys and secrets.
 */
module.exports.generateRandom = function() {
  var buf = crypto.randomBytes(20);
  return buf.toString('hex');
}

/**
 * Session tokens are checked via this callback
 */
module.exports.checkSessionToken = function(req, def, scopesOrApiKey, cb) {
  // make sure that the server key is correct
  console.log("checking session token");

  if (scopesOrApiKey == config.apiKeys.masterKey) {
    cb();
  }
  else {
    if (scopesOrApiKey) {
      if (verifyToken(scopesOrApiKey)) {
        cb();
      }
      else {
        cb(new Error('Access Denied!'));
      }
    }
    else {
      cb(new Error('Access Denied!'));
    }
  }
}

/**
 * Check a payment token for validity
 */
module.exports.checkPaymentToken = function(req, def, scopesOrApiKey, cb) {
  // make sure that the server key is correct
  console.log("checking payment token");

  if (scopesOrApiKey) {
    if (verifyToken(scopesOrApiKey)) {
      cb();
    }
    else {
      cb(new Error('Invalid Payment Token'));
    }
  }
  else {
    cb(new Error('Invalid Payment Token'));
  }
}
