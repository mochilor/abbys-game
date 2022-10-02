import GameItemCollection from '../Scene/Main/GameItem/GameItemCollection';
import GameItem from '../Scene/Main/GameItem/GameItemInterface';
import RoomName from '../Scene/Main/Map/RoomName';
import SavedGame from './SavedGame';

const fileName = 'cavegame.savefile';

function saveGame(
  gameItemCollection: GameItemCollection,
  playerItem: GameItem,
  roomName: RoomName,
) {
  const savedGame: SavedGame = {
    gameItems: gameItemCollection.getItems(),
    playerItem,
    room: {
      x: roomName.getX(),
      y: roomName.getY(),
    },
  };

  localStorage.setItem(fileName, JSON.stringify(savedGame));
}

function loadGame(): SavedGame | null {
  const saveFile = localStorage.getItem(fileName);

  if (saveFile === null) {
    return null;
  }

  const parsedSaveFile = JSON.parse(saveFile);

  return parsedSaveFile;
}

export {
  saveGame,
  loadGame,
};
