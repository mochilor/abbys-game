/**
 * Interface with minimal information needed to instantiate real game objects
 */
export interface GameItem {
  uuid: string,
  id: number,
  x: number,
  y: number,
  key: string,
  properties: {
    name: string,
    value: number | string,
  }[],
}

export interface GameItemCollection {
  items: GameItem[],
  getPlayerPosition: () => GameItem,
  getCoinPositions: () => GameItem[],
  getScubaPosition: () => GameItem,
  getFinsPosition: () => GameItem,
  getDoorsPositions: () => GameItem[],
  getSavesPositions: () => GameItem[],
}

export interface GameItemLocator {
  getGameItemCollection: () => GameItemCollection,
}
