import GameItem from './GameItemInterface';

export default class MapEventsGameItemCollection {
  private items: GameItem[];

  constructor(items: GameItem[]) {
    this.items = items;
  }

  public getItems(): GameItem[] {
    return this.items;
  }

  public getItemByEventName(eventName: string): GameItem[] {
    const items = [];

    this.items.forEach((item: GameItem) => {
      for (let n = 0; n < item.properties.length; n += 1) {
        if (item.properties[n].name === eventName) {
          items.push(item);
        }
      }
    });

    return items;
  }
}
