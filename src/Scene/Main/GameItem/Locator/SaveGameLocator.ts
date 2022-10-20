import { loadGame } from '../../../../Service/gameStore';
import RoomName from '../../Map/RoomName';
import GameItemCollection from '../GameItemCollection';
import GameItem from '../GameItemInterface';
import GameItemLocator from '../GameItemLocatorInterface';

export default class SaveGameLocator implements GameItemLocator {
  private sceneRegistry: Phaser.Data.DataManager;

  constructor(sceneRegistry: Phaser.Data.DataManager) {
    this.sceneRegistry = sceneRegistry;
  }

  public getGameItemCollection(roomName: RoomName): GameItemCollection {
    const savedGame = loadGame();

    if (savedGame === null) {
      throw new Error('No save file!');
    }

    if (!roomName.isSame(savedGame.room)) {
      throw new Error('Not current room!');
    }

    savedGame.gameItems.forEach((gameItemData) => {
      const savedRoom = new RoomName(gameItemData.room.x, gameItemData.room.y);
      this.sceneRegistry.set(savedRoom.getName(), gameItemData.items);
    });

    for (let n = 0; n < savedGame.gameItems.length; n += 1) {
      if (roomName.isSame(savedGame.gameItems[n].room)) {
        return new GameItemCollection(savedGame.gameItems[n].items);
      }
    }

    throw new Error('Wrong save file!');
  }

  public getPlayerGameItem(): GameItem {
    const saveData = loadGame();

    if (saveData === null) {
      throw new Error('No save file!');
    }

    return saveData.playerItem;
  }
}
