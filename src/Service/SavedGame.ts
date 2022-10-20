import GameItem from '../Scene/Main/GameItem/GameItemInterface';

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
