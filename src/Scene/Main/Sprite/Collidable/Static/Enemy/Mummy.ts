import { GameItem } from '../../../../GameItem/types';
import EnemyGameObject from './EnemyGameObject';

const framePrefix = 'mummy_';

export default class Mummy extends EnemyGameObject {
  public static key = 'Mummy';

  private initialX: integer;

  private forward: integer = 1;

  private delay: integer = 0;

  private diedAt: integer = null;

  private startAt: integer = null;

  private hasBorn: boolean = false;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);
    this.setFrame(`${framePrefix}00`);

    scene.physics.world.enable(this);
    this.body.setSize(10, 20);

    this.y = gameItem.y + 2;

    this.body.enable = false;

    this.initialX = this.x;

    this.forward = parseInt(this.getProperty('orientation')?.value as string ?? '1', 10);

    this.delay = parseInt(this.getProperty('delay')?.value as string ?? '0', 10);

    this.setFlipX(this.forward !== 1);

    scene.anims.create({
      key: 'mummyWalk',
      frameRate: 12,
      frames: this.anims.generateFrameNames(
        'sprites',
        {
          prefix: framePrefix,
          end: 7,
          zeroPad: 2,
        },
      ),
      repeat: -1,
    });

    scene.anims.create({
      key: 'mummyDeath',
      frameRate: 12,
      frames: this.anims.generateFrameNames(
        'sprites',
        {
          prefix: framePrefix,
          start: 8,
          end: 13,
          zeroPad: 2,
        },
      ),
      repeat: 0,
    });

    this.setVisible(false);
  }

  private born(): void {
    this.setVisible(true);
    this.playReverse('mummyDeath');
    this.once('animationcomplete', this.startWalking);
    this.hasBorn = true;
  }

  private startWalking(): void {
    this.setFrame(`${framePrefix}08`);
    this.play('mummyWalk');
    this.body.setVelocityX(-24 * this.forward);
    this.body.enable = true;
  }

  private die(): void {
    this.body.enable = false;
    this.stop();
    this.setFrame(`${framePrefix}08`);
    this.play('mummyDeath');
  }

  public update(time: number): void {
    if (!this.startAt) {
      this.startAt = time;
    }

    if (!this.hasBorn && time > this.startAt + this.delay) {
      this.born();
    }

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
