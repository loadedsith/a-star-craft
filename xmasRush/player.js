const Tile = require('./tile.js')

class Player {
  constructor({
    numPlayerCards,
    playerTile,
    playerX,
    playerY,
  }, map) {
    Object.assign(this, {
      numCards: numPlayerCards,
      x: playerX,
      y: playerY,
    });
  }
}

module.exports = Player;
