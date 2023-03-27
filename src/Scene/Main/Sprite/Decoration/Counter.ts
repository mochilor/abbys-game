import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';
import * as CoinCounter from '../../GameItem/CoinCounter/CoinCounter';

export default class Counter extends GameObject {
  public static key = 'Counter';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'countersSpriteSheet');

    scene.add.bitmapText(this.x + 11, this.y - 3, 'font', this.getRemainingCoins())
      .setTintFill(0xbdbdbd);

    this.setFrame(this.getFrame());
  }

  private getRemainingCoins(): string {
    const coinCounter = CoinCounter.getInstance();

    const level = this.getLevel();

    return coinCounter.getRemainingByLevel(level).toString();
  }

  private getFrame(): integer {
    const level = this.getLevel();

    switch (level) {
      case 'cave':
        return 0;
      case 'pyramid':
        return 1;
      default:
        return 2;
    }
  }

  private getLevel(): string {
    return this.getProperty('level')?.value as string ?? 'cave';
  }
}
