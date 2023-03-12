import { GameItem, GameItemCollection } from './types';

export default function make(items: GameItem[]): GameItemCollection {
  return {
    getItems(): GameItem[] {
      return items;
    },
    deleteItem(uuid: string): void {
      for (let n = 0; n < items.length; n += 1) {
        if (items[n].uuid === uuid) {
          items.splice(n, 1);
          return;
        }
      }
    },
  };
}
