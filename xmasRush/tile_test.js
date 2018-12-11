const Tile = require('./tile.js');
describe('Tile',() => {
  let tile;
  beforeEach(() => {
    tile = new Tile();
  })
  it('should return correct exits', () => {
    let exits = Tile.getExits();
    expect(exits).toEqual({});

    exits = Tile.getExits('0000');
    expect(exits).toEqual({});

    exits = Tile.getExits('1111');
    expect(exits).toEqual({
      'UP': true,
      'RIGHT': true,
      'DOWN': true,
      'LEFT': true,
    });


    exits = Tile.getExits('1010');
    expect(exits).toEqual({
      'UP': true,
      'DOWN': true,
    });


    exits = Tile.getExits('0101');
    expect(exits).toEqual({
      'RIGHT': true,
      'LEFT': true,
    });
  })
})
