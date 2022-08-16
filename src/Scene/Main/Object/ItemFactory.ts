import Door from './Door';
import { GameItem } from '../Interfaces';
import Coin from './Coin';
import Scuba from './Scuba';
import Fins from './Fins';

export default class ItemFactory {
  private itemClasses = {
    1: Coin,
    3: Door,
    4: Scuba,
    5: Fins,
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
