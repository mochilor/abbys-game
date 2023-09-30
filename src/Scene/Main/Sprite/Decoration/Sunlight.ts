import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';

export default class Sunlight extends GameObject {
  public static key = 'Sunlight';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);

    this.setFrame('sunlight');

    this.setDepth(-101);

    const orientation = this.getProperty('orientation')?.value as number ?? 1;

    this.flipX = orientation < 0;

    scene.tweens.add({
      props: {
        alpha: 0.7,
      },
      yoyo: true,
      targets: this,
      duration: 5000,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
