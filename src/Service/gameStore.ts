import GameItemCollection from '../Scene/Main/GameItem/GameItemCollection';
import GameItem from '../Scene/Main/GameItem/GameItemInterface';
import RoomName from '../Scene/Main/Map/RoomName';
import SavedGame from './SavedGame';

const fileName = 'cavegame.savefile';

function loadGame(): SavedGame | null {
  const saveFile = localStorage.getItem(fileName);

  if (saveFile === null) {
    return null;
  }

  const parsedSaveFile = JSON.parse(saveFile);

  return parsedSaveFile;
}

function saveGame(
  gameItemCollection: GameItemCollection,
  playerItem: GameItem,
  roomName: RoomName,
  sceneRegistry: Phaser.Data.DataManager,
) {
  const dataToSave = {
    gameItems: [{
      room: {
        x: roomName.getX(),
        y: roomName.getY(),
      },
      items: gameItemCollection.getItems(),
    }],
    playerItem,
    room: {
      x: roomName.getX(),
      y: roomName.getY(),
    },
  };

  const savedGame: SavedGame = loadGame();

  if (savedGame) {
    for (let n = 0; n < savedGame.gameItems.length; n += 1) {
      if (!roomName.isSame(savedGame.gameItems[n].room)) {
        dataToSave.gameItems.push(savedGame.gameItems[n]);
      }
    }
  }

  // Update each room with the last data in memory before saving:
  for (let n = 0; n < dataToSave.gameItems.length; n += 1) {
    if (!roomName.isSame(dataToSave.gameItems[n].room)) {
      const room = new RoomName(dataToSave.gameItems[n].room.x, dataToSave.gameItems[n].room.y);
      const inMemoryGameItems: GameItem[] = sceneRegistry.get(room.getName());
      if (inMemoryGameItems != null) {
        dataToSave.gameItems[n].items = inMemoryGameItems;
      }
    }
  }

  localStorage.setItem(fileName, JSON.stringify(dataToSave));
}

export {
  saveGame,
  loadGame,
};
