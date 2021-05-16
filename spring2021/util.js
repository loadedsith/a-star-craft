const types = {
  WAIT: 'WAIT',
  SEED: 'SEED',
  GROW: 'GROW',
  COMPLETE: 'COMPLETE',
};

const {WAIT, SEED, GROW, COMPLETE} = types;

module.exports = {
  types,
  
  getCellByIndex: function(cellIdx, cells) {
    return cells.find((cell) => {
      if (cell.index == cellIdx) {
        return cell;
      }
    })
  },
  
  getFirstComplete: function(actions) {
    return actions.find((a) => {
      return a.type == COMPLETE;
    });
  },
  
  getFirstSeed: function(actions) {
    return actions.find((a) => {
      return a.type == SEED;
    });
  },

  isValidAction: function(proposed, actions) {
    actions.find((a) => {
      return (a.type == proposed.type) &&
        (a.targetCellIdx == proposed.targetCellIdx) &&
        (a.sourceCellIdx == proposed.sourceCellIdx);
    });
  },

  groupActions: function(actions) {
    return actions.reduce((acc, next) => {
      if (!acc[next.type]) {
        acc[next.type] = [];
      }
      acc[next.type].push(next);
      return acc;
    }, {});
  },
}