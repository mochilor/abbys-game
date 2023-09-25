import Phaser from 'phaser';
import { GameItem } from '../../../GameItem/types';
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
    super(scene, gameItem);
    scene.anims.create({
      key: 'portal_on',
      frameRate: 16,
      frames: this.anims.generateFrameNames(
        'sprites',
        {
          prefix: 'portal_',
          start: 0,
          end: 7,
        },
      ),
      repeat: -1,
    });

    this.play('portal_on');

    scene.physics.world.enable(this);

    this.body.setSize(14, 14);
    this.body.setOffset(1, 8);

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

  /**
 * Factory function intended to add new object after main instantiation in SpriteManager.
 */
  public static makeAdditional(scene: Phaser.Scene, gameItem: GameItem): Portal {
    const portal = new Portal(scene, gameItem);
    portal.setDepth(-1);

    return portal;
  }
}
