import Door from './Door';
import { GameItem } from '../Interfaces';
import Coin from './Coin';

export default class ItemFactory {
  private itemClasses = {
    1: Coin,
    3: Door,
  };

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public make(gameItem: GameItem): Phaser.GameObjects.Sprite {
    const ItemClass = this.itemClasses[gameItem.id];

    const offset = 4;

    return new ItemClass(
      this.scene,
      gameItem.x + offset,
      gameItem.y - offset,
      ...gameItem.properties,
    );
  }
}
