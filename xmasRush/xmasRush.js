const Player = require('./player.js');
const Item = require('./item.js');
const Tile = require('./tile.js');
const DIRECTIONS = require('./directions.js');

/** Challenge class. */
class XmasRush {
  constructor(readline_, printErr_) {
    Object.assign(this, {
      items: [],
      players: [],
      printErr: printErr_,
      quests: [],
      readline: readline_,
      tiles: [[]],
      turnType: null,
    });
  }

  readTurn() {
    Object.assign(this, {
      items: [],
      players: [],
      quests: [],
      tiles: [[]],
      turnType: null,
    });

    this.turnType = parseInt(this.readline());
    for (let i = 0; i < 7; i++) {
      const inputs = this.readline().split(' ');
      this.tiles[i] = [];
      for (let j = 0; j < 7; j++) {
        this.tiles[i].push(new Tile(inputs[j]));
      }
    }

    for (let i = 0; i < 2; i++) {
      const inputs = this.readline().split(' ');
      this.players[i] = new Player({
        // The total number of quests for a player (hidden and revealed).
        numPlayerCards: parseInt(inputs[0]),
        playerTile: inputs[3],
        playerX: parseInt(inputs[1]),
        playerY: parseInt(inputs[2]),
      });
    }

    const numItems = parseInt(this.readline());
    for (let i = 0; i < numItems; i++) {
      const inputs = this.readline().split(' ');
      this.items.push(new Item({
        itemName: inputs[0],
        itemPlayerId: parseInt(inputs[3]),
        itemX: parseInt(inputs[1]),
        itemY: parseInt(inputs[2]),
      }));
    }

    // The total number of revealed quests for both players.
    const numQuests = parseInt(this.readline());
    for (let i = 0; i < numQuests; i++) {
      var inputs = this.readline().split(' ');
      this.quests.push({
        questItemName: inputs[0],
        questPlayerId: parseInt(inputs[1]),
      });
    }
  }

  getPlayerQuests(playerIndex) {
    return this.quests.filter((quest) => playerIndex === quest.questPlayerId);
  }

  getPlayerItems(playerIndex) {
    return this.items.filter((item) => playerIndex === item.playerId);
  }

  getTile(location) {
    return this.tiles[location.x][location.y];
  }

  getOpenNeighbors(tile, location) {
    console.log({exits: tile.exits});
    return Object.keys(tile.exits).reduce((acc, directionKey) => {
      console.log({directionKey});
      let neighborLocation = this.getRelativeLocation(directionKey, location);
      let neighborExits = this.getTile(neighborLocation).exits;
      let reversedDirections = {
        UP: 'DOWN',
        RIGHT: 'LEFT',
        DOWN: 'UP',
        LEFT: 'RIGHT',
      }
      let reversedDirection = reversedDirections[directionKey];
      if (neighborExits[reversedDirection]) {
        acc[directionKey] = true;
      }
      console.log({neighborExits});

      return acc
    }, {});
  }

  getRelativeLocation(direction, location) {
    if (typeof direction.x === 'undefined' &&
        typeof direction.y === 'undefined') {
      direction = DIRECTIONS[direction];
    }

    let newLocation = {
      x: location.x + (direction.x || 0),
      y: location.y + (direction.y || 0),
    };
    if (newLocation.x >= 0 && newLocation.x < this.tiles.length &&
        newLocation.y >= 0 && newLocation.y < this.tiles[0].length) {
      return newLocation;
    }

    return {};
  }

  getPath(locationStart, locationEnd) {
    let start = {
      x: locationStart.x,
      y: locationStart.y};
    let end = {
      x: locationEnd.x,
      y: locationEnd.y};
    let currentTile = this.tiles[start.x][start.y];
    let lastTile = this.tiles[end.x][end.y];
    let path = Object.keys(currentTile.exits).map((exitKey) => {
      // Each exit from this square has a score, the score
      // is the optimal distance to the goal from this square.
      let exit = currentTile.exits[exitKey];
      let neighbor = this.getRelativeLocation();
    }).reduce((bestProbe, exitProbe) => {
      if (!bestProbe) {
        return exitProbe;
      }

      if (bestProbe.score < exitProbe.score) {
        return exitProbe;
      }
    })
    this.printErr({path});
    return path;
  }
}

module.exports = XmasRush;
