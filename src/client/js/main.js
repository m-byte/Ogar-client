var tools = require('./tools/main');
var config = require('./config');
var entity = require('./entity/main');
var socket = require('./socket/main');
var servers = require('./servers/main');
var game = require('./game/main');

window.onload = function () {
  function decodeQuery(query) {
    query = query.substring(1);
    query = query.split('&');
    var result = {};
    for (var i = 0; i < query.length; i++) {
      var pair = query[i].split('=');
      result[pair[0]] = pair.length > 1 ? decodeURIComponent(pair[1]) : '';
    }
    return result;
  }

  // check for arguments
  if (window.location.search) {
    var query = decodeQuery(window.location.search);
    if (query.hasOwnProperty('uploaderr')) {
      switch (query['uploaderr']) {
        case 'toobig':
          // TODO: display error message
          break;
        case 'exists':
          // TODO: display error message
          break;
        default:
          // TODO: display error message
          break;
      }
    } else if (query.hasOwnProperty('nick')) {
      document.getElementById('nick').value = query['nick'];
    }
  }

  // clear the path
  history.pushState(null, null, window.location.pathname);

  document.getElementById('region').onchange = function(event){
    console.log(event.srcElement.value);
    game.setRegion(event.srcElement.value);
  };

  // prepare everything for the game
  game.init();
};