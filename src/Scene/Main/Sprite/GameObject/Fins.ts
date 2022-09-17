import Phaser from 'phaser';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Fins extends GameObject implements GameSprite {
  public static key = 'Fins';

  constructor(scene: Phaser.Scene, x: number, y: number, uuid: string) {
    super(scene, x, y, 'objects', uuid);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setFrame(6);
  }
}
