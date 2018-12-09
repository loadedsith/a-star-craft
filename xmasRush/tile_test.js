const Tile = require('./tile.js');
describe('Tile',() => {
  let tile;
  beforeEach(() => {
    tile = new Tile();
  })
  it('should return correct exits', () => {
    let exits = Tile.getExits();
    expect(exits).toEqual({
      'UP': false,
      'RIGHT': false,
      'DOWN': false,
      'LEFT': false,
    });

    exits = Tile.getExits('0000');
    expect(exits).toEqual({
      'UP': false,
      'RIGHT': false,
      'DOWN': false,
      'LEFT': false,
    });

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
      'RIGHT': false,
      'DOWN': true,
      'LEFT': false,
    });


    exits = Tile.getExits('0101');
    expect(exits).toEqual({
      'UP': false,
      'RIGHT': true,
      'DOWN': false,
      'LEFT': true,
    });
  })
})
