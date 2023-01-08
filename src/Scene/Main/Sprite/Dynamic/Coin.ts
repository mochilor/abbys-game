import Phaser from 'phaser';
import GameItem from '../../GameItem/GameItemInterface';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Coin extends GameObject implements GameSprite {
  public static key = 'Coin';

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    uuid: string,
    properties: GameItem['properties'],
  ) {
    super(scene, x, y, 'objects', uuid, properties);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    scene.anims.create({
      key: 'coin',
      frameRate: 7,
      frames: this.anims.generateFrameNumbers('objects', { start: 0, end: 2 }),
      repeat: -1,
    });

    this.play('coin');

    const enabled = parseInt(this.getProperty('enabled')?.value as string ?? '1', 10);

    if (!enabled) {
      this.body.enable = false;
      this.visible = false;
    }
  }
}
