import GameItemCollection from '../GameItemCollection';
import GameItem from '../GameItemInterface';
import GameItemLocator from '../GameItemLocatorInterface';

export default class InMemoryGameLocator implements GameItemLocator {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public getGameItemCollection(room: string): GameItemCollection {
    const storedData: any = this.scene.registry.get(room);

    if (storedData == null) {
      throw new Error('No data in memory');
    }

    return new GameItemCollection(storedData);
  }

  public getPlayerGameItem(): GameItem {
    const storedData: any = this.scene.registry.get('player');

    if (storedData == null) {
      throw new Error('No data in memory');
    }

    const playerItem: GameItem = storedData;

    return playerItem;
  }
}
