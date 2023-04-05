import RoomName from '../Map/RoomName';
import {
  GameItem,
  GameItemCollection,
  MapEventsGameItemCollection,
  StaticGameItemCollection,
} from './types';

function makeGameItem(
  id: integer,
  x: integer,
  y: integer,
  className: string,
  rotation: integer | null,
  roomName: RoomName | null,
  properties: [],
): GameItem {
  const offset = 4;

  return {
    uuid: Phaser.Utils.String.UUID(),
    id,
    x: x + offset,
    y: y - offset,
    key: className,
    rotation,
    roomName,
    properties,
  };
}

function makeGameItemCollection(items: GameItem[]): GameItemCollection {
  return {
    getItems(): GameItem[] {
      return items;
    },
    deleteItem(uuid: string): void {
      for (let n = 0; n < items.length; n += 1) {
        if (items[n].uuid === uuid) {
          items.splice(n, 1);
          return;
        }
      }
    },
  };
}
function makeMapEventsGameItemCollection(items: GameItem[]): MapEventsGameItemCollection {
  function getItems(): GameItem[] {
    return items;
  }

  function getItemByEventName(eventName: string): GameItem[] {
    const foundItems = [];

    items.forEach((item: GameItem) => {
      for (let n = 0; n < item.properties.length; n += 1) {
        if (item.properties[n].name === eventName) {
          foundItems.push(item);
        }
      }
    });

    return foundItems;
  }

  return { getItems, getItemByEventName };
}

function makeStaticGameItemCollection(items: GameItem[]): StaticGameItemCollection {
  return {
    getItems(): GameItem[] {
      return items;
    },
  };
}

export {
  makeGameItem,
  makeGameItemCollection,
  makeMapEventsGameItemCollection,
  makeStaticGameItemCollection,
};
