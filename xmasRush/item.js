const Tile = require('./tile.js')

class Item {
  constructor({
    itemName,
    itemPlayerId,
    itemX,
    itemY,
  }, map) {
    Object.assign(this, {
      name: itemName,
      playerId: itemPlayerId,
      x: itemX,
      y: itemY,
    });
  }
}

module.exports = Item;
