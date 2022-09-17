export default class Spike extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'objects');

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();

    this.setFrame(8);
  }
}
