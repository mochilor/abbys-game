import { GameItem } from '../../../GameItem/types';
import GameObject from '../../GameObject';

export default class Platform extends GameObject {
  public static key = 'Platform';

  private fromX: number = null;

  private fromY: number = null;

  private toX: number = null;

  private toY: number = null;

  private xDirection: number = 1;

  private yDirection: number = 1;

  private speed: number = 50;

  private blocked: boolean = false;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);
    this.setFrame('platform');

    scene.physics.world.enable(this);
    this.body.setImmovable();
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;

    const fromXProperty = this.getProperty('fromX');
    if (fromXProperty !== null) {
      this.fromX = gameItem.x + parseInt(fromXProperty.value as string, 10);
    }

    const toXProperty = this.getProperty('toX');
    if (toXProperty !== null) {
      this.toX = gameItem.x + parseInt(toXProperty.value as string, 10);
    }

    const fromYProperty = this.getProperty('fromY');
    if (fromYProperty !== null) {
      this.fromY = gameItem.y + parseInt(fromYProperty.value as string, 10);
    }

    const toYProperty = this.getProperty('toY');
    if (toYProperty !== null) {
      this.toY = gameItem.y + parseInt(toYProperty.value as string, 10);
    }

    const speedProperty = this.getProperty('speed');
    if (speedProperty !== null) {
      this.speed = parseInt(speedProperty.value as string, 10);
    }

    this.blocked = this.getProperty('blocked')?.value === 'blocked';
  }

  public update(): void {
    if (this.blocked) {
      return;
    }

    if (this.fromX !== null && this.toX !== null) {
      this.body.setVelocityX(this.xDirection * this.speed);
      if (this.x > this.toX) {
        this.xDirection = -1;
      } else if (this.x < this.fromX) {
        this.xDirection = 1;
      }
    }

    if (this.fromY !== null && this.toY !== null) {
      this.body.setVelocityY(this.yDirection * this.speed);
      if (this.y > this.toY) {
        this.yDirection = -1;
      } else if (this.y < this.fromY) {
        this.yDirection = 1;
      }
    }
  }

  public getSpeed(): number {
    return this.speed;
  }

  public unblock(): void {
    this.blocked = false;
  }

  /**
   * Factory function intended to add new object after main instantiation in SpriteManager.
   */
  public static makeAdditional(scene: Phaser.Scene, gameItem: GameItem): Platform {
    const platform = new Platform(scene, gameItem);
    platform.setDepth(-1);

    return platform;
  }
}
