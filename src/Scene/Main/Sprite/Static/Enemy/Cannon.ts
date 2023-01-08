import GameItem from '../../../GameItem/GameItemInterface';
import GameObject from '../../GameObject';
import GameSprite from '../../GameSpriteInterface';
import CannonBall from './CannonBall';

export default class Cannon extends GameObject implements GameSprite {
  public static key = 'Cannon';

  private cannonBall: CannonBall;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    angle: number,
    properties: GameItem['properties'],
  ) {
    super(scene, x, y, 'objects', '', properties);

    scene.add.existing(this);
    this.setAngle(angle);
    this.setFrame(8);
  }

  public setup(): void {
    let deactivable = false;
    if (this.getProperty('deactivable')) {
      deactivable = this.getProperty('deactivable').value === '1';
    }

    this.cannonBall = new CannonBall(this.scene, this.x, this.y, this.angle, deactivable);
  }

  public getCannonBall(): CannonBall {
    return this.cannonBall;
  }
}
