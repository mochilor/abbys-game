import { GameItem, StaticGameItemCollection } from './types';

export default function make(items: GameItem[]): StaticGameItemCollection {
  return {
    getItems(): GameItem[] {
      return items;
    },
  };
}
