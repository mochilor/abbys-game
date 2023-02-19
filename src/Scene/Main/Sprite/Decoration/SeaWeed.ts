import GameItem from '../../GameItem/GameItemInterface';
import RoomName from '../../Map/RoomName';
import GameObject from '../GameObject';
import { tintShallow } from './tint';

export default class SeaWeed extends GameObject {
  public static key = 'SeaWeed';

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    uuid: string,
    properties: GameItem['properties'],
    roomName: RoomName,
  ) {
    // x and y offset!
    super(scene, x + 4, y - 4, 'waterDetails', uuid, properties);

    scene.anims.create({
      key: 'seaweed',
      frameRate: 12,
      frames: this.anims.generateFrameNumbers('waterDetails', {}),
      repeat: -1,
    });

    this.play({
      key: 'seaweed',
      startFrame: Math.floor(Math.random() * 8),
    });

    tintShallow(this, roomName);
  }
}
