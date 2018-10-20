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
  if (!commands[x]) {
    commands[x] = []
  }
  commands[x][y] = command;
}


let x0 = 0;
let y0 = 0;
let length = 0;

const actions = [
  {
    action: (x, y, cell, lines) => {
      return addCommand(x, y, 'R');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        if (lines[x - 1][y] == '#' ) {
          if (lines[x + 1][y] == '#' ) {
            if (lines[x][y - 1] == '#' ) {
              printErr('gotone');

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
      return addCommand(x, y, 'L');
    },
    matcher: (x, y, cell, lines) => {
      if (cell == '.') {
        if (lines[x - 1][y] == '#' ) {
          if (lines[x + 1][y] == '#' ) {
            if (lines[x][y + 1] == '#' ) {
              printErr('gotone');

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

lines.forEach((line, x) => {
  printErr('line', line);

  line.forEach((cell, y) => {
    actions.forEach((action) => {
      if (action.matcher(x, y, cell, lines)) {
        action.action(x, y, cell, lines, commands);
      }
    });
  });
});

const getCommandString = (commands) => {
  return commands.reduce((acc, item, x) => {
    return acc + item.reduce((bcc, item, y) => {
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
printErr(JSON.stringify(robots));
// Write an action using print()
// To debug: printErr('Debug messages...');

let instructions = [
  x0, y0, 'R',
  x0 + length - 1, y0, 'L',
  x0 + length - 1, y0 + 1, 'L',
  x0 + length - 1, y0 + 2, 'L',
  x0 + length - 1, y0 + 3, 'L'
];
print(getCommandString(commands));
