var dbConfig = require("./db-config.js")
var logger = require('loglevel');

//set default loglevel to info (this will include logging info, warn and error logs)
if(process.env.LOGLEVEL) {
  logger.setDefaultLevel(process.env.LOGLEVEL);
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var configSettings = {
  "local": {
    "label": "local",
    "apiKeys": {
      "masterKey": "latitude"
    },
    "http": {
      "address": "localhost",
      "port": 8082
    },
    "https": {
      "address": "localhost",
      "port": 8443
    },
    "db": {
      "connectString": "mongodb://localhost/integration"
    },
    "mssql": dbConfig.mysql.dev,
    "whitelist": []
  }
};

// use an environment variable to chose the correct config settings

module.exports = configSettings[process.env.NODE_ENV || 'local'];
