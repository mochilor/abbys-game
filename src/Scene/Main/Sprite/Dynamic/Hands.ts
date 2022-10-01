import Phaser from 'phaser';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Hands extends GameObject implements GameSprite {
  public static key = 'Hands';

  constructor(scene: Phaser.Scene, x: number, y: number, roomName: string, uuid: string) {
    super(scene, x, y, 'objects', roomName, uuid);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setFrame(6);
  }
}
