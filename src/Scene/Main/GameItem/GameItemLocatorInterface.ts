import GameItemCollection from './GameItemCollection';
import GameItem from './GameItemInterface';

export default interface GameItemLocator {
  getGameItemCollection: (room?: string) => GameItemCollection;
  getPlayerGameItem: (room?: string) => GameItem;
}
