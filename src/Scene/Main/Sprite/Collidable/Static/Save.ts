import Phaser from 'phaser';
import GameItem from '../../../GameItem/GameItemInterface';
import RoomName from '../../../Map/RoomName';
import GameObject from '../../GameObject';

export default class Save extends GameObject {
  public static key = 'Save';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'objects');

    scene.physics.world.enable(this);

    this.setFrame(5);
  }

  public resetBody() {
    this.body.enable = true;
    this.setVisible(true);
  }

  public getRoomName(): RoomName {
    return this.gameItem.roomName;
  }
}
