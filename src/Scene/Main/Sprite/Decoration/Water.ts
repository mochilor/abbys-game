import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';

export default class Water extends GameObject {
  public static key = 'Water';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);

    scene.anims.create({
      key: 'water',
      frameRate: 8,
      frames: this.anims.generateFrameNames(
        'sprites',
        {
          prefix: 'water_',
          end: 3,
        },
      ),
      repeat: -1,
      yoyo: true,
    });

    this.play({
      key: 'water',
    });

    this.setDepth(-102);

    this.setAlpha(0.9);

    scene.tweens.add({
      props: {
        x: '-=3',
      },
      yoyo: true,
      targets: this,
      duration: 1000,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
