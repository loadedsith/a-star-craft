/* global printErr readline */

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

/*
  Collect islands
  Set up islands with
  ************
  *>        <*
  *>        <*
  ************

  ********
  *\/ >  *
  * \/ > *
  *  \/ >*
  ********
*/
const printErrJSON = (label='jsonout:', object) => {
  printErr(label, JSON.stringify(object));
};

const mod = (a, n) => {
  return a - n * Math.floor(a/n);
};

/** Map */
class Map {
  /**
   * @param {Array=} lines Lines
   * @param {Array=} commands Commands
   * @param {Array=} actions Actions
   */
  constructor(lines = [], commands = [], actions = []) {
    this.lines = lines;
    this.commands = commands;
    this.actions = actions;
    this.runMatchers();
  }

  /**
   * getNeighbors
   * @param {number} x X
   * @param {number} y Y
   * @param {string} cell Cell
   * @return {Object}
   */
  getNeighbors(x, y, cell) {
    const lines = this.lines;
    const northLine = lines[mod(y - 1, lines.length)];
    const southLine = lines[mod(y + 1, lines.length)];
    const eastI = x + 1;
    const westI = x - 1;

    return {
      // x is e-w
      // y is n-s
      e:  (lines[y]  || [])[mod(eastI, lines[y].length)] || false,
      n:  (northLine || [])[x]     || false,
      ne: (northLine || [])[mod(eastI, northLine.length)] || false,
      nw: (northLine || [])[mod(westI, northLine.length)] || false,
      s:  (southLine || [])[x]     || false,
      se: (southLine || [])[mod(eastI, southLine.length)] || false,
      sw: (southLine || [])[mod(westI, southLine.length)] || false,
      w:  (lines[y]  || [])[mod(westI, lines[y].length)] || false,
    };
  };

  /** runMatchers */
  runMatchers() {
    this.lines.forEach((line, y) => {
      line.forEach((cell, x) => {
        this.actions.forEach((action) => {
          if (action.matcher.call(this, x, y, cell)) {
            printErr('matched', Object.keys(this));
            action.action.call(this, x, y, cell);
          }
        });
      });
    });
  }

  /**
   * getCommandString
   * @param {string} commands Commands
   * @return {string}
   */
  getCommandString(commands) {
    commands = commands || this.commands;

    return commands.reduce((acc, item, y) => {
      return acc + item.reduce((bcc, item, x) => {
        return bcc + `${x} ${y} ${item} `;
      }, '');
    }, '');
  }

  /**
   * isCommandSafe
   * @param {number} x X
   * @param {number} y Y
   * @param {string} cell Cell
   * @param {string} command Command
   * @return {string|boolean}
   */
  isCommandSafe(x, y, cell, command) {
    let safe = false;
    const {n, w, s, e} = this.getNeighbors(x, y, cell);

    switch (command) {
      case 'R':
        safe = e != '#';
        break;
      case 'L':
        safe = w != '#';
        break;
      case 'U':
        safe = n != '#';
        break;
      case 'D':
        safe = s != '#';
        break;
    }

    return safe;
  };

  /**
   * getCellCoordsInDir
   * @param {string} dir Dir
   * @param {number} x X
   * @param {number} y Y
   * @return {Object}
   */
  getCellCoordsInDir(dir, x, y) {
    const lines = this.lines;
    const northI = mod(y - 1, lines.length);
    const southI = mod(y + 1, lines.length);
    const eastI = x + 1;
    const westI = x - 1;

    return {
      // x is e-w
      // y is n-s
      e:  {
        x: mod(eastI, lines[y].length),
        y,
      },
      n:  {
        x,
        y: northI,
      },
      ne: {
        x: mod(eastI, northI.length),
        y: northI,
      },
      nw: {
        x: mod(westI, northI.length),
        y: northI,
      },
      s:  {
        x,
        y: southI,
      },
      se: {
        x: mod(eastI, southI.length),
        y: southI,
      },
      sw: {
        x: mod(westI, southI.length),
        y: southI,
      },
      w:  {
        x: mod(westI, lines[y].length),
        y,
      },
    }[dir];
  };

  /**
   * addCommand
   * @param {number} x X
   * @param {number} y Y
   * @param {string} cell Cell
   * @param {string} command Command
   */
  addCommand(x, y, cell, command) {
    if (!this.commands[y]) {
      this.commands[y] = [];
    }

    if (this.isCommandSafe(x, y, cell, command)) {
      this.commands[y][x] = command;
      this.lines[y][x] = command;
      // todo: optimize this here so that it uses the follow
      //       logic to pick the best arrow
    }
  };
}

const isArrow = (cell) => {
  let arrow = false;
  switch (cell) {
    case 'U':
    case 'D':
    case 'R':
    case 'L':
      arrow = true;
      break;
  }

  return arrow;
};

const isDir = (cell) => {
  let dir = false;

  switch (cell) {
    case 'ne':
    case 'n':
    case 'nw':
    case 'w':
    case 'sw':
    case 's':
    case 'se':
    case 'e':
      dir = true;
      break;
  }

  return dir;
};

const arrowToDir = (cell) => {
  let dir = false;

  switch (cell) {
    case 'U':
      dir = 'n';
      break;
    case 'D':
      dir = 's';
      break;
    case 'R':
      dir = 'e';
      break;
    case 'L':
      dir = 'w';
      break;
  }

  return dir;
};

const dirToArrow = (cell) => {
  let arrow = false;
  switch (cell) {
    case 'n':
      arrow = 'U';
      break;
    case 's':
      arrow = 'D';
      break;
    case 'e':
      arrow = 'R';
      break;
    case 'w':
      arrow = 'L';
      break;
  }

  return arrow;
};


const actions = [
  {
    action: function(x, y, cell) {
      // printErr('Rectangle!');
    },
    matcher: function(x, y, cell) {
      const lines = this.lines;
      if (cell == '.') {
        let {e} = this.getNeighbors(x, y, cell);
        // printErr('rectangle cell', x, y);
        // printErr('rectangle next row', x, y + 1);
        let startX = x;
        // let startY = y;
        let coords = this.getCellCoordsInDir('e', x, y);
        let nextX = coords.x;
        let nextY = coords.y;
        // let rectangle = [x, y];
        let length = 1;
        let height = 1;

        while (e != '#' && nextX != startX) {
          // printErr('rectangle cell', coords.x, coords.y);
          coords = this.getCellCoordsInDir('e', nextX, nextY);
          e = this.getNeighbors(coords.x, coords.y, e).e;
          let nextRowFirstCell = lines[nextY + 1][startX];
          // printErr('nextRowFirstCell', nextRowFirstCell);
          nextX = coords.x;
          nextY = coords.y;

          if (e == '#' && nextRowFirstCell != '#') {
            nextX = startX + 1;
            nextY += 1;
            height = +1;
            e = nextRowFirstCell;
          } else {
            length = +1;
          }
        }

        printErr('e, nextX, startX', e, nextX, startX);
        printErr('length height: ', length, height);

        return true;
      }

      return false;
    },
    name: `
    #####
    #PPP#
    #PPP#
    #PPP#
    #####
    `,
  },
  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'R');
    },
    matcher: function(x, y, cell) {
      if (cell == '.') {
        const {n, w, s} = this.getNeighbors(x, y, cell);

        if (n == '#' && w == '#' && s == '#') {
          return true;
        }
      }

      return false;
    },
    name: `
     #
    #P
     #
    `,
  },
  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'L');
    },
    matcher: function(x, y, cell) {
      if (cell == '.') {
        const {n, e, s} = this.getNeighbors(x, y, cell);

        if (n == '#' && s == '#' && e == '#') {
          return true;
        }
      }

      return false;
    },
    name: `
     #
     P#
     #
    `,
  },
  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'R');
      printErr('>.', x, y, cell, 'R');
    },
    matcher: function(x, y, cell) {
      if (cell == '.' || isArrow(cell)) {
        const {n, w, se, e, s} = this.getNeighbors(x, y, cell);

        if (n == '#' && w == '#' && se == '#') {
          if (e == '.' && s == '.') {
            return true;
          } else {
            printErr('match x y', x, y);
            printErr('e and s', e, s);
          }
        }
      }

      return false;
    },
    name: `
     #
    #PP
     P#
    `,
  },
  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'D');
    },
    matcher: function(x, y, cell) {
      if (cell == '.') {
        const {n, e, sw, w, s} = this.getNeighbors(x, y, cell);
        if (n == '#' && e == '#' && sw == '#') {
          if (w == '.' && s == '.') {
            return true;
          }
        }
      }

      return false;
    },
    name: `
     #
    PP#
    #P
    `,
  },
  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'L', map);
    },
    matcher: function(x, y, cell) {
      if (cell == '.') {
        const {nw, e, s, n, w} = this.getNeighbors(x, y, cell);

        if (nw == '#' && e == '#' && s == '#') {
          if (n == '.' && w == '.') {
            return true;
          }
        }
      }

      return false;
    },
    name: `
    #P
    PP#
     #
    `,
  },
  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'U');
    },
    matcher: function(x, y, cell) {
      if (cell == '.' || isArrow(cell)) {
        const {ne, w, s, n, e} = this.getNeighbors(x, y, cell, this.lines);

        if (ne == '#' && w == '#' && s == '#') {
          if (n == '.' && e == '.') {
            return true;
          }
        }
      }

      return false;
    },
    name: `
     P#
    #PP
     #
    `,
  },
  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'D');
    },
    matcher: function(x, y, cell) {
      if (cell == '.') {
        const {n, s, sw, se} = this.getNeighbors(x, y, cell);

        if (n == '#') {
          if (s == '.' && sw == '.' && se == '.') {
            return true;
          }
        }
      }

      return false;
    },
    name: `
     #
     P
    PPP
    `,
  },
  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'U');
    },
    matcher: function(x, y, cell) {
      if (cell == '.') {
        const {n, s, ne, nw} = this.getNeighbors(x, y, cell);

        if (s == '#') {
          if (n == '.' && ne == '.' && nw == '.') {
            return true;
          }
        }
      }

      return false;
    },
    name: `
    PPP
     P
     #
    `,
  },
  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'R', map);
    },
    matcher: function(x, y, cell) {
      if (cell == '.') {
        const {w, s, n} = this.getNeighbors(x, y, cell, lines);

        if (w == '#' && s == '#') {
          if (n == 'D') {
            return true;
          }
        }
      }

      return false;
    },
    name: `
     D
    #P
     #
    `,
  },

  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'L');
    },
    matcher: function(x, y, cell) {
      if (cell == '.') {
        const {s, n, e} = this.getNeighbors(x, y, cell, this.lines);

        if (e == '#' && s == '#') {
          if (n == 'D') {
            return true;
          }
        }
      }

      return false;
    },
    name: `
     D
     P#
     #
    `,
  },

  {
    action: function(x, y, cell) {
      this.addCommand(x, y, cell, 'L');
    },
    matcher: function(x, y, cell) {
      if (cell == '.') {
        const {s, n, e} = this.getNeighbors(x, y, cell);

        if (e == '#' && s == '#') {
          if (n == 'D') {
            return true;
          }
        }
      }

      return false;
    },
    name: `
     D
     P#
     #
    `,
  },
];

printErr('map:');
let lines = [];
for (let i = 0; i < 10; i++) {
  const line = readline();
  lines.push([...line]);
  printErr(line);
}

const map = new Map(lines, [], actions);


// const startPoint = [x0, y0];
const robotCount = parseInt(readline());

let robots = [];

/** Soft kitty warm kitty. */
class Robot {
  /**
   * Little ball of fur.
   * @param {Object=} config Happy kitty.
   */
  constructor(config = {}) {
    return Object.assign(this, config);
  }
}

for (let i = 0; i < robotCount; i++) {
  const inputs = readline().split(' ');
  const x = parseInt(inputs[0]);
  const y = parseInt(inputs[1]);
  const direction = inputs[2];

  robots.push(new Robot({
    direction,
    x,
    y,
  }));
}

printErr('robots', JSON.stringify(robots));
robots.forEach(({x, y, direction}) => {
  if (!map.isCommandSafe(x, y, '.', direction)) {
    let newDir = direction;
    switch (direction) {
      case 'U':
        newDir = 'D';
        break;
      case 'D':
        newDir = 'U';
        break;
      case 'R':
        newDir = 'L';
        break;
      case 'L':
        newDir = 'R';
        break;
    }
    map.addCommand(x, y, '.', newDir);
  }
});

let maxScore = 40;
const follow = (cell, x, y, map, lastDir, steps=[], score=0) => {
  // printErrJSON('follow', {
  //   cell,
  //   lastDir,
  //   score,
  //   x,
  //   y,
  // });
  const neighbors = map.getNeighbors(x, y, cell);

  let nextCell = false;
  if (isArrow(cell)) {
    nextCell = arrowToDir(cell);
    lastDir = nextCell;
  } else if (cell != '#') {
    nextCell = lastDir;
  } else {
    // printErr('thats a #, abort');
  }

  const stepSignature = `${x} ${y} ${nextCell}`;
  printErr('step', `${x} ${y} ${nextCell} ${cell}`);
  if (nextCell && !steps.includes(stepSignature) && score <= maxScore) {
    let coords = map.getCellCoordsInDir(nextCell, x, y);
    steps.push(`${x} ${y} ${nextCell}`);

    return follow(
        neighbors[nextCell],
        coords.x,
        coords.y,
        map,
        lastDir,
        steps,
        ++score);
  }

  return score;
};


robots.forEach(({x, y, direction}, i) => {
  printErr('robot', i, ':');
  const neighbors = map.getNeighbors(x, y, '.');
  const scores = {};

  ['n', 's', 'e', 'w'].forEach((dir) => {
    printErr('dir', dir);
    const cell = neighbors[dir];
    const coords = map.getCellCoordsInDir(dir, x, y);
    const tmpLines = JSON.parse(JSON.stringify(map.lines));
    tmpLines[y][x] = dirToArrow(dir);
    let tmpMap = new Map(tmpLines);
    scores[dir] = follow(cell, coords.x, coords.y, tmpMap, dir);
  });

  printErrJSON('scores', scores);
  let highScoreDir = Object.keys(scores)
      .reduce((a, b) => scores[a] > scores[b] ? a : b);

  printErrJSON('highScoreDir', highScoreDir);
  let command = dirToArrow(highScoreDir);
  printErrJSON('command', command);
  // ?? Ignore the pathfinding if the scores aren't a significant gain ??
  if (scores[highScoreDir] > 3) {
    map.addCommand(x, y, lines[y][x], command);
  }
});

// Write an action using print()
// To debug: printErr('Debug messages...');
printErr('commands', map.getCommandString());
print(map.getCommandString());
