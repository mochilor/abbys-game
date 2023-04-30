import { GameItem } from '../../../../GameItem/types';
import GameObject from '../../../GameObject';
import { makeShaker, Shaker } from './Shaker';
import * as EventDispatcher from '../../../../../../Service/EventDispatcher';

export default class Ruby extends GameObject {
  public static key = 'Ruby';

  private tween: Phaser.Tweens.Tween;

  private shaker: Shaker = null;

  private isRealRuby: boolean = false;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'rubySpriteSheet');

    this.isRealRuby = !!parseInt(this.getProperty('final')?.value as string ?? '0', 10);

    scene.physics.world.enable(this);

    scene.anims.create({
      key: 'ruby',
      frameRate: 16,
      frames: 'rubySpriteSheet',
      repeat: -1,
      repeatDelay: 4000,
    });

    this.play('ruby');

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
    if (this.isRealRuby) {
      this.shaker = makeShaker(this.x, this.y);
    } else {
      EventDispatcher.emit('rubyAnimation1Finished', this);
    }
  }

  public move(x: number, y: number): void {
    this.setDepth(20);
    this.scene.tweens.add({
      props: {
        y,
        x,
        scaleX: 0.2,
        scaleY: 0.2,
      },
      targets: this,
      duration: 2000,
      loop: 0,
      ease: 'linear',
      onComplete: this.makeReadyToGo.bind(this),
    });
  }

  private makeReadyToGo(): void {
    this.setTintFill(0xffffff);
    this.scene.tweens.add({
      props: {
        alpha: 0,
        angle: 360,
      },
      targets: this,
      duration: 1000,
      loop: 0,
      ease: 'linear',
    });
    EventDispatcher.emit('rubyAnimation2Finished', this);
  }

  public update(time: number) {
    if (this.shaker) {
      const newPosition = this.shaker.shake(time);

      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }
}
