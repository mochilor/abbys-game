import { GameItem, MapEventsGameItemCollection } from './types';

export default function make(items: GameItem[]): MapEventsGameItemCollection {
  function getItems(): GameItem[] {
    return items;
  }

  function getItemByEventName(eventName: string): GameItem[] {
    const foundItems = [];

    items.forEach((item: GameItem) => {
      for (let n = 0; n < item.properties.length; n += 1) {
        if (item.properties[n].name === eventName) {
          foundItems.push(item);
        }
      }
    });

    return foundItems;
  }

  return { getItems, getItemByEventName };
}
