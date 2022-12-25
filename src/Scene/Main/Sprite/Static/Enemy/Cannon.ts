import GameObject from '../../GameObject';
import GameSprite from '../../GameSpriteInterface';
import CannonBall from './CannonBall';

export default class Cannon extends GameObject implements GameSprite {
  public static key = 'Cannon';

  private cannonBall: CannonBall;

  constructor(scene: Phaser.Scene, x: number, y: number, angle: number) {
    super(scene, x, y, 'objects');

    scene.add.existing(this);
    this.setAngle(angle);
    this.setFrame(8);
  }

  public setup(): void {
    this.cannonBall = new CannonBall(this.scene, this.x, this.y, this.angle);
  }

  public getCannonBall(): CannonBall {
    return this.cannonBall;
  }
}
