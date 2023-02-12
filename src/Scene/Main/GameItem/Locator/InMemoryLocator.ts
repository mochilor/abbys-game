import RoomName from '../../Map/RoomName';
import GameItemCollection from '../GameItemCollection';
import GameItem from '../GameItemInterface';
import GameItemLocator from '../GameItemLocatorInterface';

type DataManager = {
  get(name: string): any,
};

export default function make(registry: DataManager): GameItemLocator {
  function getGameItemCollection(room: RoomName): GameItemCollection {
    const storedData: GameItem[] = registry.get(room.getName());

    if (storedData == null) {
      throw new Error('No data in memory');
    }

    for (let n = 0; n < storedData.length; n += 1) {
      // set a real RoomName, not an object that fulfills RoomName class attributes (to improve)
      storedData[n].roomName = room;
    }

    return new GameItemCollection(storedData);
  }

  function getPlayerGameItem(): GameItem {
    const storedData: any = registry.get('player');

    if (storedData == null) {
      throw new Error('No data in memory');
    }

    const playerItem: GameItem = storedData;

    return playerItem;
  }

  return { getGameItemCollection, getPlayerGameItem };
}
