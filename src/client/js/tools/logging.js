var config = require('../config');

module.exports = {};
(function (logging) {
  logging.log = function (val) {
    if (config.logging) {
      console.log(val);
    }
  };
  logging.err = function (val) {
    console.error(val);
  };
}(module.exports));
