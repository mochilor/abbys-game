import Phaser from 'phaser';
import { GameItem } from '../../../GameItem/types';
import RoomName from '../../../Map/RoomName';
import GameObject from '../../GameObject';

export default class Button extends GameObject {
  public static key = 'Button';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'objects');

    scene.physics.world.enable(this);
    this.body.setImmovable();
    this.body.setSize(8, 2);
    this.body.setOffset(0, 6);

    this.setFrame(7);
  }

  public getEventName(): string {
    return `button${this.getProperty('event').value}Activated`;
  }

  public getRoomName(): RoomName {
    return this.gameItem.roomName;
  }
}
