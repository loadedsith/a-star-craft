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
    this.harvestIteraton = 0
  }
  
  getNextAction() {
    let firstComplete = this.possibleActions.find((a) => {
      return a.type == COMPLETE;
    });
    
    let firstSeed = this.possibleActions.find((a) => {
      return a.type == SEED;
    });
    
    console.error({trees: this.trees})
    if (this.opponentIsWaiting) return this.possibleActions[0]
    let seedCount = this.trees.reduce((acc, next) => {
      if (next.size == 0 && next.isMine) {
        acc++;
      };
      return acc
    }, 0);
    
    let fullGrownCount = this.trees.reduce((acc, next) => {
      if (next.size == 3 && next.isMine) {
        acc++;
      };
      return acc
    }, 0);
    
    let firstGrow = this.possibleActions.find((a) => {
      return a.type == GROW;
    });

    if (this.day > 15 && firstComplete && fullGrownCount > 1) {
      this.harvestIteraton = 1;
      return firstComplete;
    }

    if (this.day < 18 && firstSeed && seedCount < 1) {
      return firstSeed;
    }    
    
    if (firstGrow) {
      return firstGrow;
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
  console.error(`inputs[2]: ${inputs[2]}`)
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
  console.error({game})
  game.possibleActions = []
  const numberOfPossibleAction = parseInt(readline());
  for (let i = 0; i < numberOfPossibleAction; i++) {
    const possibleAction = readline();
    game.possibleActions.push(Action.parse(possibleAction))
  }

  const action = game.getNextAction()
  console.log(action.toString());
}