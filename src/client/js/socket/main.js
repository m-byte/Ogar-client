if (typeof(socket) == 'undefined') socket = {};
(function (socket) {
  var ws = null,
    protocol = 1;

  socket.secure = false;
  socket.onopen = null;
  socket.onconnecting = null;
  socket.onupdatenodes = null;
  socket.onupdateposition = null;
  socket.onclearnodes = null;
  socket.ondrawline = null;
  socket.onaddnode = null;
  socket.onupdateleaderboard = null;
  socket.onsetborder = null;
  socket.onchatmessage = null;

  socket.connect = function (url) {
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
    if (this.secure && url.slice(0, 'ws://'.length) == 'ws://') {
      url = 'ws://' + url;
    } else if (!this.secure && url.slice(0, 'wss://'.length) == 'wss://') {
      url = 'wss://' + url;
    }
    if (this.onconnecting) {
      this.onconnecting();
    }
    tools.logging.log('Connecting to ' + url);
    this.ws = new WebSocket(url);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = openHandler;
    this.ws.onmessage = messageHandler;
    this.ws.onclose = closeHandler;
    this.ws.onerror = function () {
      tools.logging.err('Socket error');
    }
  };
  function socketOpen() {
    return socket.ws != null && socket.ws.readyState == WebSocket.OPEN;
  }

  function openHandler() {
    var buffer = new ArrayBuffer(5),
      view = new DataView(buffer);
    view.setUint8(0, 254);
    view.setUint32(1, protocol, true);
    ws.send(buffer);
    buffer = new ArrayBuffer(5);
    view = new DataView(buffer);
    view.setUint8(0, 254);
    view.setUint32(1, 1332175218, true);
    ws.send(buffer);
    if (socket.onopen) {
      socket.onopen();
    }
  }

  function messageHandler(msg) {
    var view = new DataView(msg);
    var offset = 0;
    if (msg.getUint8(offset) == 240) {
      offset += 5;
    }
    switch (msg.getUint8(offset++)) {
      case 16: // update nodes
        updateNodes(msg, offset);
        break;
      case 17: // update position
        updatePosition(msg, offset);
        break;
      case 20: // clear nodes
        if (socket.onclearnodes) {
          socket.onclearnodes();
        }
        break;
      case 21: // draw line
        drawLine(msg, offset);
        break;
      case 32: // add node
        addNode(msg, offset);
        break;
      case 48: // update leaderboard (custom text)
        updateLB(msg, offset, 48);
        break;
      case 49: // update leaderboard (ffa)
        updateLB(msg, offset, 49);
        break;
      case 50: // update leaderboard (teams)
        updateLB(msg, offset, 50);
        break;
      case 64: // set border
        setBorder(msg, offset);
        break;
      case 99: // add chat message
        addChatMsg(msg, offset);
        break;
    }
  }

  function closeHandler() {
    tools.logging.log('Socket closed');
    if (socket.onclose) {
      socket.onclose();
    }
  }

  function updateNodes(msg, offset) {
    if (socket.onupdatenodes) {
      var ret = {};
      // TODO: parse msg and store result in ret
      socket.onupdatenodes(ret);
    }
  }

  function updatePosition(msg, offset) {
    if (socket.onupdateposition) {
      var ret = {};
      // TODO: parse msg and store result in ret
      socket.onupdateposition(ret);
    }
  }

  function drawLine(msg, offset) {
    if (socket.ondrawline) {
      var ret = {};
      // TODO: parse msg and store result in ret
      socket.ondrawline(ret);
    }
  }

  function addNode(msg, offset) {
    if (socket.onaddnode) {
      var ret = {};
      // TODO: parse msg and store result in ret
      socket.onaddnode(ret);
    }
  }

  function updateLB(msg, offset, type) {
    if (socket.onupdateleaderboard) {
      var ret = {};
      // TODO: parse msg and store result in ret
      socket.onupdateleaderboard(ret);
    }
  }

  function setBorder(msg, offset) {
    if (socket.onsetborder) {
      var ret = {};
      // TODO: parse msg and store result in ret
      socket.onsetborder(ret);
    }
  }

  function addChatMsg(msg, offset) {
    if (socket.onchatmessage) {
      var ret = {};
      // TODO: parse msg and store result in ret
      socket.onchatmessage(ret);
    }
  }

  socket.sendEvent = function (value) {
    if (socketOpen()) {
      var buffer = new ArrayBuffer(1),
        view = new DataView(buffer);
      view.setUint8(0, value);
      ws.send(buffer);
    }
  };

  socket.sendMouse = function (x, y) {
    if (socketOpen()) {
      var buffer = new ArrayBuffer(21),
        view = new DataView(buffer);
      view.setUint8(0, 16);
      view.setFloat64(1, x, !0);
      view.setFloat64(9, y, !0);
      view.setUint32(17, 0, !0);
      ws.send(buffer);
    }
  };

  socket.sendNick = function (nick) {
    if (socketOpen() && nick != null) {
      var buffer = new ArrayBuffer(1 + 2 * nick.length),
        view = new DataView(buffer);
      view.setUint8(0, 0);
      for (var i = 0; i < nick.length; i++) {
        view.setUint16(1 + 2 * i, nick.charCodeAt(i), false);
      }
      ws.send(buffer);
    }
  };
}(socket));