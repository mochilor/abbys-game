import { loadGame } from '../../../../Service/gameStore';
import RoomName from '../../Map/RoomName';
import GameItemCollection from '../GameItemCollection';
import GameItem from '../GameItemInterface';
import GameItemLocator from '../GameItemLocatorInterface';

export default class SaveGameLocator implements GameItemLocator {
  public getGameItemCollection(roomName: RoomName): GameItemCollection {
    const saveData = loadGame();

    if (saveData === null) {
      throw new Error('No save file!');
    }

    const savedRoomName = new RoomName(saveData.room.x, saveData.room.y);
    if (!roomName.equals(savedRoomName)) {
      throw new Error('Not current room!');
    }

    return new GameItemCollection(saveData.gameItems);
  }

  public getPlayerGameItem(): GameItem {
    const saveData = loadGame();

    if (saveData === null) {
      throw new Error('No save file!');
    }

    return saveData.playerItem;
  }
}
