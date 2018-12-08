const XmasRush = require('./xmasRush.js');
console.log({XmasRush});
describe('Xmas Rush', () => {
  let xmasRush;
  beforeEach(() => {
    xmasRush = new XmasRush(() => {

    });
  })
  it('not have readline', () => {
    expect(typeof xmasRush.readline).toBe('function');
  })
})
