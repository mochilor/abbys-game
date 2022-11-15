import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Spike extends GameObject implements GameSprite {
  public static key = 'Spike';

  constructor(scene: Phaser.Scene, x: number, y: number, rotation: number) {
    super(scene, x, y, 'objects');

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();

    this.setAngle(rotation);

    this.setFrame(8);

    if (this.isFacingDown()) {
      this.body.checkCollision.up = false;
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
}
