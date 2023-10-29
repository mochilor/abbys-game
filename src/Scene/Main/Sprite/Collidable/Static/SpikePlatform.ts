import { GameItem } from '../../../GameItem/types';
import GameObject from '../../GameObject';

export default class SpikePlatform extends GameObject {
  public static key = 'SpikePlatform';

  private speed: number = 25;

  private stopLength: number;

  private isFalling: boolean;

  private restartTime: number;

  private startTime: number = 0;

  private delay: number;

  private startAt: number = null;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);
    this.setFrame('spike-platform');
    this.y += 2;

    scene.physics.world.enable(this);
    this.body.setImmovable();

    this.isFalling = false;
    this.restartTime = 3500;
    this.body.setGravityY(0);

    this.delay = this.getProperty('delay') ? this.getProperty('delay').value as number : 0;
    this.stopLength = this.getProperty('stopLength')?.value as number ?? 0;
  }

  public update(time: number): void {
    if (this.startAt === null) {
      this.startAt = time;
    }

    if (this.delay > 0 && time - this.startAt < this.delay) {
      return;
    }

    if (!this.body.blocked.up && !this.isFalling) {
      this.body.setVelocityY(-this.speed);
      return;
    }

    if (this.startTime === 0) {
      this.startTime = time;
    }

    const delta = time - this.startTime;

    if (delta > this.stopLength) {
      this.isFalling = true;
      this.body.setGravityY(300);
    }

    if (delta > this.restartTime) {
      this.isFalling = false;
      this.startTime = 0;
      this.body.setGravityY(0);
    }
  }

  /**
   * Factory function intended to add new object after main instantiation in SpriteManager.
   */
  public static makeAdditional(scene: Phaser.Scene, gameItem: GameItem): SpikePlatform {
    const platform = new SpikePlatform(scene, gameItem);
    platform.setDepth(-1);

    return platform;
  }
}
