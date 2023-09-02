import { GameItem } from '../../../GameItem/types';
import GameObject from '../../GameObject';
import * as EventDispatcher from '../../../../../Service/EventDispatcher';

export default class Ruby extends GameObject {
  public static key = 'Ruby';

  private bounceTween: Phaser.Tweens.Tween;

  private isRealRuby: boolean = false;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'rubySpriteSheet');

    this.isRealRuby = !!parseInt(this.getProperty('final')?.value as string ?? '0', 10);

    scene.physics.world.enable(this);

    const frameOffset = this.isRealRuby ? 10 : 0;

    const key = `ruby${this.isRealRuby ? 'Real' : ''}`;

    scene.anims.create({
      key,
      frameRate: 16,
      frames: this.anims.generateFrameNumbers(
        'rubySpriteSheet',
        { start: 0 + frameOffset, end: 9 + frameOffset },
      ),
      repeat: -1,
      repeatDelay: 4000,
    });

    this.play(key);

    this.bounceTween = scene.tweens.add({
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

  public stopBounce(): void {
    this.bounceTween.stop();
  }

  public freeze(): void {
    this.stopBounce();
    this.setDepth(10);
    this.scene.tweens.add({
      props: {
        y: '-=40',
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
    EventDispatcher.emit('rubyAnimation1Finished', this);
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

  public isReal(): boolean {
    return this.isRealRuby;
  }
}
