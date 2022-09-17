import Phaser from 'phaser';
import GameObject from '../GameObject';

export default class Scuba extends GameObject {
  public static key = 'Scuba';

  constructor(scene: Phaser.Scene, x: number, y: number, uuid: string) {
    super(scene, x, y, 'objects', uuid);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    scene.anims.create({
      key: 'scuba',
      frameRate: 7,
      frames: this.anims.generateFrameNumbers('objects', { start: 3, end: 5 }),
      repeat: -1,
      yoyo: true,
    });

    this.play('scuba');
  }
}
