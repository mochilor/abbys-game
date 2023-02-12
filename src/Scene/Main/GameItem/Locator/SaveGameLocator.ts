import { loadGame } from '../../../../Service/gameStore';
import RoomName from '../../Map/RoomName';
import GameItemCollection from '../GameItemCollection';
import GameItem from '../GameItemInterface';
import GameItemLocator from '../GameItemLocatorInterface';
import { getDebugRoomName } from '../../Debug/debug';

export default function make(sceneRegistry: Phaser.Data.DataManager): GameItemLocator {
  function getGameItemCollection(roomName: RoomName): GameItemCollection {
    const savedGame = loadGame();

    if (savedGame === null) {
      throw new Error('No save file!');
    }

    if (!roomName.isSame(savedGame.room)) {
      throw new Error('Not current room!');
    }

    savedGame.gameItems.forEach((gameItemData) => {
      const savedRoom = new RoomName(gameItemData.room.x, gameItemData.room.y);
      sceneRegistry.set(savedRoom.getName(), gameItemData.items);
    });

    for (let n = 0; n < savedGame.gameItems.length; n += 1) {
      if (roomName.isSame(savedGame.gameItems[n].room)) {
        for (let nn = 0; nn < savedGame.gameItems[n].items.length; nn += 1) {
          // set a real RoomName, not an object that fulfills RoomName class attributes (to improve)
          savedGame.gameItems[n].items[nn].roomName = roomName;
        }

        return new GameItemCollection(savedGame.gameItems[n].items);
      }
    }

    throw new Error('Wrong save file!');
  }

  function getPlayerGameItem(): GameItem {
    if (getDebugRoomName()) {
      throw new Error('Force debug player position!');
    }

    const saveData = loadGame();

    if (saveData === null) {
      throw new Error('No save file!');
    }

    return saveData.playerItem;
  }

  return { getGameItemCollection, getPlayerGameItem };
}
