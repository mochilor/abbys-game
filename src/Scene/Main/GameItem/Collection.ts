import { GameItem, GameItemCollection } from '../Interfaces';

export default class Collection implements GameItemCollection {
  public items: GameItem[];

  constructor(items: GameItem[]) {
    this.items = items;
  }

  public getPlayerPosition(): GameItem {
    return this.getGameItemsByKey('Player')[0];
  }

  public getCoinPositions(): GameItem[] {
    return this.getGameItemsByKey('Coin');
  }

  public getScubaPosition(): GameItem {
    return this.getGameItemsByKey('Scuba')[0];
  }

  public getFinsPosition(): GameItem {
    return this.getGameItemsByKey('Fins')[0];
  }

  public getDoorsPositions(): GameItem[] {
    return this.getGameItemsByKey('Door');
  }

  public getSavesPositions(): GameItem[] {
    return this.getGameItemsByKey('Save');
  }

  private getGameItemsByKey(key: string): GameItem[] {
    const items = [];
    for (let n = 0; n < this.items.length; n += 1) {
      if (this.items[n].key === key) {
        items.push(this.items[n]);
      }
    }

    return items;
  }
}
