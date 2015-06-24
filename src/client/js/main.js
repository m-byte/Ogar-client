// import('tools/main.js')

// import('config.js')
// import('socket/main.js')

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
    if(query.hasOwnProperty('uploaderr')){
      switch(query['uploaderr']){
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
    }else if(query.hasOwnProperty('nick')){
      document.getElementById('nick').value = query['nick'];
    }
  }

  // clear the path
  history.pushState(null, null, window.location.pathname);
};