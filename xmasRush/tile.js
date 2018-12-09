const DIRECTIONS = [
  'UP',
  'RIGHT',
  'DOWN',
  'LEFT',
];

class Tile {
  constructor(tile) {
    Object.assign(this, {tile});
    this.exits = Tile.getExits(tile);
  }

  static getExits(tile) {
    if (!tile) {
      tile = '0000';
    }

    return DIRECTIONS.reduce((acc, direction, index) => {
      acc[direction] = tile[index] === '1' ? true : false;

      return acc;
    }, {});
  }
}

Object.assign(Tile.prototype, {
  DIRECTIONS,
});

module.exports = Tile;
