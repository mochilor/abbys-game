import GameItemCollection from '../Scene/Main/GameItem/GameItemCollection';
import GameItem from '../Scene/Main/GameItem/GameItemInterface';
import SavedGame from './SavedGame';

function getFileName(roomNumber: string): string {
  return `cavegame.saveFile.${roomNumber}`;
}

function saveGame(
  gameItemCollection: GameItemCollection,
  playerItem: GameItem,
  roomNumber: string,
) {
  const savedGame: SavedGame = {
    gameItems: gameItemCollection.getItems(),
    playerItem,
  };

  localStorage.setItem(getFileName(roomNumber), JSON.stringify(savedGame));
}

function loadGame(roomNumber: string): SavedGame | null {
  const saveFile = localStorage.getItem(getFileName(roomNumber));

  if (saveFile === null) {
    return null;
  }

  const parsedSaveFile = JSON.parse(saveFile);

  return parsedSaveFile;
}

// function savedGameExists(): boolean {
//   return localStorage.getItem(fileName) !== null;
// }

// function removeGame(): void {
//   localStorage.removeItem(fileName);
// }

export {
  saveGame,
  loadGame,
};
