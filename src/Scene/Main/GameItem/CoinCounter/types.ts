import RoomName from '../../Map/RoomName';

export type CoinZones = {
  cave: integer,
  pyramid: integer,
  base: integer,
  secret: integer,
  end: integer,
};

export type CoinsTotal = {
  room: string,
  coins: integer,
};

export type CoinCounter = {
  add(roomName: RoomName): void,
  getTotalByLevel(level: string): integer,
  getCurrentByLevel(level: string): integer,
  getRemainingByLevel(level: string): integer,
  getTotal(): integer,
  getCurrent(): integer,
};
