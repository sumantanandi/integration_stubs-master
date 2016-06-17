// shared creds

var dbConfig = {
  "mysql" : {
    "dev": {
      "user": '',
      "password": '',
      "server": '',
      "database": '',
      //"options": {
      //  "encrypt": true
      //}
    },
    "qa": {
      "user": '',
      "password": '',
      "server": '',
      "database": '',

      //"database": 'Activate_TEST3', //Test3
      //"options": {
      //  "encrypt": true
      //}
    },
    "prod": {
      "user": '',
      "password": '',
      "server": '',
      "database": '',
      //"options": {
      //  "encrypt": true
      //}
    }
  }
}

module.exports = dbConfig;
