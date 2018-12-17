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
        expect(tile.tile.length).toEqual(4);
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
      expect(items[0].playerId).toEqual(index);
    });
  });

  it('should a path between 0,0 and 1,1 ', () => {
    let path = xmasRush.getPath({x: 0, y: 0}, {x: 1, y: 1});
    console.log(JSON.stringify(path));
    expect(path).toEqual([
      {
        "index":1,
        "matchCount":0,
        "x":0,
        "y":0,
      }, {
        "index":2,
        "matchCount":0,
        "x":1,
        "y":0,
      }, {
        "index":3,
        "matchCount":0,
        "x":1,
        "y":1,
        "goalFound":1,
      }]);

    path = xmasRush.getPath({x: 0, y: 0}, {x: 3, y: 4});
    expect(path).toEqual([
      { index: 1, matchCount: 0, x: 0, y: 0 },
      { index: 2, matchCount: 0, x: 1, y: 0 },
      { index: 3, matchCount: 0, x: 1, y: 1 },
      { index: 4, matchCount: 0, x: 2, y: 1 },
      { index: 5, matchCount: 0, x: 2, y: 2 },
      { index: 6, matchCount: 0, x: 3, y: 2 },
      { index: 7, matchCount: 0, x: 3, y: 3 },
      { index: 8, matchCount: 0, x: 3, y: 4, goalFound: 1 },
    ]);

    path = xmasRush.getPath({x: 3, y: 0}, {x: 3, y: 4});
    expect(path).toEqual([
      { index: 1, matchCount: 0, x: 3, y: 0 },
      { index: 2, matchCount: 0, x: 2, y: 0 },
      { index: 3, matchCount: 0, x: 2, y: 1 },
      { index: 4, matchCount: 0, x: 2, y: 2 },
      { index: 5, matchCount: 0, x: 3, y: 2 },
      { index: 6, matchCount: 0, x: 3, y: 3 },
      { index: 7, matchCount: 0, x: 3, y: 4, goalFound: 1 }
    ]);

    path = xmasRush.getPath({x: 5, y: 1}, {x: 3, y: 4});
    expect(path).toEqual(null);

    path = xmasRush.getPath({x: 0, y: 5}, {x: 3, y: 4});
    expect(path).toEqual(null);

    path = xmasRush.getPath({x: 6, y: 6}, {x: 3, y: 4});
    expect(path).toEqual([
      { index: 1, matchCount: 0, x: 6, y: 6 },
      { index: 2, matchCount: 0, x: 5, y: 6 },
      { index: 3, matchCount: 0, x: 5, y: 5 },
      { index: 4, matchCount: 0, x: 4, y: 5 },
      { index: 5, matchCount: 0, x: 4, y: 4 },
      { index: 6, matchCount: 0, x: 3, y: 4, goalFound: 1 },
    ]);
  });

  it('should get neighbors', () => {
    let maxTileRow = xmasRush.tiles.length - 1;
    let maxTileCol = xmasRush.tiles[0].length - 1;

    let testLocation;

    testLocation = xmasRush.getRelativeLocation('DOWN', {
      x: 0,
      y: 0});
    expect(testLocation).toEqual({
      x: 1,
      y: 0});
    testLocation = xmasRush.getRelativeLocation('DOWN', {
      x: 3,
      y: 0});
    expect(testLocation).toEqual({
      x: 4,
      y: 0});
    testLocation = xmasRush.getRelativeLocation('DOWN', {
      x: 3,
      y: 0});
    expect(testLocation).toEqual({
      x: 4,
      y: 0});

    // test boundries
    testLocation = xmasRush.getRelativeLocation('DOWN', {
      x: maxTileCol,
      y: maxTileRow,
    });
    expect(testLocation).toEqual(false);

    testLocation = xmasRush.getRelativeLocation('RIGHT', {
      x: maxTileCol,
      y: maxTileRow,
    });
    expect(testLocation).toEqual(false);


    testLocation = xmasRush.getRelativeLocation('UP', {
      x: 0,
      y: 0
    });
    expect(testLocation).toEqual(false);

    testLocation = xmasRush.getRelativeLocation('LEFT', {
      x: 0,
      y: 0
    });
    expect(testLocation).toEqual(false);
  });

  it('should get open neighbors', () => {
    let openNeighbors = xmasRush.getOpenExits(xmasRush.tiles[0][0], {
      x: 0,
      y: 0,
    });
    expect(openNeighbors).toEqual({
      'RIGHT': true,
      'DOWN': true,
    });
    openNeighbors = xmasRush.getOpenExits(xmasRush.tiles[3][3], {
      x: 3,
      y: 3,
    });
    expect(openNeighbors).toEqual({
      'LEFT': true,
      'RIGHT': true,
    });
    openNeighbors = xmasRush.getOpenExits(xmasRush.tiles[6][6], {
      x: 6,
      y: 6,
    });
    expect(openNeighbors).toEqual({
      'UP': true,
      'LEFT': true,
    });
  });
});
