import RoomName from '../../Map/RoomName';

export type VirtualGameItem = {
  room: string,
  x: integer,
  y: integer,
  key: string,
};

export type VirtualGameItemRepository = {
  add(virtualGameItem: VirtualGameItem): void,
  get(room: RoomName): VirtualGameItem[],
};
