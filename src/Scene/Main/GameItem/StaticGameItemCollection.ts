import GameItem from './GameItemInterface';

export default class StaticGameItemCollection {
  private items: GameItem[];

  constructor(items: GameItem[]) {
    this.items = items;
  }

  public getItems(): GameItem[] {
    return this.items;
  }
}
