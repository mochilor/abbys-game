import { GameItem } from '../../../GameItem/types';
import GameObject from '../../GameObject';

export default class Spike extends GameObject {
  public static key = 'Spike';

  private deactivable: boolean = false;

  private activable: boolean = false;

  private event: integer = null;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);
    this.setFrame('objects_06');

    scene.physics.world.enable(this);
    this.body.setImmovable();

    this.setAngle(gameItem.rotation);

    if (this.isFacingUp()) {
      this.body.checkCollision.down = false;
    }

    if (this.isFacingDown()) {
      this.body.checkCollision.up = false;
    }

    this.body.setSize(6, 6);

    if (this.getProperty('deactivable')) {
      this.deactivable = this.getProperty('deactivable').value === '1';
    }

    if (this.getProperty('activable')) {
      this.body.enable = false;
      this.setVisible(false);
      this.activable = this.getProperty('activable').value === '1';
    }

    if (this.getProperty('event')) {
      this.event = parseInt(this.getProperty('event').value as string, 10);
    }

    this.fixOffsetBasedOnRotation();
  }

  public isFacingUp(): boolean {
    return this.angle === 0;
  }

  public isFacingRight(): boolean {
    return this.angle === 90;
  }

  public isFacingDown(): boolean {
    return Math.abs(this.angle) === 180;
  }

  public isFacingLeft(): boolean {
    return this.angle === -90;
  }

  public deactivate(event: integer): void {
    if (this.deactivable && this.event === event) {
      this.body.enable = false;
      this.setVisible(false);
    }
  }

  public activate(event: integer): void {
    if (this.activable && this.event === event) {
      this.body.enable = true;
      this.setVisible(true);
    }
  }
}
