import RoomName from '../Map/RoomName';

/**
 * Interface with minimal information needed to instantiate real game objects
 */
export type GameItem = {
  uuid: string,
  id: number,
  x: number,
  y: number,
  key: string,
  rotation: number,
  roomName: RoomName,
  properties: {
    name: string,
    value: number | string | object | []
  }[],
  otherProperties?: {
    velocityY: number,
  }
};

export type GameItemCollection = {
  getItems(): GameItem[],
  deleteItem(uuid: string): void,
};

export type StaticGameItemCollection = {
  getItems(): GameItem[],
};

export type MapEventsGameItemCollection = {
  getItems(): GameItem[],
  getItemByEventName(eventName: string): GameItem[],
};

export type GameItemLocator = {
  getGameItemCollection: (room: RoomName) => GameItemCollection;
  getPlayerGameItem: (room?: string) => GameItem;
};

export type MapGameItemLocator = {
  getStaticGameItemCollection: (room: RoomName) => StaticGameItemCollection;
  getMapEventsGameItemCollection(room: RoomName): MapEventsGameItemCollection;
};
