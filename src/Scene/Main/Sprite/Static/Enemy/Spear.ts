import GameSprite from '../../GameSpriteInterface';
import EnemyGameObject from './EnemyGameObject';

export default class Spear extends EnemyGameObject implements GameSprite {
  public static key = 'Spear';

  private initialPosition: number;

  private speed: number = 2;

  private isStop: boolean = false;

  private stopCounter: number = 0;

  private maxDistance: number = 8;

  constructor(scene: Phaser.Scene, x: number, y: number, angle: number) {
    super(scene, x, y, 'spearImage');

    this.type = angle === 0 || angle === 180 ? 'y' : 'x';
    this.setAngle(angle);

    const offsetY = 4;
    const offsetX = 4;

    if (Math.abs(angle) === 180) { // V
      this.x -= offsetX;
      this.y += offsetY;
    } else if (angle === -90 || angle === 270) { // <
      this.x -= offsetX;
      this.y -= offsetY;
    } else if (angle === 0) { // ^
      this.x += offsetX;
      this.y -= offsetY;
    } else if (angle === 90) { // >
      this.x += offsetX;
      this.y += offsetY;
    }

    this.initialPosition = this.getAxisPosition();

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();
    // this.rotation = 10;

    this.setDepth(-100);
  }

  private getAxisPosition(): number {
    return this[this.type];
  }

  public update(): void {
    if (this.stopCounter > 50) {
      this.isStop = false;
      this.speed *= -1;
      this.stopCounter = 0;
    }

    if (this.isStop) {
      this.stopCounter += 1;
      return;
    }

    if (this.isFarEnough()) {
      this.isStop = true;
      this.fixOffeset();
      return;
    }

    this[this.type] += this.speed;
  }

  private isFarEnough(): boolean {
    return Math.abs(this[this.type] - this.initialPosition) > this.maxDistance;
  }

  private fixOffeset(): void {
    if (this[this.type] > this.initialPosition) {
      this[this.type] = this.initialPosition + this.maxDistance;
    } else if (this[this.type] < this.initialPosition) {
      this[this.type] = this.initialPosition - this.maxDistance;
    }
  }
}
