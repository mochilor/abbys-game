import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';

export default class Light extends GameObject {
  public static key = 'Light';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'lightTexture');

    this.setDepth(-10);

    const delay = (this.y % 10) * 100;

    scene.tweens.add({
      props: {
        alpha: 0,
      },
      yoyo: true,
      targets: this,
      duration: 500,
      repeat: -1,
      ease: 'linear',
      hold: 3000,
      repeatDelay: 1000,
      delay,
    });
  }
}
