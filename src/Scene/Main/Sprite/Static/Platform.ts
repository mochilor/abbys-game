import GameItem from '../../GameItem/GameItemInterface';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Platform extends GameObject implements GameSprite {
  public static key = 'Platform';

  private fromX: number = null;

  private fromY: number = null;

  private toX: number = null;

  private toY: number = null;

  private xDirection: number = 1;

  private yDirection: number = 1;

  private speed: number = 50;

  constructor(scene: Phaser.Scene, x: number, y: number, uuid: string, properties: GameItem['properties']) {
    super(scene, x, y, 'platformImage', null, uuid, properties);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();

    const fromXProperty = this.getProperty('fromX');
    if (fromXProperty !== null) {
      this.fromX = x + parseInt(fromXProperty.value as string, 10);
    }

    const toXProperty = this.getProperty('toX');
    if (toXProperty !== null) {
      this.toX = x + parseInt(toXProperty.value as string, 10);
    }

    const fromYProperty = this.getProperty('fromY');
    if (fromYProperty !== null) {
      this.fromY = y + parseInt(fromYProperty.value as string, 10);
    }

    const toYProperty = this.getProperty('toY');
    if (toYProperty !== null) {
      this.toY = y + parseInt(toYProperty.value as string, 10);
    }

    const speedProperty = this.getProperty('speed');
    if (speedProperty !== null) {
      this.speed = parseInt(speedProperty.value as string, 10);
    }
  }

  public update(): void {
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
}
