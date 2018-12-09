const Player = require('./player.js');

/** Challenge class. */
class XmasRush {
  constructor(readline_, printErr_) {
    let lines;

    Object.assign(this, {
      items: [],
      players: [],
      quests: [],
      readline: readline_,
      printErr: printErr_,
      tiles: [[]],
      turnType: null,
    });
  }

  readTurn() {
    Object.assign(this, {
      items: [],
      players: [],
      quests: [],
      tiles: [[]],
      turnType: null,
    });

    this.turnType = parseInt(this.readline());
    for (let i = 0; i < 7; i++) {
      const inputs = this.readline().split(' ');
      this.tiles[i] = [];
      for (let j = 0; j < 7; j++) {
        this.tiles[i].push(inputs[j]);
      }
    }

    for (let i = 0; i < 2; i++) {
      const inputs = this.readline().split(' ');
      this.players[i] = new Player({
        // The total number of quests for a player (hidden and revealed).
        numPlayerCards: parseInt(inputs[0]),
        playerTile: inputs[3],
        playerX: parseInt(inputs[1]),
        playerY: parseInt(inputs[2]),
      });
    }

    const numItems = parseInt(this.readline());
    for (let i = 0; i < numItems; i++) {
      const inputs = this.readline().split(' ');
      this.items.push({
        itemName: inputs[0],
        itemPlayerId: parseInt(inputs[3]),
        itemX: parseInt(inputs[1]),
        itemY: parseInt(inputs[2]),
      });
    }

    // The total number of revealed quests for both players.
    const numQuests = parseInt(this.readline());
    for (let i = 0; i < numQuests; i++) {
      var inputs = this.readline().split(' ');
      this.quests.push({
        questItemName: inputs[0],
        questPlayerId: parseInt(inputs[1]),
      });
    }
  }

  getPlayerQuests(playerIndex) {
    return this.quests.filter((quest) => playerIndex === quest.questPlayerId);
  }

  getPlayerItems(playerIndex) {
    return this.items.filter((item) => playerIndex === item.itemPlayerId);
  }
}

module.exports = XmasRush;
