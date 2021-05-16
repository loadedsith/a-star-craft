const {groupActions, getFirstComplete, getFirstSeed, types, getCellByIndex} = require('./util.js');
const {WAIT, SEED, GROW, COMPLETE} = types;

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

if (typeof readline === 'undefined') {
  readline = debugReadline_;
}
//readline = debugReadline_;

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
    let firstComplete = getFirstComplete(this.possibleActions);
    
    let firstSeed = getFirstSeed(this.possibleActions);
    
    let firstGrow = this.possibleActions.find((a) => {
      return a.type == GROW;
    });

    const groupedActions = groupActions(this.possibleActions);
    
    let bestSeedAction = (groupedActions[SEED] || []).reduce((acc, next) => {
      const cell = getCellByIndex(next.targetCellIdx, this.cells);
      const accCell = getCellByIndex(acc.targetCellIdx, this.cells);
      
      if (cell.richness > accCell.richness) {
        acc = next;
      }
      
      return acc;
      
    }, firstSeed);
    console.error({growActions: groupedActions[GROW]})
    let bestGrowAction = (groupedActions[GROW] || []).reduce((acc, next) => {
      const cell = getCellByIndex(next.targetCellIdx, this.cells);
      const accCell = getCellByIndex(acc.targetCellIdx, this.cells);
      
      if (cell.richness > accCell.richness) {
        acc = next;
      }
      
      return acc;
      
    }, firstGrow);

    console.error({trees: this.trees})
   
    if (this.opponentIsWaiting) return this.possibleActions[0];
    
    let seedCount = this.trees.reduce((acc, next) => {
      if (next.size == 0 && next.isMine) {
        acc++;
      };
      return acc
    }, 0);
    console.error({seedCount})
    
    let fullGrownCount = this.trees.reduce((acc, next) => {
      if (next.size == 3 && next.isMine) {
        acc++;
      };
      return acc
    }, 0);

    if (this.day > 10 && firstComplete && fullGrownCount > 1) {
      this.harvestIteraton = 1;
      return firstComplete;
    }

    if (this.day < 18 && firstSeed && seedCount < 1) {
      return bestSeedAction || firstSeed;
    }    
    
    if (bestGrowAction) {
      return bestGrowAction;
    }
    return this.possibleActions[0]
    //return this.possibleActions[this.possibleActions.length-1]
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
  //console.error({game})
  game.possibleActions = []
  const numberOfPossibleAction = parseInt(readline());
  for (let i = 0; i < numberOfPossibleAction; i++) {
    const possibleAction = readline();
    game.possibleActions.push(Action.parse(possibleAction))
  }

  const action = game.getNextAction()
  console.log(action.toString());
}