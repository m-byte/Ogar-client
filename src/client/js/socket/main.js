if (typeof(socket) == 'undefined') socket = {};
(function (socket) {
  var ws = null;
  var secure = false;
  socket.connect = function (cb, url) {
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onclose = null;
      try {
        this.ws.close()
      } catch (e) {
      }
      this.ws = null;
    }
    if (secure && url.slice(0, 'ws://'.length) == 'ws://') {
      url = 'ws://' + url;
    } else if (!secure && url.slice(0, 'wss://'.length) == 'wss://') {
      url = 'wss://' + url;
    }
    cb();
    tools.logging.log('Connecting to ' + url);
    this.ws = new WebSocket(url);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.openHandler;
    this.ws.onclose = this.closeHandler;
    this.ws.onerror = function () {
      tools.logging.err('Socket error');
    }
  };
  function socketOpen() {
    return this.ws != null && this.ws.readyState == WebSocket.OPEN;
  };
  socket.openHandler = function () {
  };
  socket.closeHandler = function () {

  };
  socket.sendUint8 = function () {

  };
  socket.sendMouse = function () {
  };
  socket.sendNick = function () {

  };
}(socket));