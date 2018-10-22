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

const randomDir = function() {
  return ['U', 'D', 'L', 'R'][Math.floor(Math.random() * 4)];
};

const pickTheBestDirection = function(x, y, map, startingDir) {
  const neighbors = map.getNeighbors(x, y, '.');
  const scores = {};
  let command = startingDir;
  ['n', 's', 'e', 'w'].forEach((dir) => {
    // printErrJSON('dir', dir);
    const cell = neighbors[dir];
    const coords = map.getCellCoordsInDir(dir, x, y);
    const tmpLines = JSON.parse(JSON.stringify(map.lines));
    tmpLines[y][x] = dirToArrow(dir);
    let tmpMap = new Map(tmpLines);
    scores[dir] = follow(cell, coords.x, coords.y, tmpMap, dir);
  });

  printErrJSON(`scores ${x} ${y}`, scores);
  let highScoreDir = Object.keys(scores)
      .reduce((a, b) => scores[a] > scores[b] ? a : b);
  // printErrJSON('Bcommand', command);
  // printErrJSON('highScoreDir', scores[highScoreDir]);
  // printErrJSON('highScoreDir', dirToArrow(highScoreDir));
  // ?? Ignore the pathfinding if the scores aren't a significant gain ??
  if (scores[highScoreDir] > 1) {
    command = dirToArrow(highScoreDir);
  }
  // printErrJSON('Acommand', command);
  return command;
};

const follow = (cell, x, y, map, lastDir, steps=[], score=0, maxScore=40) => {
  const neighbors = map.getNeighbors(x, y, cell);
  let debug = false;
  let nextCell = false;

  if (isArrow(cell)) {
    // printErr('isArrow')
    nextCell = arrowToDir(cell);
    lastDir = nextCell;
  } else if (cell != '#') {
    // printErr('is not #, last dir:', lastDir)
    nextCell = lastDir;
  } else {
    // printErr('thats a #, abort');
    return score;
  }

  const stepSignature = `${x} ${y} ${nextCell}`;
  // printErr('step', `${x} ${y} ${nextCell} ${cell}`);
  if (nextCell && !steps.includes(stepSignature) && score <= maxScore) {
    // printErrJSON('nextCell:', nextCell)
    let coords = map.getCellCoordsInDir(nextCell, x, y);
    steps.push(`${x} ${y} ${nextCell}`);

    return follow(
        neighbors[nextCell],
        coords.x,
        coords.y,
        map,
        lastDir,
        steps,
        ++score,
        maxScore);
  }

  return score;
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
    const linesY = lines[mod(y, lines.length)];
    if (x == 5 && y == 0) {
      printErr('linesY', linesY)
      printErr('linesY.length', linesY.length)
      printErr('mod(westI, linesY.length)', mod(westI, linesY.length))
      printErr('w', (linesY || [])[mod(westI, linesY.length)]);
    }
    return {
      // x is e-w
      // y is n-s
      e:  (linesY    || [])[mod(eastI, linesY.length)] || false,
      n:  (northLine || [])[x]     || false,
      ne: (northLine || [])[mod(eastI, northLine.length)] || false,
      nw: (northLine || [])[mod(westI, northLine.length)] || false,
      s:  (southLine || [])[x]     || false,
      se: (southLine || [])[mod(eastI, southLine.length)] || false,
      sw: (southLine || [])[mod(westI, southLine.length)] || false,
      w:  (linesY    || [])[mod(westI, linesY.length)] || false,
    };
  };

  /** runMatchers */
  runMatchers() {
    this.lines.forEach((line, y) => {
      line.forEach((cell, x) => {
        this.actions.forEach((action) => {
          if (action.matcher.call(this, x, y, cell)) {
            action.action.call(this, x, y, cell);
            printErr('map:');
            for (let i = 0; i < 10; i++) {
              printErr(this.lines[i]);
            }

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
    const northI = mod(y - 1, this.lines.length);
    const southI = mod(y + 1, this.lines.length);
    const eastI = x + 1;
    const westI = x - 1;
    y = mod(y, this.lines.length);
    x = mod(x, this.lines[0].length);

    return {
      // x is e-w
      // y is n-s
      e:  {
        x: mod(eastI, this.lines[mod(y, this.lines[0].length)].length),
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
        x: mod(westI, this.lines[0].length),
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
    y = mod(y, this.lines.length);
    x = mod(x, this.lines[0].length);

    if (!this.commands[y]) {
      this.commands[y] = [];
    }

    if (this.isCommandSafe(x, y, cell, command)) {
      command = pickTheBestDirection(x, y, this, command);
      if (this.lines[y][x] != '#') {
        this.commands[y][x] = command;
        this.lines[y][x] = command;
      }
    }
  };
}

const actions = [
  {
    action: function(x, y, cell) {
      printErr('Rectangle!');
    },
    matcher: function(x, y, cell) {
      return false//disabled
      const lines = this.lines;

      if (cell == '.') {
        let steps = [`${x} ${y}`];
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

        while (e != '#' && nextX != startX && length <= 4 && height <= 4 && !steps.includes(`${nextX} ${nextY}`)) {
          printErrJSON('steps',steps);
          printErrJSON('length',length);
          printErrJSON('height',height);
          steps.push(`${nextX} ${nextY}`);
          // printErr('rectangle cell', coords.x, coords.y);
          coords = this.getCellCoordsInDir('e', nextX, nextY);
          e = this.getNeighbors(coords.x, coords.y, e).e;
          let nextRowFirstCell = lines[mod(nextY + 1, lines.length)][startX];
          // printErr('nextRowFirstCell', nextRowFirstCell);
          nextX = coords.x;
          nextY = coords.y;
          length = length + 1;
          if ((e == '#' || length <= 4) && nextRowFirstCell != '#' ) {
            nextX = startX;
            nextY = nextY + 1;
            height = height + 1;
            length = 1;
            e = nextRowFirstCell;
          }
        }

        // printErr('e, nextX, startX', e, nextX, startX);
        // printErr('length height: ', length, height);

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
      return false
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
      return false
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
      // printErr('>.', x, y, cell, 'R');
    },
    matcher: function(x, y, cell) {
      return false

      if (cell == '.' || isArrow(cell)) {
        const {n, w, se, e, s} = this.getNeighbors(x, y, cell);

        if (n == '#' && w == '#') {
          if (e == '.' && s == '.') {
            return true;
          } else {
            // printErr('match x y', x, y);
            // printErr('e and s', e, s);
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
      return false

      if (cell == '.') {
        const {n, e, sw, w, s} = this.getNeighbors(x, y, cell);
        if (n == '#' && e == '#') {
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
      this.addCommand(x, y, cell, 'L');
    },
    matcher: function(x, y, cell) {
      return false

      if (cell == '.') {
        const {nw, e, s, n, w} = this.getNeighbors(x, y, cell);

        if (e == '#' && s == '#') {
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
      return false

      if (cell == '.' || isArrow(cell)) {
        const {ne, w, s, n, e} = this.getNeighbors(x, y, cell, this.lines);

        if (w == '#' && s == '#') {
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
      return false

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
      return false

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
      return false

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
      return false

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
      return false

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

  {
    action: function(x, y, cell) {
      this.addCommand(x - 1, y, cell, 'U');
      this.addCommand(x + 1, y, cell, 'D');
      this.addCommand(x, y, cell, 'R');
      this.addCommand(x, y - 1, cell, 'U');
      this.addCommand(x, y + 1, cell, 'U');
    },
    matcher: function(x, y, cell) {
      if (x==5 && y==0) {
        const neighbors = this.getNeighbors(x, y, cell);
        printErrJSON('neighbors', neighbors);
        printErr('x', x);
        printErr('y', y);
        printErr('cell', cell);
      }
      if (cell == '.'||isArrow(cell)) {
        const {n, ne, e, se, s, sw, w, nw} = this.getNeighbors(x, y, cell);

        if (w == '#' && sw == '#' && ne == '#' && se == '#') {
          if (
            (e == '.'||isArrow(e)) &&
            (n == '.'||isArrow(n)) &&
            (s == '.'||isArrow(s))
          ) {
            printErr(`${x} ${y} -----`)
            return true;
          }
        }
      }

      return false;
    },
    name: `
      P#
     #PP
     #P#
    `,
  },

  {
    action: function(x, y, cell) {
      this.addCommand(x - 1, y, cell, 'L');
      this.addCommand(x, y, cell, 'L');
      this.addCommand(x, y - 1, cell, 'D');
      this.addCommand(x, y + 1, cell, 'D');
    },
    matcher: function(x, y, cell) {
      if (cell == '.'||isArrow(cell)) {
        const {n, ne, e, se, s, sw, w, nw} = this.getNeighbors(x, y, cell);

        if (nw == '#' && e == '#' && sw == '#' && se == '#') {
          if (
            (w == '.'||isArrow(w)) &&
            (n == '.'||isArrow(n)) &&
            (s == '.'||isArrow(s))
          ) {
            return true;
          }
        }
      }

      return false;
    },
    name: `
     #P
     PP#
     #P#
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
// Point the robots in a safe direction, for starters.
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
  if (scores[highScoreDir] > 1) {
    map.addCommand(x, y, lines[y][x], command);
  } else {

  }
});

// Write an action using print()
// To debug: printErr('Debug messages...');
printErr('commands', map.getCommandString());
print(map.getCommandString());
