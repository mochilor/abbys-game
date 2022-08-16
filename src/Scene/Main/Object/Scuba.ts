import Phaser from 'phaser';

export default class Scuba extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'objects');

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
