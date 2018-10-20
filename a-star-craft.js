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
const lines = [];
const commands = [];

const addCommand = (x, y, command) => {
  if (!commands[y]) {
    commands[y] = []
  }
  commands[y][x] = command;
}

const getNeighbors = (x, y, cell, lines) => {
  return {
    // x is e-w
    // y is n-s
    e:  (lines[y]     || [])[x + 1] || false,
    n:  (lines[y - 1] || [])[x]     || false,
    ne: (lines[y - 1] || [])[x + 1] || false,
    nw: (lines[y - 1] || [])[x - 1] || false,
    s:  (lines[y + 1] || [])[x]     || false,
    se: (lines[y + 1] || [])[x + 1] || false,
    sw: (lines[y + 1] || [])[x - 1] || false,
    w:  (lines[y]     || [])[x - 1] || false,
  }
}

let x0 = 0;
let y0 = 0;
let length = 0;

const actions = [
  {
    action: (x, y, cell, lines) => {
      addCommand(x, y, 'R');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {n, w, s} = getNeighbors(x, y, cell, lines);
        printErr('n, w, s', n, w, s)
        if (n == '#') {
          if (w == '#') {
            if (s == '#') {
              printErr('got R');

              return true;
            }
          }
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
      addCommand(x, y, 'L');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        const {n, e, s} = getNeighbors(x, y, cell, lines);
        printErr('n, e, s', n, e, s)
        if (n == '#' ) {
          if (s == '#') {
            if (e == '#') {
              printErr('got L');

              return true;
            }
          }
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
      addCommand(x, y, 'R');
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
      addCommand(x, y, 'D');
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
      addCommand(x, y, 'L');
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
      addCommand(x, y, 'U');
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
      addCommand(x, y, 'D');
      addCommand(x, y, 'D');
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
      addCommand(x, y, 'U');
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

lines.forEach((line, y) => {
  printErr('line', line);

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
      return bcc + `${x} ${y} ${item} `
    }, '')
  }, '');
}

printErr('commands', getCommandString(commands));

const startPoint = [x0, y0];
const robotCount = parseInt(readline());

let robots = [];

let Robot = function(config={}) {
  return Object.assign({}, config);
};

for (let i = 0; i < robotCount; i++) {
  var inputs = readline().split(' ');
  const x = parseInt(inputs[0]);
  const y = parseInt(inputs[1]);
  const direction = inputs[2];
  robots.push([Robot({x, y, direction})]);
}

printErr('robots', JSON.stringify(robots));

// Write an action using print()
// To debug: printErr('Debug messages...');
print(getCommandString(commands) + '17 7 U');
