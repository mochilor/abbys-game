import {
  GameItemLocator,
  MapGameItemLocator,
  GameItemCollection,
  GameItem,
  StaticGameItemCollection,
  MapEventsGameItemCollection,
} from '../../GameItem/types';
import RoomName from '../../Map/RoomName';

export default function make(
  inMemoryLocator: GameItemLocator,
  saveGameLocator: GameItemLocator,
  mapLocator: GameItemLocator & MapGameItemLocator,
) {
  function getGameItems(roomName: RoomName): GameItemCollection {
    try {
      try {
        return inMemoryLocator.getGameItemCollection(roomName);
      } catch (error) {
        return saveGameLocator.getGameItemCollection(roomName);
      }
    } catch (error) {
      return mapLocator.getGameItemCollection(roomName);
    }
  }

  function getStaticGameItems(roomName: RoomName): StaticGameItemCollection {
    return mapLocator.getStaticGameItemCollection(roomName);
  }

  function getMapEventGameItems(roomName: RoomName): MapEventsGameItemCollection {
    return mapLocator.getMapEventsGameItemCollection(roomName);
  }

  function getPlayerGameItem(): GameItem {
    try {
      try {
        return inMemoryLocator.getPlayerGameItem();
      } catch (error) {
        return saveGameLocator.getPlayerGameItem();
      }
    } catch (error) {
      return mapLocator.getPlayerGameItem();
    }
  }

  return {
    getGameItems,
    getStaticGameItems,
    getMapEventGameItems,
    getPlayerGameItem,
  };
}
