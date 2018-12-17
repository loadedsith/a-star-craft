/**
 * Help the Christmas elves fetch presents in a magical labyrinth!
 **/

let readline_;
if (typeof readline === 'undefined') {
  lines = require('./lines.js');
  readline_ = function() {
    return lines;
  }
} else {
  readline_ = readline;
}

console = {}
console.log = printErr;

const debugReadline_ = () => {
  return ''
  let results = readline();
  console.log(JSON.stringify(results));
  return results;
}

const DIRECTIONS = require('./directions.js');
const XmasRush = require('./xmasRush.js');
const Player = require('./player.js');
const Tile = require('./tile.js');
const xmasRush = new XmasRush(readline, printErr);
const difference = function (a, b) { return Math.abs(a - b); }

// game loop
while (true) {
  let move = '';
  xmasRush.readTurn();

  let tiles = xmasRush.tiles.map((tileRow) => {
    return tileRow.map((tile) => {
      return new Tile(tile);
    })
  });
  let player = xmasRush.players.find((player)=>{
    return player.playerId === 0;
  });

  let quest = xmasRush.getPlayerQuests(0)[0];
  let item = xmasRush.getPlayerItems(0).find((item) => {
      return item.name === quest.questItemName;
    });
  printErr(JSON.stringify({item}))
  printErr(JSON.stringify({quest}))
  let path = [];
  if (xmasRush.turnType === 1) {
    move = 'PASS';
    let exits = xmasRush.getOpenExits(xmasRush.getTile(player), player);
    let exitKeys = Object.keys(exits)
    if (exitKeys.length > 0) {
      move = `MOVE ${exitKeys[Math.round(exitKeys.length - 1)]}`;
    }

    // if (Object.keys(exits).length > 0) {

      path = xmasRush.getPath(player, item);
      if (path && path[1]) {
        let firstStep = path[1];
        if (firstStep && firstStep.direction) {
          move = `MOVE ${firstStep.direction}`
        }
      } else {
        // random exit
        let exitsKeys = Object.keys(exits);
        if (exitsKeys.length > 0) {
          let goodDirections = []
          if (item.x < player.x) {
            goodDirections.push('LEFT');
          } else if (item.x > player.x) {
            goodDirections.push('RIGHT');
          }
          if (item.y < player.y) {
            goodDirections.push('UP');
          } else if (item.y > player.y) {
            goodDirections.push('DOWN');
          }
          let direction = goodDirections.find((goodDirection) => {
            return exitsKeys.indexOf(goodDirection) > -1
          });
          if (direction) {
            move = `MOVE ${direction}`
          } else {
            // move = `MOVE ${exitsKeys[Math.floor(
            //     Math.random() * exitsKeys.length)]}`
          }
        }
      }
    // }
  } else {
    let directions = DIRECTIONS;
    let directionsKeys = Object.keys(directions);
    // let player = xmasRush.players[0];

    let goodDirections = [];
    let rowOrColumn = 0;
    let weighting = [1, 0, 0, 0 -1];
    let tigerToe = weighting[Math.floor(Math.random() * weighting.length)];
    if (difference(item.x, player.x) > difference(item.y, player.y)) {
      if (item.x < player.x) {
        goodDirections.push(['RIGHT', item.y]);
      } else if (item.x > player.x) {
        goodDirections.push(['LEFT', item.y]);
      } else {
        goodDirections.push(['RIGHT', item.y + tigerToe]);
      }
    } else {
      if (item.y < player.y) {
        goodDirections.push(['UP', player.x]);
      } else if (item.y > player.y) {
        goodDirections.push(['DOWN', player.x]);
      } else {
        goodDirections.push(['UP', player.x + tigerToe]);
      }
    }
    let randomPair = goodDirections[Math.floor(Math.random() *
        goodDirections.length)]
    let direction = randomPair[0];
    rowOrColumn = Math.max(0, Math.min(6, randomPair[1]));

    if (path.length > 0) {
      rowOrColumn = 0;
    }
    move = `PUSH ${rowOrColumn} ${direction}`;
  }

  // let turn = debugReadline_();
  // console.log(JSON.stringify({xmasRush}, null, 2));
  // console.log(JSON.stringify({players}, null, 2));
  // console.log(JSON.stringify({tiles: tiles[1][1]}, null, 2));

  // Write an action using print()
  // To debug: printErr('Debug messages...');

  print(move); // PUSH <id> <direction> | MOVE <direction> | PASS
}
