import GameItem from '../../../GameItem/GameItemInterface';
import GameObject from '../../GameObject';

export default class Spike extends GameObject {
  public static key = 'Spike';

  private deactivable: boolean = false;

  private activable: boolean = false;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'objects');

    scene.physics.world.enable(this);
    this.body.setImmovable();

    this.setAngle(gameItem.rotation);

    this.setFrame(6);

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

  public deactivate(): void {
    if (this.deactivable) {
      this.body.enable = false;
      this.setVisible(false);
    }
  }

  public activate(): void {
    if (this.activable) {
      this.body.enable = true;
      this.setVisible(true);
    }
  }
}
