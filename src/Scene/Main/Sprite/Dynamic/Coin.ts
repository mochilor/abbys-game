import Phaser from 'phaser';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Coin extends GameObject implements GameSprite {
  public static key = 'Coin';

  constructor(scene: Phaser.Scene, x: number, y: number, roomName: string, uuid: string) {
    super(scene, x, y, 'objects', roomName, uuid);

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
