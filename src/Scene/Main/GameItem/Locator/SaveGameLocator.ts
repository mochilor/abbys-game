import { loadGame } from '../../../../Service/gameStore';
import GameItemCollection from '../GameItemCollection';
import GameItemLocator from '../GameItemLocatorInterface';

export default class SaveGameLocator implements GameItemLocator {
  public getGameItemCollection(): GameItemCollection {
    const items = loadGame();

    if (items === null) {
      throw new Error('No save file!');
    }

    return items;
  }
}
