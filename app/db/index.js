// Mongoose connect is called once by the index.js & connection established
// No need to connect elsewhere
var mongoose = require('mongoose');
var mssqldb = require('mssql');
console.log("Before confi require. app/db/index.js");
var config = require('../../config/config');
console.log("after confi require. app/db/index.js", config);

// Just handle the connection, no need to export

//mongoose.connect(config.db.connectString);
