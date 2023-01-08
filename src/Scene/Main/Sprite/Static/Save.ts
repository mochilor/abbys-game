import Phaser from 'phaser';
import GameItem from '../../GameItem/GameItemInterface';
import RoomName from '../../Map/RoomName';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Save extends GameObject implements GameSprite {
  public static key = 'Save';

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

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setFrame(5);

    this.roomName = roomName;
  }

  public resetBody() {
    this.body.enable = true;
    this.visible = true;
  }

  public getRoomName(): RoomName {
    return this.roomName;
  }
}
