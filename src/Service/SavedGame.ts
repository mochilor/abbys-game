import { GameItem } from '../Scene/Main/GameItem/types';

export default interface SavedGame {
  gameItems: {
    room: {
      x: number,
      y: number,
    },
    items: GameItem[],
  }[],
  playerItem: GameItem,
  room: {
    x: number,
    y: number,
  },
}
