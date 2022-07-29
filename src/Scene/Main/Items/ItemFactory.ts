import { GameItem } from '../Interfaces';
import Coin from './Coin';

export default class ItemFactory {
  private itemClasses = {
    1: Coin,
  };

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public make(gameItem: GameItem): Phaser.GameObjects.Sprite {
    const ItemClass = this.itemClasses[gameItem.id];

    return new ItemClass(this.scene, gameItem.x, gameItem.y);
  }
}
