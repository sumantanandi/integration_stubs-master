// Mongoose connect is called once by the index.js & connection established
// No need to connect elsewhere
var mongoose = require('mongoose');
var mssqldb = require('mssql');
var config = require('../../config/config');

// Just handle the connection, no need to export

mongoose.connect(config.db.connectString);