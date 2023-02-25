import Phaser from 'phaser';
import GameItem from '../../../GameItem/GameItemInterface';
import RoomName from '../../../Map/RoomName';
import GameObject from '../../GameObject';

interface Destination {
  room: RoomName,
  x: number,
  y: number,
}

export default class Portal extends GameObject {
  public static key = 'Portal';

  private destination: Destination;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'portalImage');

    scene.physics.world.enable(this);

    let room: RoomName;
    let x: integer;
    let y: integer;

    gameItem.properties.forEach((property) => {
      if (property.name === 'destinationRoom') {
        room = RoomName.fromName(property.value as string);
      }

      if (property.name === 'destinationX') {
        x = parseInt(property.value as string, 10);
      }

      if (property.name === 'destinationY') {
        y = parseInt(property.value as string, 10);
      }
    });

    if (!room || !x || !y) {
      throw new Error('Invalid portal destination');
    }

    this.destination = { room, x, y };
  }

  public getDestination(): Destination {
    return this.destination;
  }

  public getRoomName(): RoomName {
    return this.gameItem.roomName;
  }
}
