import { GameItem } from '../../../GameItem/types';
import GameObject from '../../GameObject';
import * as EventDispatcher from '../../../../../Service/EventDispatcher';

export default class Spring extends GameObject {
  public static key = 'Spring';

  private timer: number = 0;

  private isActivated: boolean = false;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'objects');

    scene.physics.world.enable(this);
    this.body.setImmovable();
    this.body.setSize(8, 2);
    this.body.setOffset(0, 6);

    this.deactivate();

    this.body.checkCollision.down = false;
  }

  private deactivate(): void {
    this.timer = 0;
    this.isActivated = false;
    this.setFrame(3);
  }

  public activate(): void {
    this.setFrame(4);
    EventDispatcher.emit('springActivated');
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
