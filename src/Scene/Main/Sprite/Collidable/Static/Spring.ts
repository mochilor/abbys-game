import { GameItem } from '../../../GameItem/types';
import GameObject from '../../GameObject';
import * as EventDispatcher from '../../../../../Service/EventDispatcher';

export default class Spring extends GameObject {
  public static key = 'Spring';

  private timer: number = 0;

  private isActivated: boolean = false;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);
    this.deactivate();

    scene.physics.world.enable(this);
    this.body.setImmovable();
    this.body.setSize(8, 2);
    this.body.setOffset(0, 6);

    this.body.checkCollision.down = false;
    this.body.checkCollision.right = false;
    this.body.checkCollision.left = false;
  }

  private deactivate(): void {
    this.timer = 0;
    this.isActivated = false;
    this.setFrame('objects_03');
  }

  public activate(): void {
    this.setFrame('objects_04');
    EventDispatcher.emit('springActivated');
  }

  public update(): void {
    if (this.isActive) {
      this.timer += 1;
      if (this.timer > 20) {
        this.timer = 0;
        this.isActivated = false;
        this.setFrame('objects_03');
      }
    }
  }

  public isActive(): boolean {
    return this.isActivated;
  }
}
