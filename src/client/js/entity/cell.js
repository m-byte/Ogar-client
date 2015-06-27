if (typeof(entity) == 'undefined') entity = {};
if (typeof(entity.Cell) == 'undefined') {
  entity.Cell = function (id, position, size, color, name) {
    this.id = id;
    this.last.x = position.x;
    this.x = position.x;
    this.last.y = position.y;
    this.y = position.y;
    this.last.size = size;
    this.size = size;
    this.color = color;
    this.name = name;
    this.init();
  };

  entity.Cell.prototype = {
    id: 0,
    name: null,
    x: 0,
    y: 0,
    size: 0,
    last: {
      x: 0,
      y: 0,
      size: 0
    },
    next: {
      x: 0,
      y: 0,
      size: 0
    },
    update: 0,
    lastDrawn: 0,
    destroyed: false,
    isVirus: false,
    isAgitated: false
  };

  entity.Cell.prototype.destroy = function () {
    game.deleteCell(this);
    this.destroyed = true;
  };

  entity.Cell.prototype.getNameSize = function () {
    return Math.max(~~(.3 * this.size), 25);
  };

  entity.Cell.prototype.updatePos = function () {
    if (this.id == 0) return 1;
    var timediff = (game.lastUpdate - this.update) / 120;
    if (timediff < 0) {
      timediff = 0;
    } else if (timediff > 1) {
      timediff = 1;
    }
    if (this.destroyed && timediff == 1) {
      var index = game.destroyedCells.indexOf(this);
      if (index > -1) {
        game.destroyedCells.splice(index, 1);
      }
    }
    this.x = timediff * (this.next.x - this.last.x) + this.last.x;
    this.y = timediff * (this.next.y - this.last.y) + this.last.y;
    this.size = timediff * (this.next.size - this.last.size) + this.last.size;
    return timediff;
  };

  entity.Cell.prototype.shouldRender = function () {
    if (this.id == 0) {
      return true;
    } else {
      var tmpx = this.x + this.size + 40;
      var tmpy = this.y + this.size + 40;
      var tmpwidth = game.canvas.width / 2 / game.view.zoom;
      var tmpheight = game.canvas.height / 2 / game.view.zoom;
      return tmpx >= game.position.x - tmpwidth && tmpy >= game.position.y - tmpheight && tmpy <= game.position.y + tmpheight;
    }
  };

  entity.Cell.prototype.draw = function (context) {
    // TODO:
  };

  entity.Cell.prototype.init = function () {
    // for future use
  };
}