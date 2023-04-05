import {
  playerItemClass,
  dynamicItemClasses,
  staticItemClasses,
  mapEventItemClasses,
} from '../../Sprite/Factory';
import RoomName from '../../Map/RoomName';
import {
  GameItem,
  GameItemCollection,
  GameItemLocator,
  MapEventsGameItemCollection,
  MapGameItemLocator,
  StaticGameItemCollection,
} from '../types';
import {
  makeGameItem,
  makeGameItemCollection,
  makeMapEventsGameItemCollection,
  makeStaticGameItemCollection,
} from '../Factory';
import makeVirtualGameItemRepository from '../Virtual/VirtualGameItemRepository';
import { VirtualGameItem } from '../Virtual/types';

export default function make(map: Phaser.Tilemaps.Tilemap): GameItemLocator & MapGameItemLocator {
  const virtualGameItemRepository = makeVirtualGameItemRepository();

  function getItemId(className: string, itemClasses: object): integer {
    const keys = Object.keys(itemClasses);
    for (let n = 0; n < keys.length; n += 1) {
      const itemClass = itemClasses[keys[n]];
      if (itemClass.key === className) {
        return parseInt(keys[n], 10);
      }
    }

    return 0;
  }

  function makeGameItems(className: string, itemClasses: object, roomName?: RoomName): GameItem[] {
    const itemId = getItemId(className, itemClasses);
    const data = map.getObjectLayer('objects').objects;
    const result = [];
    const { firstgid } = map.getTileset('objects');

    data.forEach((mapItem: Phaser.Types.Tilemaps.TiledObject) => {
      if (itemId === mapItem.gid - firstgid + 1) {
        const item = makeGameItem(
          itemId,
          mapItem.x,
          mapItem.y,
          className,
          mapItem.rotation,
          roomName,
          mapItem.properties ?? [],
        );

        result.push(item);
      }
    });

    return result;
  }

  function getGameItems(itemClasses: object, roomName: RoomName): GameItem[] {
    let items = [];
    const keys = Object.keys(itemClasses);
    for (let n = 0; n < keys.length; n += 1) {
      const itemClass = itemClasses[keys[n]];
      items = items.concat(makeGameItems(itemClass.key, itemClasses, roomName));
    }

    return items;
  }

  function getGameItemCollection(room: RoomName): GameItemCollection {
    const items = getGameItems(dynamicItemClasses, room);
    return makeGameItemCollection(items);
  }

  function getStaticGameItemCollection(room: RoomName): StaticGameItemCollection {
    const items = getGameItems(staticItemClasses, room);

    const virtualItems = virtualGameItemRepository.get(room);

    const additionalItems = [];

    virtualItems.forEach((virtualItem: VirtualGameItem) => {
      const itemId = getItemId(virtualItem.key, staticItemClasses);

      const item = makeGameItem(
        itemId,
        virtualItem.x,
        virtualItem.y,
        virtualItem.key,
        null,
        room,
        [],
      );
      additionalItems.push(item);
    });

    return makeStaticGameItemCollection([...items, ...additionalItems]);
  }

  function getMapEventsGameItemCollection(room: RoomName): MapEventsGameItemCollection {
    const items = getGameItems(mapEventItemClasses, room);
    return makeMapEventsGameItemCollection(items);
  }

  function getPlayerGameItem(): GameItem {
    const playerItemArray = makeGameItems('Player', playerItemClass, null);

    if (playerItemArray.length === 0) {
      throw new Error('No player in this map');
    }

    return playerItemArray[0];
  }

  return {
    getGameItemCollection,
    getStaticGameItemCollection,
    getMapEventsGameItemCollection,
    getPlayerGameItem,
  };
}
