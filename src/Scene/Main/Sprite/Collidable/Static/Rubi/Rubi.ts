import { GameItem } from '../../../../GameItem/types';
import GameObject from '../../../GameObject';
import { makeShaker, Shaker } from './Shaker';

export default class Rubi extends GameObject {
  public static key = 'Rubi';

  private tween: Phaser.Tweens.Tween;

  private shaker: Shaker = null;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'rubiSpriteSheet');

    scene.physics.world.enable(this);

    scene.anims.create({
      key: 'rubi',
      frameRate: 16,
      frames: 'rubiSpriteSheet',
      repeat: -1,
      repeatDelay: 4000,
    });

    this.play('rubi');

    this.tween = scene.tweens.add({
      props: {
        y: '-=8',
      },
      yoyo: true,
      targets: this,
      duration: 800,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  public freeze(): void {
    this.tween.stop();
    this.setDepth(10);

    this.scene.tweens.add({
      props: {
        y: '-=64',
      },
      targets: this,
      duration: 2000,
      loop: 0,
      ease: 'linear',
      delay: 2000,
      onComplete: this.makeReady.bind(this),
    });
  }

  private makeReady(): void {
    this.shaker = makeShaker(this.x, this.y);
  }

  public update(time: number) {
    if (this.shaker) {
      const newPosition = this.shaker.shake(time);

      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }
}
