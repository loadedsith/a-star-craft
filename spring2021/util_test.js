describe('util',() => {
  it('should group actions', () => {
    const {groupActions} = require('./util.js');
    const grouped = groupActions([{type: 'one'}, {type: 'two'}, {type: 'two'}]);
    expect(grouped['one'].length).toBe(1);
    expect(grouped['two'].length).toBe(2);
  });
  
  it('should find cells', () => {
    const {getCellByIndex} = require('./util.js');
    const cell = getCellByIndex('1', [{index: '1'}, {index: '2'}]);
    expect(cell.index).toBe('1') 
  })  
})
