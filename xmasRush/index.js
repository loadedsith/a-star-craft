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


const XmasRush = require('./xmasRush.js');
const xmasRush = new XmasRush(readline_);

// game loop
while (true) {
  xmasRush.readTurn();

  // Write an action using print()
  // To debug: printErr('Debug messages...');

  print('PUSH 3 RIGHT'); // PUSH <id> <direction> | MOVE <direction> | PASS
}
