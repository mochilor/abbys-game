import GameItem from './GameItemInterface';

export default class GameItemCollection {
  private items: GameItem[];

  constructor(items: GameItem[]) {
    this.items = items;
  }

  public getItems(): GameItem[] {
    return this.items;
  }

  public deleteItem(uuid: string): void {
    for (let n = 0; n < this.items.length; n += 1) {
      if (this.items[n].uuid === uuid) {
        this.items.splice(n, 1);
        return;
      }
    }
  }
}
