import Phaser from 'phaser';
import GameObject from '../GameObject';

export default class Coin extends GameObject {
  public static key = 'Coin';

  constructor(scene: Phaser.Scene, x: number, y: number, uuid: string) {
    super(scene, x, y, 'objects', uuid);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    scene.anims.create({
      key: 'coin',
      frameRate: 7,
      frames: this.anims.generateFrameNumbers('objects', { start: 0, end: 2 }),
      repeat: -1,
    });

    this.play('coin');
  }
}
