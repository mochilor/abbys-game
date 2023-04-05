import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';
import * as CoinCounter from '../../GameItem/CoinCounter/CoinCounter';
import * as EventDispatcher from '../../../../Service/EventDispatcher';

export default class Counter extends GameObject {
  public static key = 'Counter';

  private isGlowing: boolean = false;

  private startAt: integer = null;

  private isComplete: boolean = false;

  private eventEmitted: boolean = false;

  private initialized: boolean = false;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'countersSpriteSheet');
  }

  private init(): void {
    this.isComplete = this.getRemainingCoins() === 0;

    // shadow
    this.scene.add.bitmapText(this.x + 11, this.y - 2, 'font', this.getRemainingCoins().toString())
      .setTintFill(0x717171);

    // text
    this.scene.add.bitmapText(this.x + 11, this.y - 3, 'font', this.getRemainingCoins().toString())
      .setTintFill(this.isComplete ? 0xbdbdbd : 0x9a9a9a);

    this.setFrame(this.getFrame());
    this.initialized = true;
  }

  private getRemainingCoins(): integer {
    const coinCounter = CoinCounter.getInstance();

    const level = this.getLevel();

    return coinCounter.getRemainingByLevel(level);
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

  public getLevel(): string {
    return this.getProperty('level')?.value as string ?? 'cave';
  }

  private changeColor(): void {
    if (this.isGlowing) {
      this.setTintFill(0xffffff);
      return;
    }

    this.clearTint();
  }

  public update(time: number): void {
    if (!this.initialized) {
      this.init();
    }

    if (!this.isComplete) {
      return;
    }

    if (!this.eventEmitted) {
      EventDispatcher.emit('coinCounterComplete', this);
      this.eventEmitted = true;
    }

    if (!this.startAt) {
      this.startAt = time;
    }

    if (time > this.startAt + 400) {
      this.isGlowing = !this.isGlowing;
      this.startAt = null;
    }

    this.changeColor();
  }
}
