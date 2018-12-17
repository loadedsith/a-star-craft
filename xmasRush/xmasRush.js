const Player = require('./player.js');
const Item = require('./item.js');
const Tile = require('./tile.js');
const DIRECTIONS = require('./directions.js');

const MAX_TURNS = 20;

const REVERSED_DIRECTIONS = {
  UP: 'DOWN',
  RIGHT: 'LEFT',
  DOWN: 'UP',
  LEFT: 'RIGHT',
};

/** Challenge class. */
class XmasRush {
  constructor(readline_, printErr_, options = {}) {
    Object.assign(this, {
      errors: [],
      items: [],
      players: [],
      printErr: printErr_,
      quests: [],
      readline: readline_,
      tiles: [[]],
      turnType: null,
    },
    options);
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
    if (this.tiles[location.x] && this.tiles[location.x][location.y]) {
      return this.tiles[location.x][location.y];
    }
    return false;
  }

  getOpenExits(tile, location) {
    return Object.keys(tile.exits).reduce((acc, directionKey) => {
      let neighborLocation = this.getRelativeLocation(directionKey, location);
      if (!neighborLocation) {
        return acc;
      }
      let neighborExits = this.getTile(neighborLocation).exits || {};
      let reversedDirection = REVERSED_DIRECTIONS[directionKey];
      if (neighborExits[reversedDirection]) {
        acc[directionKey] = true;
      }

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

    return false;
  }

  getPathScores(
      currentLocation,
      targetLocation,
      pathsFound,
      xmasRush = 'new',
      path = [],
      index = 0,
      matchCount = 0,
      lastDirection = false) {

    if (xmasRush === 'new') {
      xmasRush = new XmasRush(this.readline_,this.printErr_, {
          tiles: this.tiles,
      })
    }

    path = JSON.parse(JSON.stringify(path))

    if (++index > MAX_TURNS) {
      return;
    }
    let openExits = xmasRush.getOpenExits(xmasRush.getTile(currentLocation),
        currentLocation);
    let openExitsKeys = Object.keys(openExits);

    path.push({
      index,
      matchCount,
      x: currentLocation.x,
      y: currentLocation.y,
    });

    if (currentLocation.x === targetLocation.x &&
        currentLocation.y === targetLocation.y) {
      matchCount++;
      path[path.length - 1].goalFound = matchCount;
      pathsFound.push(JSON.parse(JSON.stringify(path)));
    } else {
      openExitsKeys.map((exitKey) => {
        let exitLocation = xmasRush.getRelativeLocation(exitKey,
            currentLocation);
        if (exitLocation && exitKey !=
            REVERSED_DIRECTIONS[lastDirection]) {
          xmasRush.getPathScores(exitLocation, targetLocation, pathsFound, xmasRush, path, index, matchCount, exitKey);
        }
      });
    }
  }

  static getStepAtLocation(steps, location) {
    return steps.find((step) => {
      if (step.x === location.x && step.y === location.y) {
        return true
      }
    })
  }

  getPath(start, end, depth = 0, maxDepth = 10) {
    let currentTile = this.tiles[start.x][start.y];
    let lastTile = this.tiles[end.x][end.y];
    let matchCount = 0;
    let pathsFound = [];

    this.getPathScores(start, end, pathsFound);
    // Print paths with the following debug code
    // if (pathsFound.length > 0) {
    //   for (var i = 0; i < pathsFound.length; i++) {
    //     let path = pathsFound[i];
    //     console.log('\nPATH\n');
    //     for (var j = 0; j < 7; j++) {
    //       let line = '';
    //       for (var k = 0; k < 7; k++) {
    //
    //         let pathsFoundTile = XmasRush.getStepAtLocation(path, {x: j, y: k});
    //
    //         if (pathsFoundTile) {
    //           line += `${pathsFoundTile.index}`;
    //         } else {
    //           line += `_`;
    //         }
    //       }
    //       console.log('-'+line);
    //     }
    //   }
    //   console.log('----\n')
    // } else {
    //   console.log('No score tiles');
    // }
    // console.log({pathsFound:JSON.stringify(pathsFound)});
    let path = pathsFound.reduce((bestPath, currentPath) => {
      if (bestPath == null) {
        return currentPath;
      } else if (bestPath.length > currentPath.length) {
        return currentPath;
      } else {
        return bestPath;
      }
    }, null);

    return path;
  }
}

module.exports = XmasRush;
