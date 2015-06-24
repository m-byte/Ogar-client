// import('dialogs.js')
if (typeof(tools) == 'undefined') var tools = {};
(function (ns) {
  ns.logging = {};
  ns.logging.log = function (val) {
    if (config.logging) {
      console.log(val);
    }
  };
  ns.logging.err = function (val) {
    console.error(val);
  };
}(tools));