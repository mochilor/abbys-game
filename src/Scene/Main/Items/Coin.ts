import Phaser from 'phaser';

export default class Coin extends Phaser.GameObjects.Sprite {
  private key: string = 'coin';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'objects');

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

  public getkey(): string {
    return this.key;
  }
}
