import Phaser from 'phaser';
import GameItem from '../../GameItem/GameItemInterface';
import RoomName from '../../Map/RoomName';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Coin extends GameObject implements GameSprite {
  public static key = 'Coin';

  private roomName: RoomName;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    uuid: string,
    properties: GameItem['properties'],
    roomName: RoomName,
  ) {
    super(scene, x, y, 'objects', uuid, properties);

    this.roomName = roomName;

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

  public getRoomName(): string {
    return this.roomName.getName();
  }
}
