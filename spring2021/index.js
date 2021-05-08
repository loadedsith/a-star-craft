/*
 Game {
  day: 20,
  nutrients: 18,
  cells: [
    Cell { index: 0, richness: 3, neighbors: [Array] },
    Cell { index: 1, richness: 3, neighbors: [Array] },
    Cell { index: 2, richness: 3, neighbors: [Array] },
    Cell { index: 3, richness: 3, neighbors: [Array] },
    Cell { index: 4, richness: 3, neighbors: [Array] },
    Cell { index: 5, richness: 3, neighbors: [Array] },
    Cell { index: 6, richness: 3, neighbors: [Array] },
    Cell { index: 7, richness: 2, neighbors: [Array] },
    Cell { index: 8, richness: 2, neighbors: [Array] },
    Cell { index: 9, richness: 2, neighbors: [Array] },
    Cell { index: 10, richness: 2, neighbors: [Array] },
    Cell { index: 11, richness: 2, neighbors: [Array] },
    Cell { index: 12, richness: 2, neighbors: [Array] },
    Cell { index: 13, richness: 2, neighbors: [Array] },
    Cell { index: 14, richness: 2, neighbors: [Array] },
    Cell { index: 15, richness: 2, neighbors: [Array] },
    Cell { index: 16, richness: 2, neighbors: [Array] },
    Cell { index: 17, richness: 2, neighbors: [Array] },
    Cell { index: 18, richness: 2, neighbors: [Array] },
    Cell { index: 19, richness: 1, neighbors: [Array] },
    Cell { index: 20, richness: 1, neighbors: [Array] },
    Cell { index: 21, richness: 1, neighbors: [Array] },
    Cell { index: 22, richness: 1, neighbors: [Array] },
    Cell { index: 23, richness: 1, neighbors: [Array] },
    Cell { index: 24, richness: 1, neighbors: [Array] },
    Cell { index: 25, richness: 1, neighbors: [Array] },
    Cell { index: 26, richness: 1, neighbors: [Array] },
    Cell { index: 27, richness: 1, neighbors: [Array] },
    Cell { index: 28, richness: 1, neighbors: [Array] },
    Cell { index: 29, richness: 1, neighbors: [Array] },
    Cell { index: 30, richness: 1, neighbors: [Array] },
    Cell { index: 31, richness: 1, neighbors: [Array] },
    Cell { index: 32, richness: 1, neighbors: [Array] },
    Cell { index: 33, richness: 1, neighbors: [Array] },
    Cell { index: 34, richness: 1, neighbors: [Array] },
    Cell { index: 35, richness: 1, neighbors: [Array] },
    Cell { index: 36, richness: 1, neighbors: [Array] }
  ],
  possibleActions: [
    Action { type: '6', targetCellIdx: 3, sourceCellIdx: undefined },
    Action { type: '7', targetCellIdx: 3, sourceCellIdx: undefined },
    Action { type: '8', targetCellIdx: 3, sourceCellIdx: undefined },
    Action { type: '10', targetCellIdx: 3, sourceCellIdx: undefined }
  ],
  trees: [ Tree { cellIndex: 3, size: 3, isMine: false, isDormant: false } ],
  mySun: 18,
  myScore: 0,
  opponentsSun: 0,
  opponentScore: NaN,
  opponentIsWaiting: true,
  opponentSun: 12
}
 */


let readline_;
let line_ = 0;
let turn_ = 0;
if (typeof readline === 'undefined') {
  lines = require('./lines.js');
  readline_ = function() {
    return lines[turn_][line_++];
  }
} else {
  readline_ = readline;
}

const debugReadline_ = () => {
  let results = readline_();
  console.error(results);
  return results;
}

readline = debugReadline_;

class Cell {
  constructor(index, richness, neighbors) {
    this.index = index
    this.richness = richness
    this.neighbors = neighbors
  }
}

class Tree {
  constructor(cellIndex, size, isMine, isDormant) {
	this.cellIndex = cellIndex
    this.size = size
    this.isMine = isMine
    this.isDormant = isDormant
  }
}

const WAIT = 'WAIT'
const SEED = 'SEED'
const GROW = 'GROW'
const COMPLETE = 'COMPLETE'
class Action {
  constructor(type, targetCellIdx, sourceCellIdx) {
    this.type = type
    this.targetCellIdx = targetCellIdx
    this.sourceCellIdx = sourceCellIdx
  }
  
  static parse(line) {
    const parts = line.split(' ')
    if (parts[0] === WAIT) {
      return new Action(WAIT)
    }
    if (parts[0] === SEED) {
      return new Action(SEED, parseInt(parts[2]), parseInt(parts[1]))
    }
    return new Action(parts[0], parseInt(parts[1]))
  }
  
  toString() {
    if (this.type === WAIT) {
      return WAIT
    }
    
    if (this.type === SEED) {
      return `${SEED} ${this.sourceCellIdx} ${this.targetCellIdx}`
    }
    
    return `${this.type} ${this.targetCellIdx}`
  }
}

class Game {
  constructor() {
    this.day = 0
    this.nutrients = 0
    this.cells = []
    this.possibleActions = []
    this.trees = []
    this.mySun = 0
    this.myScore = 0
    this.opponentsSun = 0
    this.opponentScore = 0
    this.opponentIsWaiting = 0
  }
  
  getNextAction() {
    // TODO: write your algorithm here
    let firstComplete = this.possibleActions.find((a) => {
      return a.type == COMPLETE;
    });
    
    if (firstComplete) {
      return firstComplete;
    }
    
    return this.possibleActions[this.possibleActions.length-1]
  }
}

const game = new Game()

const numberOfCells = parseInt(readline());
for (let i = 0; i < numberOfCells; i++) {
  var inputs = readline().split(' ');
  const index = parseInt(inputs[0]);
  const richness = parseInt(inputs[1]);
  const neigh0 = parseInt(inputs[2]);
  const neigh1 = parseInt(inputs[3]);
  const neigh2 = parseInt(inputs[4]);
  const neigh3 = parseInt(inputs[5]);
  const neigh4 = parseInt(inputs[6]);
  const neigh5 = parseInt(inputs[7]);

  game.cells.push(
    new Cell(index, richness, [neigh0, neigh1, neigh2, neigh3, neigh4, neigh5])
  )
}


while (true) {
  game.day = parseInt(readline());
  game.nutrients = parseInt(readline());
  var inputs = readline().split(' ');
  game.mySun = parseInt(inputs[0]);
  game.myScore = parseInt(inputs[1]);
  var inputs = readline().split(' ');
  game.opponentSun = parseInt(inputs[0]);
  game.opponentScore = parseInt(inputs[1]);
  game.opponentIsWaiting = inputs[2] !== '0';
  game.trees = []
  const numberOfTrees = parseInt(readline());
  for (let i = 0; i < numberOfTrees; i++) {
    var inputs = readline().split(' ');
    const cellIndex = parseInt(inputs[0]);
    const size = parseInt(inputs[1]);
    const isMine = inputs[2] !== '0';
    const isDormant = inputs[3] !== '0';
    game.trees.push(
      new Tree(cellIndex, size, isMine, isDormant)
    )
  }
  console.error('mark')
  game.possibleActions = []
  const numberOfPossibleAction = parseInt(readline());
  for (let i = 0; i < numberOfPossibleAction; i++) {
    const possibleAction = readline();
    game.possibleActions.push(Action.parse(possibleAction))
  }

  console.error({possibleActions: game.possibleActions});
  const action = game.getNextAction()
  console.log(action.toString());
}