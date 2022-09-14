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
}

export interface GameItemLocator {
  getGameItemCollection: () => GameItemCollection,
}
