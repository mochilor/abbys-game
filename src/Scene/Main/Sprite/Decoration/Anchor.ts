import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';
import * as EventDispatcher from '../../../../Service/EventDispatcher';

export default class Anchor extends GameObject {
  public static key = 'Anchor';

  private rope: Phaser.GameObjects.TileSprite;

  private ropeOffset: integer = 18;

  private isFalling: boolean = false;

  private isMovingUp: boolean = false;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'anchorSpriteSheet');

    scene.physics.world.enable(this);
    this.body.setImmovable();

    this.body.setSize(8, 37);

    this.rope = scene.add.tileSprite(this.x, this.y - this.ropeOffset, 1, 256, 'anchorRopeImage');
    this.rope.setOrigin(0, 1);

    this.setFrame(0);
  }

  public fall(): void {
    this.isFalling = true;
    this.body.setGravityY(200);
  }

  public update(): void {
    this.rope.y = this.y - this.ropeOffset;

    if (this.isMovingUp && this.y < 48) {
      this.isMovingUp = false;
      EventDispatcher.emit('anchorTouchedTop', this);
    }

    if (!this.isFalling) {
      return;
    }

    if (this.body.blocked.down) {
      this.body.setGravityY(0);
      EventDispatcher.emit('anchorTouchedBottom', this);
      this.isFalling = false;
    }
  }

  public startMovingUp(): void {
    this.setFrame(1);
    this.body.setVelocityY(-32);
    this.isMovingUp = true;
  }

  /**
  * Factory function intended to add new object after main instantiation in SpriteManager.
  */
  public static makeAdditional(scene: Phaser.Scene, gameItem: GameItem): Anchor {
    const anchor = new Anchor(scene, gameItem);

    return anchor;
  }
}
