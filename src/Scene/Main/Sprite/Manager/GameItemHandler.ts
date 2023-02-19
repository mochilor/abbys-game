import GameItemCollection from '../../GameItem/GameItemCollection';
import GameItem from '../../GameItem/GameItemInterface';
import GameItemLocator from '../../GameItem/GameItemLocatorInterface';
import MapEventsGameItemCollection from '../../GameItem/MapEventsGameItemCollection';
import MapGameItemLocator from '../../GameItem/MapGameItemLocatorInterface';
import StaticGameItemCollection from '../../GameItem/StaticGameItemCollection';
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
