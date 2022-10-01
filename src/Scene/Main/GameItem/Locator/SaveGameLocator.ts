import { loadGame } from '../../../../Service/gameStore';
import GameItemCollection from '../GameItemCollection';
import GameItem from '../GameItemInterface';
import GameItemLocator from '../GameItemLocatorInterface';

export default class SaveGameLocator implements GameItemLocator {
  public getGameItemCollection(room: string): GameItemCollection {
    const saveData = loadGame(room);

    if (saveData === null) {
      throw new Error('No save file!');
    }

    return new GameItemCollection(saveData.gameItems);
  }

  public getPlayerGameItem(room: string): GameItem {
    const saveData = loadGame(room);

    if (saveData === null) {
      throw new Error('No save file!');
    }

    return saveData.playerItem;
  }
}
