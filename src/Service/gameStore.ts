import GameItemCollection from '../Scene/Main/GameItem/GameItemCollection';

const fileName = 'cavegame.saveFile';

function saveGame(gameItemCollection: GameItemCollection) {
  localStorage.setItem(fileName, JSON.stringify(gameItemCollection.getItems()));
}

function loadGame(): GameItemCollection | null {
  const saveFile = localStorage.getItem(fileName);

  if (saveFile === null) {
    return null;
  }

  const parsedSaveFile = JSON.parse(saveFile);

  return new GameItemCollection(parsedSaveFile);
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
