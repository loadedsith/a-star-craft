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
    let exits = {}
    if (tile[0] === '1') {
      exits['UP'] = true;
    }
    if (tile[1] === '1') {
      exits['RIGHT'] = true;
    }
    if (tile[2] === '1') {
      exits['DOWN'] = true;
    }
    if (tile[3] === '1') {
      exits['LEFT'] = true;
    }
    return exits;
  }
}

Object.assign(Tile.prototype, {
  DIRECTIONS,
});

module.exports = Tile;
