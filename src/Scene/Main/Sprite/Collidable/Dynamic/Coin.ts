import Phaser from 'phaser';
import { GameItem } from '../../../GameItem/types';
import RoomName from '../../../Map/RoomName';
import GameObject from '../../GameObject';

export default class Coin extends GameObject {
  public static key = 'Coin';

  private roomName: RoomName;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);
    this.setFrame('objects_00');

    this.roomName = gameItem.roomName;

    scene.physics.world.enable(this);

    scene.anims.create({
      key: 'coin',
      frameRate: 7,
      frames: this.anims.generateFrameNames(
        'sprites',
        {
          prefix: 'objects_',
          end: 2,
          zeroPad: 2,
        },
      ),
      repeat: -1,
    });

    this.play('coin');

    const enabled = parseInt(this.getProperty('enabled')?.value as string ?? '1', 10);

    if (!enabled) {
      this.body.setEnable(false);
      this.setVisible(false);
    }
  }

  public getRoomName(): string {
    return this.roomName.getName();
  }
}
