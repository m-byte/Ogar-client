if (typeof(socket) == 'undefined') socket = {};
(function (socket) {
  var ws = null,
    protocol = 1;

  socket.onopen = null;
  socket.onclose = null;
  socket.onconnecting = null;
  socket.onupdatenodes = null;
  socket.onupdateposition = null;
  socket.onclearnodes = null;
  socket.ondrawline = null;
  socket.onaddnode = null;
  socket.onupdateleaderboard = null;
  socket.onsetborder = null;
  socket.onchatmessage = null;

  socket.event = {
    // events that can be used with socket.sendEvent
    spectate: 1,
    pressSpace: 17,
    pressQ: 18,
    releaseQ: 19,
    pressW: 21
  };

  socket.connect = function (url) {
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onclose = null;
      try {
        ws.close()
      } catch (e) {
      }
      ws = null;
    }
    if (!config.secure && url.slice(0, 'ws://'.length) != 'ws://') {
      url = 'ws://' + url;
    } else if (config.secure && url.slice(0, 'wss://'.length) != 'wss://') {
      url = 'wss://' + url;
    }
    if (this.onconnecting) {
      this.onconnecting();
    }
    tools.logging.log('Connecting to ' + url);
    ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';
    ws.onopen = openHandler;
    ws.onmessage = messageHandler;
    ws.onclose = closeHandler;
    ws.onerror = function () {
      tools.logging.err('Socket error');
    }
  };

  socket.isOpen = function () {
    return socket.ws != null && socket.ws.readyState == WebSocket.OPEN;
  };

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
    var view = new DataView(msg.data);
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
    function getString() {
      var text = '',
        char;
      while ((char = msg.getUint16(offset, true)) != 0) {
        offset += 2;
        text += String.fromCharCode(char);
      }
      offset += 2;
      return text;
    }

    if (socket.onupdatenodes) {
      var ret = {},
        queueLength = 0,
        nodeid;
      ret.timestamp = +new Date;
      queueLength = msg.getUint16(offset, true);
      offset += 2;
      ret.kills = [];
      for (var i = 0; i < queueLength; i++) {
        var tmp = {};
        tmp.killer = msg.getUint32(offset, true);
        tmp.nodeId = msg.getUint32(offset + 4, true);
        ret.kills.push(tmp);
        offset += 8;
      }
      ret.updates = [];
      while ((nodeid = msg.getUint32(offset, true)) != 0) {
        offset += 4;
        var tmp = {},
          char;
        tmp.nodeId = nodeid;
        tmp.position = {};
        tmp.position.x = msg.getUint16(offset, true);
        tmp.position.y = msg.getUint16(offset + 2, true);
        tmp.size = msg.getUint16(offset + 4, true);
        offset += 6;
        tmp.color = {};
        tmp.color.r = msg.getUint8(offset++);
        tmp.color.g = msg.getUint8(offset++);
        tmp.color.b = msg.getUint8(offset++);
        tmp.flags = msg.getUint8(offset++);
        if (tmp.flags & 2) {
          offset += 4;
        }
        if (tmp.flags & 4) {
          offset += 8;
        }
        if (tmp.flags & 8) {
          offset += 16;
        }
        tmp.isVirus = !!(tmp.flags & 1);
        tmp.isAgitated = !!(tmp.flags & 16);
        tmp.name = getString();
        ret.updates.push(tmp);
      }
      queueLength = msg.getUint32(offset + 4, true);
      offset += 8;
      ret.remove = [];
      for (var i = 0; i < queueLength; i++) {
        ret.remove.push(msg.getUint32(offset, true));
        offset += 4;
      }
      socket.onupdatenodes(ret);
    }
  }

  function updatePosition(msg, offset) {
    if (socket.onupdateposition) {
      var ret = {};
      ret.x = msg.getFloat32(offset, true);
      ret.y = msg.getFloat32(offset + 4, true);
      ret.size = msg.getFloat32(offset + 8, true);
      socket.onupdateposition(ret);
    }
  }

  function drawLine(msg, offset) {
    if (socket.ondrawline) {
      var ret = {};
      ret.x = msg.getInt16(offset, true);
      ret.y = msg.getInt16(offset + 2, true);
      socket.ondrawline(ret);
    }
  }

  function addNode(msg, offset) {
    if (socket.onaddnode) {
      var ret = {};
      ret.id = msg.getUint32(offset, true);
      socket.onaddnode(ret);
    }
  }

  function updateLB(msg, offset, type) {
    function getString() {
      var text = '',
        char;
      while ((char = msg.getUint16(offset, true)) != 0) {
        offset += 2;
        text += String.fromCharCode(char);
      }
      offset += 2;
      return text;
    }

    if (socket.onupdateleaderboard) {
      var ret = {};
      ret.lb = [];
      ret.count = msg.getUint32(offset, true);
      offset += 4;
      if (type == 50) {
        ret.type = 'teams';
        for (var i = 0; i < ret.count; i++) {
          ret.lb.push(msg.getFloat32(offset, true));
          offset += 4;
        }
      } else {
        if (type == 48) {
          ret.type = 'custom';
        } else {
          ret.type = 'ffa';
        }
        for (var i = 0; i < ret.count; i++) {
          var nodeId = msg.getUint32(offset, true);
          offset += 4;
          ret.lb.push({id: nodeId, name: getString()});
        }
      }
      socket.onupdateleaderboard(ret);
    }
  }

  function setBorder(msg, offset) {
    if (socket.onsetborder) {
      var ret = {};
      ret.left = msg.getFloat64(offset, true);
      ret.top = msg.getFloat64(offset + 8, true);
      ret.right = msg.getFloat64(offset + 16, true);
      ret.bottom = msg.getFloat64(offset + 24, true);
      socket.onsetborder(ret);
    }
  }

  function addChatMsg(msg, offset) {
    function getString() {
      var text = '',
        char;
      while ((char = msg.getUint16(offset, true)) != 0) {
        offset += 2;
        text += String.fromCharCode(char);
      }
      offset += 2;
      return text;
    }

    if (socket.onchatmessage) {
      var ret = {},
        flags = msg.getUint8(offset++);
      if (ret.flags & 2) {
        offset += 4;
      }
      if (ret.flags & 4) {
        offset += 8;
      }
      if (ret.flags & 8) {
        offset += 16;
      }
      ret.color = {};
      ret.color.r = msg.getUint8(offset++);
      ret.color.g = msg.getUint8(offset++);
      ret.color.b = msg.getUint8(offset++);
      ret.name = getString();
      ret.message = getString();
      socket.onchatmessage(ret);
    }
  }

  socket.sendEvent = function (value) {
    if (this.isOpen()) {
      var buffer = new ArrayBuffer(1),
        view = new DataView(buffer);
      view.setUint8(0, value);
      ws.send(buffer);
    }
  };

  socket.sendMouse = function (x, y) {
    if (this.isOpen()) {
      var buffer = new ArrayBuffer(21),
        view = new DataView(buffer);
      view.setUint8(0, 16);
      view.setFloat64(1, x, !0);
      view.setFloat64(9, y, !0);
      view.setUint32(17, 0, !0);
      ws.send(buffer);
    }
  };

  socket.sendName = function (name) {
    if (this.isOpen() && name != null) {
      var buffer = new ArrayBuffer(1 + 2 * name.length),
        view = new DataView(buffer);
      view.setUint8(0, 0);
      for (var i = 0; i < name.length; i++) {
        view.setUint16(1 + 2 * i, name.charCodeAt(i), false);
      }
      ws.send(buffer);
    }
  };

  socket.sendChatMessage = function (message, flags) {
    if (this.isOpen()) {
      var buffer = new ArrayBuffer(2 + 2 * message.length),
        view = new DataView(buffer),
        offset = 0;
      view.setUint8(offset++, 99);
      if (!flags) {
        flags = 0;
      }
      view.setUint8(offset++, flags & 241); // make sure bits 2, 4, 8 don't get set
      for (var i = 0; i < message.length; i++) {
        view.setUint16(1 + 2 * i, message.charCodeAt(i), false);
      }
      ws.send(buffer);
    }
  }
}(socket));