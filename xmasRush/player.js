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
      tile: new Tile(playerTile||'emptyTile'),
      x: playerX,
      y: playerY,
    });
  }
}

module.exports = Player;
