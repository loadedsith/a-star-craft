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

// game loop
while (true) {
  let move = '';
  xmasRush.readTurn();
  let players = xmasRush.players.map((player) => {
    return new Player(player);
  });

  let tiles = xmasRush.tiles.map((tileRow) => {
    return tileRow.map((tile) => {
      return new Tile(tile);
    })
  });
  if (xmasRush.turnType === 1) {
    move = 'PASS';
    let player = xmasRush.players[0];
    let exits = xmasRush.getOpenExits(xmasRush.getTile(player), player);
    // if (Object.keys(exits).length > 0) {
      printErr(JSON.stringify({player, quests: xmasRush.quests}));
      let item = xmasRush.getPlayerItems(0)[0];
      printErr(JSON.stringify({item}));
      let path = xmasRush.getPath(player, item);
      printErr(JSON.stringify({path}));
      if (path && path[1]) {
        printErr('Found path, move:' + move);
        let firstStep = path[1];
        printErr(JSON.stringify({firstStep}));
        if (firstStep && firstStep.direction) {
          move = `MOVE ${firstStep.direction}`
        }
        printErr(JSON.stringify({firstStep}));
      } else {
        //random exit
        let exitsKeys = Object.keys(exits);
        if (exitsKeys.length > 0) {
          printErr(JSON.stringify({exitsKeys}));

          move = `MOVE ${exitsKeys[Math.floor(
              Math.random() * exitsKeys.length)]}`
          printErr('no path, move:' + move);

        }
      }
    // }
  } else {
    let directions = DIRECTIONS;
    let directionsKeys = Object.keys(directions);

    let item = xmasRush.getPlayerItems(0)[0];
    move = `PUSH ${item.playerId} ${directionsKeys[Math.floor(Math.random() * directionsKeys.length)]}`;
    printErr(JSON.stringify(xmasRush));
  }

  printErr(JSON.stringify({items:this.items}));
  // let turn = debugReadline_();
  // console.log(JSON.stringify({xmasRush}, null, 2));
  // console.log(JSON.stringify({players}, null, 2));
  // console.log(JSON.stringify({tiles: tiles[1][1]}, null, 2));

  // Write an action using print()
  // To debug: printErr('Debug messages...');

  print(move); // PUSH <id> <direction> | MOVE <direction> | PASS
}
