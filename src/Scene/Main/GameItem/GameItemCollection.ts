import GameItem from './GameItemInterface';

export default class GameItemCollection {
  private items: GameItem[];

  constructor(items: GameItem[]) {
    this.items = items;
  }

  public getItems(): GameItem[] {
    return this.items;
  }

  public getPlayerItem(): GameItem | null {
    for (let n = 0; n < this.items.length; n += 1) {
      if (this.items[n].key === 'Player') {
        return this.items[n];
      }
    }

    return null; // Should never happen
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
