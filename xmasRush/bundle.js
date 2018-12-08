(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
const xmasRush = XmasRush(readline_);

// game loop
while (true) {
  xmasRush.readTurn();

  // Write an action using print()
  // To debug: printErr('Debug messages...');

  print('PUSH 3 RIGHT'); // PUSH <id> <direction> | MOVE <direction> | PASS
}

},{"./lines.js":2,"./xmasRush.js":3}],2:[function(require,module,exports){
module.exports = [
  '1233',
  '1233',
  '1233',
  '1233',
  '1233',
];

},{}],3:[function(require,module,exports){

/** Challenge class. */
class XmasRush {
  constructor(readline_) {
    let lines;

    Object.assign(this, {
      items: [],
      players: [],
      quests: [],
      readline: readline_,
      tiles: [[]],
      turnType: null,
    });
  }

  readTurn() {
    this.turnType = parseInt(this.readline());
    for (let i = 0; i < 7; i++) {
      const inputs = this.readline().split(' ');
      this.tiles[i] = [];
      for (let j = 0; j < 7; j++) {
        this.tiles[i].push(inputs[j]);
      }
    }

    for (let i = 0; i < 2; i++) {
      const inputs = this.readline().split(' ');
      this.player[i] = {
        // The total number of quests for a player (hidden and revealed).
        numPlayerCards: parseInt(inputs[0]),
        playerTile: inputs[3],
        playerX: parseInt(inputs[1]),
        playerY: parseInt(inputs[2]),
      };
    }

    const numItems = parseInt(this.readline());
    for (let i = 0; i < numItems; i++) {
      const inputs = this.readline().split(' ');
      this.items.push({
        itemName: inputs[0],
        itemPlayerId: parseInt(inputs[3]),
        itemX: parseInt(inputs[1]),
        itemY: parseInt(inputs[2]),
      });
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
}

module.exports = XmasRush;

},{}]},{},[1]);
