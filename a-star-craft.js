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

const lines = [];
const commands = [];
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
  let dir = false
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

const getCellCoordsInDir = (dir, x, y, lines) => {
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

const getNeighbors = (x, y, cell, lines) => {
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

const isCommandSafe = function(x, y, cell, command) {
  let safe = false;
  const {n, w, s, e} = getNeighbors(x, y, cell, lines);

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

const addCommand = (x, y, cell, command) => {
  if (!commands[y]) {
    commands[y] = [];
  }

  if (isCommandSafe(x, y, cell, command)) {
    commands[y][x] = command;
  }
};


let x0 = 0;
let y0 = 0;
let length = 0;

const actions = [
  {
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'R');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {n, w, s} = getNeighbors(x, y, cell, lines);

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
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'L');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {n, e, s} = getNeighbors(x, y, cell, lines);

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
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'R');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {n, w, se, e, s} = getNeighbors(x, y, cell, lines);

        if (n == '#' && w == '#' && se == '#') {
          if (e == '.' && s == '.') {
            return true;
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
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'D');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {n, e, sw, w, s} = getNeighbors(x, y, cell, lines);
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
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'L');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {nw, e, s, n, w} = getNeighbors(x, y, cell, lines);

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
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'U');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {ne, w, s, n, e} = getNeighbors(x, y, cell, lines);

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
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'D');
      // addCommand(x, y + 1, cell, 'D');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {n, s, sw, se} = getNeighbors(x, y, cell, lines);

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
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'U');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {n, s, ne, nw} = getNeighbors(x, y, cell, lines);

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
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'R');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {w, s, n} = getNeighbors(x, y, cell, lines);

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
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'L');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {s, n, e} = getNeighbors(x, y, cell, lines);

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
    action: (x, y, cell, lines) => {
      addCommand(x, y, cell, 'L');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {s, n, e} = getNeighbors(x, y, cell, lines);

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

for (let i = 0; i < 10; i++) {
  const line = readline();

  lines.push([...line]);
  // printErr('lines', lines.join('\n'));
  let firstDot = line.indexOf('.');
  if (!x0 && firstDot > -1) {
    x0 = firstDot;
    y0 = i;
    length = line.match(/\./g).length;
  }
  printErr('length', length);
}

printErr('x0', x0, 'y0', y0);

printErr('map:');
lines.forEach((line, y) => {
  printErr(line.join(''));
});

lines.forEach((line, y) => {
  line.forEach((cell, x) => {
    actions.forEach((action) => {
      if (action.matcher(x, y, cell, lines)) {
        action.action(x, y, cell, lines, commands);
      }
    });
  });
});

const getCommandString = (commands) => {
  return commands.reduce((acc, item, y) => {
    return acc + item.reduce((bcc, item, x) => {
      return bcc + `${x} ${y} ${item} `;
    }, '');
  }, '');
};

printErr('commands', getCommandString(commands));

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
  printErr('x, y, direction', x, y, direction);

  if (!isCommandSafe(x, y, '.', direction)) {
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
    addCommand(x, y, '.', newDir);
  }
});
let maxScore = 25;
const follow = (cell, x, y, lines, lastDir, steps=[], score=0) => {
  printErrJSON('follow', {
    cell,
    lastDir,
    score,
    x,
    y,
  });
  const neighbors = getNeighbors(x, y, cell, lines);

  let nextCell = false
  if (isArrow(cell)) {
    nextCell = arrowToDir(cell);
    lastDir = nextCell;
  } else if (cell != '#') {
    nextCell = lastDir;
  } else {
    printErr('thats a #, abort');
  }

  // printErrJSON('next cell getCellCoordsInDir', nextCell,
      // getCellCoordsInDir(nextCell, x, y, lines));
  const stepSignature = `${x} ${y} ${nextCell}`;
  printErr('stepSignature', stepSignature);
  if (nextCell && !steps.includes(stepSignature) && score <= maxScore) {
    let coords = getCellCoordsInDir(nextCell, x, y, lines);
    steps.push(`${x} ${y} ${nextCell}`);
    return follow(neighbors[nextCell], coords.x, coords.y, lines, lastDir, steps, ++score);
  }

  return score;
};


robots.forEach(({x, y, direction}, i) => {
  printErr('robot', i, ':');
  const neighbors = getNeighbors(x, y, '.', lines);
  const scores = {};

  ['n', 's', 'e', 'w'].forEach((dir) => {
    printErr('dir', dir);
    const cell = neighbors[dir];
    const coords = getCellCoordsInDir(dir, x, y, lines);
    const tmpLines = JSON.parse(JSON.stringify(lines));
    tmpLines[y][x] = dirToArrow(dir);
    scores[dir] = follow(cell, coords.x, coords.y, tmpLines, dir);
  });

  printErrJSON('scores', scores);
  let highScoreDir = Object.keys(scores)
      .reduce((a, b) => scores[a] > scores[b] ? a : b);

  printErrJSON('highScoreDir', highScoreDir);
  let command = dirToArrow(highScoreDir);
  printErrJSON('command', command);
  // ?? Ignore the pathfinding if the scores aren't a significant gain ??
  if (scores[highScoreDir] > 3) {
    addCommand(x, y, lines[y][x], command);
  }
});

// Write an action using print()
// To debug: printErr('Debug messages...');
print(getCommandString(commands));
