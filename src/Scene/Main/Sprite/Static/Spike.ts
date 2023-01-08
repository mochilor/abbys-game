import GameItem from '../../GameItem/GameItemInterface';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Spike extends GameObject implements GameSprite {
  public static key = 'Spike';

  private deactivable: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    angle: number,
    properties: GameItem['properties'],
  ) {
    super(scene, x, y, 'objects', '', properties);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();

    this.setAngle(angle);

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
      this.visible = false;
    }
  }
}
