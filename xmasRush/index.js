/**
 * Help the Christmas elves fetch presents in a magical labyrinth!
 **/

debugReadline_ = () => {
  let results = readline();
  console.log(JSON.stringify(results));
  return results;
}

const XmasRush = require('./xmasRush.js');
const Player = require('./player.js');
const xmasRush = new XmasRush(debugReadline_, printErr);

// game loop
while (true) {
  xmasRush.readTurn();
  let players = xmasRush.players.map((player) => {
    return new Player(player);
  });
  let tiles = xmasRush.tiles.map((tileRow) => {
    return tileRow.map((tile) => {
      return new Tile(tile);
    })
  })

  // let turn = debugReadline_();
  console.log(JSON.stringify({xmasRush}, null, 2));
  console.log(JSON.stringify({players}, null, 2));
  console.log(JSON.stringify({tiles: tiles[1][1]}, null, 2));

  // Write an action using print()
  // To debug: printErr('Debug messages...');

  print('PUSH 3 RIGHT'); // PUSH <id> <direction> | MOVE <direction> | PASS
}
