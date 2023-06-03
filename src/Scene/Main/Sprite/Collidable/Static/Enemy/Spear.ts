import { GameItem } from '../../../../GameItem/types';
import EnemyGameObject from './EnemyGameObject';
import * as EventDispatcher from '../../../../../../Service/EventDispatcher';

export default class Spear extends EnemyGameObject {
  public static key = 'Spear';

  private initialPosition: number;

  private speed: number = 2;

  private isStop: boolean = false;

  private stopCounter: number = 0;

  private maxDistance: number = 8;

  private reverseCrop: boolean = false;

  private started: integer = 0;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'spearImage');

    scene.physics.world.enable(this);
    this.body.setImmovable();

    const angle = gameItem.rotation;

    this.type = angle === 0 || angle === 180 ? 'y' : 'x';
    this.setAngle(angle);

    this.body.setSize(3, 22);

    /**
     * Image size: 32 x 5
     * Bounding box size: 22 x 3
     * Offset (vertical spear):
     * - top: 1
     * - right: 1
     * - left: 1
     * - bottom: 8
     */

    this.fixOffsetBasedOnRotation();

    if (Math.abs(gameItem.rotation) === 180) { // V
      this.body.setOffset(1, 8);
    } else if (gameItem.rotation === -90 || gameItem.rotation === 270) { // <
      this.setHorizontalBody();
      this.reverseCrop = true;
      this.body.setOffset(-11, 14);
    } else if (gameItem.rotation === 0) { // ^
      this.reverseCrop = true;
      this.body.setOffset(1, 1);
    } else if (gameItem.rotation === 90) { // >
      this.setHorizontalBody();
      this.body.setOffset(-5, 14);
    }

    this.initialPosition = this.getAxisPosition();

    // 5 32
    this.setCrop(0, 0, 5, 12);
  }

  private setHorizontalBody(): void {
    this.body.setSize(this.body.height, this.body.width);
  }

  private getAxisPosition(): number {
    return this[this.type];
  }

  public update(): void {
    this.started += 1;
    if (this.started === 2) {
      // On first run the event has no effect, probably becasue of camera position
      EventDispatcher.emit('spearMoving', this);
    }

    if (this.stopCounter > 50) {
      this.isStop = false;
      this.speed *= -1;
      this.stopCounter = 0;
      EventDispatcher.emit('spearMoving', this);
    }

    if (this.isStop) {
      this.stopCounter += 1;
      return;
    }

    if (this.isFarEnough()) {
      this.isStop = true;
      this.fixOffeset();
      this.crop();
      return;
    }

    this[this.type] += this.speed;
    this.crop();
  }

  private isFarEnough(): boolean {
    return Math.abs(this[this.type] - this.initialPosition) > this.maxDistance;
  }

  private crop(): void {
    let cropHeight = this[this.type] - this.initialPosition;
    if (this.reverseCrop) {
      cropHeight = this.initialPosition - this[this.type];
    }

    this.setCrop(0, 0, 5, cropHeight + 20);
  }

  private fixOffeset(): void {
    if (this[this.type] > this.initialPosition) {
      this[this.type] = this.initialPosition + this.maxDistance;
    } else if (this[this.type] < this.initialPosition) {
      this[this.type] = this.initialPosition - this.maxDistance;
    }
  }
}
