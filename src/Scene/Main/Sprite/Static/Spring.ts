import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Spring extends GameObject implements GameSprite {
  public static key = 'Spring';

  private timer: number = 0;

  private isActivated: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'objects');

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();
    this.body.setSize(8, 2);
    this.body.setOffset(0, 6);

    this.deactivate();
  }

  private deactivate(): void {
    this.timer = 0;
    this.isActivated = false;
    this.setFrame(3);
  }

  public activate(): void {
    this.setFrame(4);
  }

  public update(): void {
    if (this.isActive) {
      this.timer += 1;
      if (this.timer > 20) {
        this.timer = 0;
        this.isActivated = false;
        this.setFrame(3);
      }
    }
  }

  public isActive(): boolean {
    return this.isActivated;
  }
}
