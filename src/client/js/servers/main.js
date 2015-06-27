if (typeof(servers) == 'undefined') servers = {};
(function (servers) {
  servers.getServer = function(callback, region, mode) {
    if (config.masterServer) {
      var url = config.server;
      if (!config.secure && url.slice(0, 'http://'.length) != 'http://') {
        url = 'http://' + url;
      } else if (config.secure && url.slice(0, 'https://'.length) != 'https://') {
        url = 'https://' + url;
      }
      var request = new XMLHttpRequest();
      request.open('POST', url + '?' + Math.floor(Math.random() * 1000), true);
      request.onreadystatechange = function () {
        if (request.readyState == XMLHttpRequest.DONE) {
          if (request.status == 200) {
            callback(request.responseText.split('\n'));
          } else {
            tools.logging.err('Could not connect to ' + url);
            setTimeout(function () {
              servers.getServer(callback, region, mode);
            }, 1000);
          }
        }
      };
      if (region && mode) {
        tools.logging.log('Searching for ' + region + mode);
        request.send(region + mode);
      } else {
        tools.logging.log('Searching for server');
        request.send('?');
      }
    } else {
      callback([config.server, '']);
    }
  };

  servers.getRegions = function(callback) {
    if (config.masterServer) {
      var url = config.server;
      if (!config.secure && url.slice(0, 'http://'.length) != 'http://') {
        url = 'http://' + url;
      } else if (config.secure && url.slice(0, 'https://'.length) != 'https://') {
        url = 'https://' + url;
      }
      url += '/info';
      var request = new XMLHttpRequest();
      request.open('GET', url + '?' + Math.floor(Math.random() * 1000), true);
      request.onreadystatechange = function () {
        if (request.readyState == XMLHttpRequest.DONE) {
          if (request.status == 200) {
            callback(JSON.parse(request.responseText));
          } else {
            tools.logging.err('Could not load regions from ' + url);
          }
        }
      };
      tools.logging.log('Loading regions');
      request.send();
    }
    callback(null);
  };
}(servers));