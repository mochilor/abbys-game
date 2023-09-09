import Phaser from 'phaser';
import { GameItem } from '../../../GameItem/types';
import RoomName from '../../../Map/RoomName';
import GameObject from '../../GameObject';

export default class Save extends GameObject {
  public static key = 'Save';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);

    this.setFrame('objects_05');

    scene.physics.world.enable(this);
  }

  public resetBody() {
    this.body.enable = true;
    this.setVisible(true);
  }

  public getRoomName(): RoomName {
    return this.gameItem.roomName;
  }
}
