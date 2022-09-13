import Phaser from 'phaser';

export default class Save extends Phaser.GameObjects.Sprite {
  public static key = 'Save';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'objects');

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setFrame(7);
  }
}
