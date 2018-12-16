const DIRECTIONS = require('./directions.js')

class Tile {
  constructor(tile) {
    Object.assign(this, {tile});
    this.exits = Tile.getExits(tile);
    this.score = 0;
    this.goalFound = false;
  }

  static getExits(tile) {
    if (!tile) {
      return {};
    }

    return Object.keys(DIRECTIONS).reduce((acc, direction, index) => {
      if (tile[index] === '1') {
        acc[direction] = true;
      }

      return acc;
    }, {});
  }
}

Object.assign(Tile.prototype, {
  DIRECTIONS,
});

module.exports = Tile;
