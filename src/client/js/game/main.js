if (typeof(game) == 'undefined') game = {};
(function (game) {
  /*
   Functions from other files:
   ***************************

   socket.onopen = function(){};x
   socket.onclose = function(){};x
   socket.onconnecting = function(){};x
   socket.onupdatenodes = function(ret){};x
   socket.onupdateposition = function(ret){};x
   socket.onclearnodes = function(){};x
   socket.ondrawline = function(ret){};x
   socket.onaddnode = function(ret){};x
   socket.onupdateleaderboard = function(ret){};x
   socket.onsetborder = function(ret){};
   socket.onchatmessage = function(ret){};

   socket.connect(url);
   socket.sendEvent(value);
   socket.sendMouse(x, y);
   socket.sendNick(nick);
   socket.sendChatMessage(color, message, nick);
   socket.isOpen();

   servers.getServer(callback, region, mode);
   servers.getRegions(callback);

   tools.logging.log(message);
   tools.logging.err(message);

   tools.dialogs.switch(dialog);
   tools.dialogs.showDialogs(show);
   tools.dialogs.showConnecting(show);
   */
  var canvas,
    c2d,
    released = {space: true, w: true, q: true},
    mouse = {x: 0, y: 0, lastX: 0, lastY: 0},
    playing = false,
    initialized = false,
    regions = null,
    selectedRegion = null;

  game.init = function () {
    this.updateServerList();
    setInterval(this.updateServerList, 18E4);
    canvas = document.getElementById('canvas');
    c2d = canvas.getContext('2d');
    canvas.onmousedown = mouseDown;
    canvas.onmousemove = mouseMove;
    window.onkeydown = keyDown;
    window.onkeyup = keyUp;
    window.onblur = blur;
    window.onresize = resize;
    if (/firefox/i.test(navigator.userAgent)) {
      document.addEventListener("DOMMouseScroll", mouseWheel, false);
    } else {
      document.body.onmousewheel = mouseWheel;
    }
    resize();
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(animationFrame);
    } else {
      setInterval(this.draw, 100 / 6);
    }
    setInterval(sendMouse(), 40);
    loadRegion();
    this.setRegion(document.querySelectorAll('#region').value);
    initialized = true;
    if (!socket.isOpen()) {
      tools.dialogs.showConnecting(true);
    }
  };

  function loadRegion() {
    if (selectedRegion) {
      this.setRegion(selectedRegion, true);
    }
    if (typeof(Storage) !== 'undefined' && window.localStorage.hasOwnProperty('selectedRegion')) {
      this.setRegion(window.localStorage.selectedRegion, true);
    }
  }

  game.setRegion = function (region, force) {
    if (region && (region != selectedRegion || force)) {
      var regionSelect = document.querySelectorAll('#region');
      if (regionSelect && regionSelect.value != region) {
        regionSelect.value = region;
      }
      selectedRegion = region;
      window.localStorage.selectedRegion = region;
    }
  };

  function animationFrame() {
    this.draw();
    window.requestAnimationFrame(animationFrame);
  }

  game.draw = function () {
    // TODO
  };

  function mouseDown(event) {
    updateMouse(event.clientX, event.clientY);
    sendMouse();
  }

  function mouseMove(event) {
    updateMouse(event.clientX, event.clientY);
  }

  function keyDown(event) {
    if (playing) {
      switch (event.keyCode) {
        case 32: // space
          if (released.space) {
            sendMouse();
            socket.sendEvent(socket.event.pressSpace);
            released.space = false;
          }
          break;
        case 81: // q
          if (released.q) {
            socket.sendEvent(socket.event.pressQ);
            released.q = false;
          }
          break;
        case 87: // w
          if (released.w) {
            sendMouse();
            socket.sendEvent(socket.event.pressW);
            released.w = false;
          }
          break;
      }
    }
  }

  function keyUp(event) {
    if (playing) {
      switch (event.keyCode) {
        case 32: // space
          released.space = true;
          break;
        case 81: // q
          if (!released.q) {
            socket.sendEvent(socket.event.releaseQ);
            released.q = true;
          }
          break;
        case 87: // w
          released.w = true;
          break;
      }
    }
  }

  function blur() {
    if (!released.q) {
      socket.sendEvent(socket.event.releaseQ);
    }
    released.q = true;
    released.space = true;
    released.w = true;
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.draw();
  }

  function mouseWheel(event) {
    // TODO: add code for zooming
  }

  function updateMouse(rawX, rawY) {
    mouse.x = (rawX - canvas.width / 2);
    mouse.y = (rawY - canvas.height / 2);
    console.log(mouse.x * mouse.x + mouse.y * mouse.y);
  }

  function hasMouseMoved() {
    if (Math.abs(mouse.x - mouse.lastX) < 0.01) {
      return false;
    }
    if (Math.abs(mouse.y - mouse.lastY) < 0.01) {
      return false;
    }
    if (mouse.x * mouse.x + mouse.y * mouse.y <= 64) {
      return false;
    }
    return true;
  }

  function sendMouse() {
    if (playing && hasMouseMoved()) {
      socket.sendMouse(x, y);
    }
  }

  game.updateServerList = function () {
    if (regions == null) {
      regions = {};
      var region = document.getElementById('region').firstElementChild;
      do {
        if (region.value) {
          if (region.textContent) {
            regions[region.value] = region.textContent;
          } else {
            regions[region.value] = region.innerText;
          }
        }
      } while (region = region.nextElementSibling != null);
      servers.getRegions(function (ret) {
        if (ret != null) {
          var stats = {};
          for (var region in ret.regions) {
            var name = region.split(':')[0];
            stats[name] = ret.regions[region];
          }
          for (var stat in stats) {
            var element = document.querySelector('#region option[value="' + stat + '"');
            if (element) {
              element.innerHTML = regions[stat] + " (" + stats[stat].numPlayers + " players)";
            }
            // TODO: remove empty or non-existent options
          }
        }
      });
    }
  }
}(game));