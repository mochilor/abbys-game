import Phaser from 'phaser';

export default class Fins extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'objects');

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setFrame(6);
  }
}
