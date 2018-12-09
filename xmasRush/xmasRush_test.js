const XmasRush = require('./xmasRush.js');
const lines = require('./lines.js');

describe('Xmas Rush, level one, basics', () => {
  let xmasRush;

  beforeEach(() => {
    let lines_ = lines.slice(0);
    xmasRush = new XmasRush(() => {
      return lines_.shift();
    }, console.log);
    xmasRush.readTurn();
  });

  it('not have readline', () => {
    expect(typeof xmasRush.readline).toEqual('function');
  });

  it('players count to be 2', () => {
    expect(xmasRush.players.length).toEqual(2);
  });

  it('items count to be 2', () => {
    expect(xmasRush.items.length).toEqual(2);
  });

  it('quest count to be 2', () => {
    expect(xmasRush.quests.length).toEqual(2);
  });

  it('tiles should be a 2d array', () => {
    expect(xmasRush.tiles.length).toEqual(7);
    xmasRush.tiles.forEach((tileRow) => {
      expect(tileRow.length).toEqual(7);
      tileRow.forEach((tile) => {
        expect(tile.length).toEqual(4);
      });
    });
  });

  it('should get the right quests for each player', () => {
    xmasRush.players.forEach((player, index) => {
      let goals = xmasRush.getPlayerQuests(index);
      expect(goals.length).toEqual(1);
      expect(goals[0]).toEqual({
        questItemName: 'ARROW',
        questPlayerId: index,
      });
    });
  });

  it('should get the right items for each player', () => {
    xmasRush.players.forEach((player, index) => {
      let items = xmasRush.getPlayerItems(index);
      expect(items.length).toEqual(1);
      expect(items[0].itemPlayerId).toEqual(index);
    });
  });

});
