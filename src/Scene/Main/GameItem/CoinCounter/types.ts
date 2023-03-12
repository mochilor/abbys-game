import RoomName from '../../Map/RoomName';

export type CoinZones = {
  cave: integer,
  pyramid: integer,
  base: integer,
};

export type CoinsTotal = {
  room: string,
  coins: integer,
};

export type CoinCounter = {
  caveTotalCoins(): integer,
  pyramidTotalCoins(): integer,
  baseTotalCoins(): integer,
  caveCurrentCoins(): integer,
  pyramidCurrentCoins(): integer,
  baseCurrentCoins(): integer,
  add(roomName: RoomName): void,
};
