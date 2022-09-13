import { GameItemCollection } from './Interfaces';

const fileName = 'saveFile';

export default class GameStore {
  public static saveGame(gameItemCollection: GameItemCollection) {
    localStorage.setItem(fileName, JSON.stringify(gameItemCollection));
  }

  public static loadGame(): GameItemCollection {
    const saveFile = localStorage.getItem(fileName);

    const parsedSaveFile = JSON.parse(saveFile);

    return parsedSaveFile.gameItemCollection;
  }

  public static storedGameExists(): boolean {
    return localStorage.getItem(fileName) !== null;
  }

  public static removeGame(): void {
    localStorage.removeItem(fileName);
  }
}
