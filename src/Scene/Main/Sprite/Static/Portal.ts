import Phaser from 'phaser';
import RoomName from '../../Map/RoomName';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

interface Destination {
  room: RoomName,
  x: number,
  y: number,
}

export default class Portal extends GameObject implements GameSprite {
  public static key = 'Portal';

  private destination: Destination;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    destination: Destination,
    roomName: RoomName,
  ) {
    super(scene, x, y, 'portalImage', roomName);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.destination = destination;
  }

  public getDestination(): Destination {
    return this.destination;
  }
}
