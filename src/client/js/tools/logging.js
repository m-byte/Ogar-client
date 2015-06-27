if (typeof(tools) == 'undefined') tools = {};
if (typeof(tools.logging) == 'undefined') tools.logging = {};
(function (logging) {
  logging.log = function (val) {
    if (config.logging) {
      console.log(val);
    }
  };
  logging.err = function (val) {
    console.error(val);
  };
}(tools.logging));
