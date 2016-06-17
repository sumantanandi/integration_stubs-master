var fs = require('fs');

exports.readSpec= () => {
  // common elements
  var info = fs.readFileSync('./app/api/parts/info.yaml', 'utf8');
  var common = fs.readFileSync('./app/api/parts/definitions/common.yaml', 'utf8');
  var errors = fs.readFileSync('./app/api/parts/definitions/errors.yaml', 'utf8');
  var security = fs.readFileSync('./app/api/parts/security.yaml', 'utf8');

  var parts = {
    ping: {
      path: fs.readFileSync('./app/api/parts/paths/ping.yaml', 'utf8'),
      defn: fs.readFileSync('./app/api/parts/definitions/ping.yaml', 'utf8')
    },
    apps: {
      path: fs.readFileSync('./app/api/parts/paths/apps.yaml', 'utf8'),
      defn: fs.readFileSync('./app/api/parts/definitions/apps.yaml', 'utf8')
    }
  }

  return {
    info: info,
    common: common,
    errors: errors,
    security: security,
    parts: parts
  }
}
