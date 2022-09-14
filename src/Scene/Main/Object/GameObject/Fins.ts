import Phaser from 'phaser';
import GameObject from '../GameObject';

export default class Fins extends GameObject {
  public static key = 'Fins';

  constructor(scene: Phaser.Scene, x: number, y: number, uuid: string) {
    super(scene, x, y, 'objects', uuid);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setFrame(6);
  }
}
