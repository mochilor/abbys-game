import Phaser from 'phaser';
import RoomName from '../../Map/RoomName';
import GameObject from '../GameObject';

interface Destination {
  room: RoomName,
  x: number,
  y: number,
}

export default class Portal extends GameObject {
  public static key = 'Portal';

  private roomName: RoomName;

  private destination: Destination;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    destination: Destination,
    roomName: RoomName,
  ) {
    super(scene, x, y, 'portalImage');

    scene.physics.world.enable(this);

    this.roomName = roomName;

    this.destination = destination;
  }

  public getDestination(): Destination {
    return this.destination;
  }

  public getRoomName(): RoomName {
    return this.roomName;
  }
}
