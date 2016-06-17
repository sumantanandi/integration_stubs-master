var commandLineArgs = require('command-line-args');

exports.args = () => {
  var cli = commandLineArgs ([{
    name: "parts",
    type: String,
    multiple: true,
    defaultOption: true,
    defaultValue: ["all"]
  }]);

  return cli.parse();
}
