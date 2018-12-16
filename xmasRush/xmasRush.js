const Player = require('./player.js');
const Item = require('./item.js');
const Tile = require('./tile.js');
const DIRECTIONS = require('./directions.js');

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

  getPath(start, end, depth = 0, maxDepth = 10) {
    let currentTile = this.tiles[start.x][start.y];
    let lastTile = this.tiles[end.x][end.y];
    let matchCount = 0;
    let pathsFound = [];
    const getPathScores = (currentLocation, targetLocation, xmasRush = 'new', score = 0, path = [[]], stepCount = 0) => {
      if (xmasRush === 'new') {
        xmasRush = new XmasRush(this.readline_,this.printErr_, {
            tiles: this.tiles,
        })
      }

      path = JSON.parse(JSON.stringify(path))
      stepCount += 1;

      let openExits = xmasRush.getOpenExits(xmasRush.getTile(currentLocation),
          start);
      let openExitsKeys = Object.keys(openExits);

      if (typeof path[currentLocation.x] === 'undefined') {
        path[currentLocation.x] = [];
      }
      path[currentLocation.x][currentLocation.y] = {
          index: stepCount,
          score: matchCount,
      };

      if (currentLocation.x === targetLocation.x &&
          currentLocation.y === targetLocation.y) {
        matchCount++;
        path[currentLocation.x][currentLocation.y].goalFound =
            matchCount;
        pathsFound.push(JSON.parse(JSON.stringify(path)));
      } else {
        score++;

        openExitsKeys.map((exitKey) => {
          let exitLocation = xmasRush.getRelativeLocation(DIRECTIONS[exitKey],
              currentLocation);
          if (exitLocation) {
            getPathScores(exitLocation, targetLocation, xmasRush, score, path, stepCount);
          }
        });
      }
    }

    getPathScores(start, end);
    if (pathsFound) {

      for (var i = 0; i < pathsFound.length; i++) {
        let path = pathsFound[i];

        console.log('\nPATH---');
        for (var j = 0; j < 7; j++) {
          let pathsFoundRow = path[j];

          let line = '';
          for (var k = 0; k < 7; k++) {

            let pathsFoundTile = (pathsFoundRow||[])[k];

            if (pathsFoundTile) {
              // console.log({pathsFoundTile:pathsFoundTile});
              line += `${pathsFoundTile.index}`;
            } else {
              line += `_`;
            }
          }
          console.log('-'+line);
        }
      }
      // pathsFound.map((path) => {
      //   path.map((pathsRow, x) => {
      //     let line = ''
      //     pathsRow.map((pathTile, y) => {
      //       line += '  ' + (pathTile.stepCount||'_') + (pathTile.goalFound === false ? `_${pathTile.score} `:`-${pathTile.goalFound}-`);
      //     });
      //     console.log(line)
      //   });
        console.log('----')
      // })
    } else {
      console.log('No score tiles');
    }
    // .reduce((bestProbe, exitProbe) => {
//       if (!bestProbe) {
//         return exitProbe;
//       }
//
//       if (bestProbe.score < exitProbe.score) {
//         return exitProbe;
//       }
//     })
    // this is palaceholder for when the path can be calculated from the scored
    // tiles
    let path = pathsFound[0];
    return path||[];
  }
}

module.exports = XmasRush;
