import GameItem from '../Scene/Main/GameItem/GameItemInterface';

export default interface SavedGame {
  gameItems: GameItem[],
  playerItem: GameItem,
}
