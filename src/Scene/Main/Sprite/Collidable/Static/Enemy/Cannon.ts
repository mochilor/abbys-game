import { GameItem } from '../../../../GameItem/types';
import GameObject from '../../../GameObject';
import CannonBall from './CannonBall';

export default class Cannon extends GameObject {
  public static key = 'Cannon';

  private cannonBall: CannonBall;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);
    this.setFrame('objects_08');
    this.setAngle(gameItem.rotation);

    this.fixOffsetBasedOnRotation();
  }

  public setup(): void {
    let deactivable = false;
    if (this.getProperty('deactivable')) {
      deactivable = this.getProperty('deactivable').value === '1';
    }

    this.cannonBall = new CannonBall(this.scene, this.gameItem, deactivable);
  }

  public getCannonBall(): CannonBall {
    return this.cannonBall;
  }
}
