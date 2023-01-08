import GameSprite from '../../GameSpriteInterface';
import EnemyGameObject from './EnemyGameObject';

export default class CannonBall extends EnemyGameObject implements GameSprite {
  public static key = 'CannonBall';

  private startingX: integer;

  private startingY: integer;

  private xSpeedMultiplier: integer;

  private ySpeedMultiplier: integer;

  private lastDeathTime: integer = null;

  private deactivable: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, angle: integer, deactivable: boolean) {
    super(scene, x, y, 'objects');

    this.startingX = x;
    this.startingY = y;

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();
    this.body.setSize(6, 6);

    this.setFrame(9);

    // 1: ^
    // 2: >
    // 3: V
    // 4: <
    if (angle === 0) { // ^
      this.xSpeedMultiplier = 0;
      this.ySpeedMultiplier = -1;
    } else if (angle === 90) { // >
      this.xSpeedMultiplier = 1;
      this.ySpeedMultiplier = 0;
    } else if (Math.abs(angle) === 180) { // V
      this.xSpeedMultiplier = 0;
      this.ySpeedMultiplier = 1;
    } else if (angle === -90 || angle === 270) { // <
      this.xSpeedMultiplier = -1;
      this.ySpeedMultiplier = 0;
    } else {
      throw new Error(`Invalid cannonball angle (${angle})`);
    }

    this.deactivable = deactivable;

    this.fire();

    scene.anims.create({
      key: 'cannonBall',
      frameRate: 12,
      frames: this.anims.generateFrameNumbers('objects', { start: 9, end: 11 }),
      repeat: -1,
      yoyo: true,
    });

    this.play('cannonBall');
  }

  public update(time: number): void {
    if (this.lastDeathTime && (time - this.lastDeathTime > 1000)) {
      this.lastDeathTime = null;
      this.fire();
    }

    if (!this.body.blocked.none) {
      this.reset(time);
    }
  }

  private fire(): void {
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    const speed = 100;

    this.body.setVelocityX(speed * this.xSpeedMultiplier);
    this.body.setVelocityY(speed * this.ySpeedMultiplier);
  }

  public reset(time: number): void {
    this.lastDeathTime = time;
    this.body.reset(this.startingX, this.startingY);
    this.setActive(false);
    this.setVisible(false);
    this.body.enable = false;
    this.body.setVelocityX(0);
    this.body.setVelocityY(0);
  }

  public deactivate(): void {
    if (this.deactivable) {
      this.body.enable = false;
      this.visible = false;
    }
  }
}
