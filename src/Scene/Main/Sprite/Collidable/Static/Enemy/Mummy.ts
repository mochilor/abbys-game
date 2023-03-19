import { GameItem } from '../../../../GameItem/types';
import EnemyGameObject from './EnemyGameObject';

export default class Mummy extends EnemyGameObject {
  public static key = 'Mummy';

  private initialX: integer;

  private forward: integer = 1;

  private diedAt: integer = null;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'mummySpriteSheet');
    scene.physics.world.enable(this);
    this.body.setSize(10, 20);

    this.y = gameItem.y + 2;

    this.body.enable = false;

    this.initialX = this.x;

    this.forward = parseInt(this.getProperty('orientation')?.value as string ?? '1', 10);

    this.setFlipX(this.forward !== 1);

    scene.anims.create({
      key: 'mummyWalk',
      frameRate: 12,
      frames: this.anims.generateFrameNumbers('mummySpriteSheet', { start: 0, end: 7 }),
      repeat: -1,
    });

    scene.anims.create({
      key: 'mummyDeath',
      frameRate: 12,
      frames: this.anims.generateFrameNumbers('mummySpriteSheet', { start: 8, end: 13 }),
      repeat: 0,
    });

    this.born();
  }

  private born(): void {
    this.playReverse('mummyDeath');
    this.once('animationcomplete', this.startWalking);
  }

  private startWalking(): void {
    this.setFrame(8);
    this.play('mummyWalk');
    this.body.setVelocityX(-24 * this.forward);
    this.body.enable = true;
  }

  private die(): void {
    this.body.enable = false;
    this.stop();
    this.setFrame(8);
    this.play('mummyDeath');
  }

  public update(time: number): void {
    if (this.body.enable && (this.body.blocked.left || this.body.blocked.right)) {
      this.diedAt = time;
      this.die();
    }

    if (this.diedAt && time > this.diedAt + 1000) {
      this.x = this.initialX;
      this.diedAt = null;
      this.born();
    }
  }
}
