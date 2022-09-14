import GameItemCollection from './GameItemCollection';

export default interface GameItemLocator {
  getGameItemCollection: () => GameItemCollection,
}
