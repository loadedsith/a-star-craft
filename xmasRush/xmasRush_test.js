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

  // it('should a path between 2 items', () => {
  //   let start = {x:0, y:0};
  //   let end = {x:1, y:1};
  //   let path = xmasRush.getPath(start, end);
  //
  //   expect(path.length).toBe(1);
  // });

  it('should get neighbors', () => {
    let maxTileRow = xmasRush.tiles.length - 1;
    let maxTileCol = xmasRush.tiles[0].length - 1;

    let testLocation;

    testLocation = xmasRush.getRelativeLocation('DOWN', {x:0, y:0});
    expect(testLocation).toEqual({x:1, y:0});
    testLocation = xmasRush.getRelativeLocation('DOWN', {x:3, y:0});
    expect(testLocation).toEqual({x:4, y:0});
    testLocation = xmasRush.getRelativeLocation('DOWN', {x:3, y:0});
    expect(testLocation).toEqual({x:4, y:0});

    // test boundries
    testLocation = xmasRush.getRelativeLocation('DOWN', {
      x: maxTileCol,
      y: maxTileRow,
    });
    expect(testLocation).toEqual({});

    testLocation = xmasRush.getRelativeLocation('RIGHT', {
      x: maxTileCol,
      y: maxTileRow,
    });
    expect(testLocation).toEqual({});


    testLocation = xmasRush.getRelativeLocation('UP', {x:0, y:0});
    expect(testLocation).toEqual({});

    testLocation = xmasRush.getRelativeLocation('LEFT', {x:0, y:0});
    expect(testLocation).toEqual({});


  })

  it('should get open neighbors', () => {
    let openNeighbors = xmasRush.getOpenNeighbors(xmasRush.tiles[0][0],
        {
          x: 0,
          y: 0,
        });
    console.log({openNeighbors});
    expect(openNeighbors).toEqual({
      'RIGHT': true,
      'DOWN': true,
    });
    console.log({openNeighbors, tile: xmasRush.tiles[3][3]});
    openNeighbors = xmasRush.getOpenNeighbors(xmasRush.tiles[3][3],
        {
          x: 3,
          y: 3,
        });
    expect(openNeighbors).toEqual({
      'LEFT': true,
      'RIGHT': true,
    });
  });

});
