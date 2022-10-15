import RoomName from '../Map/RoomName';
import GameItemCollection from './GameItemCollection';
import GameItem from './GameItemInterface';

export default interface GameItemLocator {
  getGameItemCollection: (room: RoomName) => GameItemCollection;
  getPlayerGameItem: (room?: string) => GameItem;
}
