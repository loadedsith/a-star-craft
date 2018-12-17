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
const Tile = require('./tile.js');
const xmasRush = new XmasRush(readline, printErr);
const difference = function (a, b) { return Math.abs(a - b); }
const difference2d = function(start, end) {
  var a = start.x - end.x;
  var b = start.y - end.y;

  return Math.sqrt( a*a + b*b );
}
// game loop
while (true) {
  let move = '';
  xmasRush.readTurn();

  let player = xmasRush.players.find((player)=>{
    return player.playerId === 0;
  });
  let closestQuest = xmasRush.getPlayerQuests(0).map((quest) => {
    let closestItem = xmasRush.getPlayerItems(0).find((item) => {
      return item.name === quest.questItemName;
    });
    return xmasRush.getPath(player, closestItem);
  }).sort((a, b) => {
    printErr('a:'+a)
    return (a||[]).length - (b||[]).length;
  })[0];
  if (closestQuest == null) {
    let closestQuest = xmasRush.getPlayerQuests(0).map((quest) => {
      let closestItem = xmasRush.getPlayerItems(0).find((item) => {
        return item.name === quest.questItemName;
      });
      closestItem.distance = difference2d(closestItem, player);
      return closestItem
    }).sort((a, b) => {
      printErr('a:'+a)
      return a.distance - b.distance;
    })[0]
  }

  let quest = closestQuest||xmasRush.getPlayerQuests(0)[0];
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

    path = xmasRush.getPath(player, item);
    if (path && path[1]) {
      move = 'MOVE';
      for (var i = 1; i < path.length; i++) {
        move += ` ${path[i].direction}`;
      }
      printErr('move:'+move);
    } else {
      // random exit
      let exitsKeys = Object.keys(exits);
      if (exitsKeys.length > 0) {
        let goodDirections = [];
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
          return exitsKeys.indexOf(goodDirection) > -1;
        });
        if (direction) {
          move = `MOVE ${direction}`;
        }
      }
    }
  } else {
    let goodDirections = [];
    let rowOrColumn = 0;
    let weighting = [1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let tigerToe = weighting[Math.floor(Math.random() * weighting.length)];
    if (difference(item.x, player.x) > difference(item.y, player.y)) {
      if (item.x < player.x) {
        goodDirections.push(['RIGHT', item.y]);
      } else if (item.x > player.x) {
        goodDirections.push(['LEFT', item.y]);
      } else {
        goodDirections.push(['RIGHT', item.y]);
      }
    } else {
      if (item.y < player.y) {
        goodDirections.push(['DOWN', item.x]);
      } else if (item.y > player.y) {
        goodDirections.push(['UP', item.x]);
      } else {
        goodDirections.push(['UP', item.x]);
      }
    }
    let randomPair = goodDirections[Math.floor(Math.random() *
        goodDirections.length)];
    let direction = randomPair[0];
    rowOrColumn = Math.max(0, Math.min(6, randomPair[1] + tigerToe));

    if (path.length > 0) {
      direction = 'RIGHT';
      let otherPlayer = xmasRush.players.find((player)=>{
        return player.playerId === 1;
      }).x;
      rowOrColumn = otherPlayer.x;

    }
    move = `PUSH ${rowOrColumn} ${direction}`;
  }

  print(move); // PUSH <id> <direction> | MOVE <direction> | PASS
}
