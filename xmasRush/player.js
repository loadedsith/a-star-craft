const Tile = require('./tile.js')

class Player {
  constructor({
    numPlayerCards,
    playerTile,
    playerX,
    playerY,
    playerId,
  }, map) {
    Object.assign(this, {
      numCards: numPlayerCards,
      x: playerX,
      y: playerY,
      playerId: playerId,
    });
  }
}

module.exports = Player;
