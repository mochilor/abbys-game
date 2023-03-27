import Phaser from 'phaser';
import * as EventDispatcher from '../../../Service/EventDispatcher';
import Player from '../Sprite/Player/Player';
import RoomName from './RoomName';
import config from '../../../../config/config.json';
import SpikePlatform from '../Sprite/Collidable/Static/SpikePlatform';
import CannonBall from '../Sprite/Collidable/Static/Enemy/CannonBall';
import Crab from '../Sprite/Collidable/Static/Enemy/Crab';
import InvisibleWall from '../Sprite/Collidable/Static/InvisibleWall';
import Mummy from '../Sprite/Collidable/Static/Enemy/Mummy';

export default class MapManager {
  private scene: Phaser.Scene;

  private roomName: RoomName;

  private layer: Phaser.Tilemaps.TilemapLayer;

  constructor(scene: Phaser.Scene, roomName: RoomName) {
    this.scene = scene;
    this.roomName = roomName;
  }

  public setup(
    player: Player,
    spikePlatformsGroup: SpikePlatform[],
    cannonBallsGroup: CannonBall[],
    crabsGroup: Crab[],
    invisibleWallsGroup: InvisibleWall[],
    mummiesGroup: Mummy[],
    map: Phaser.Tilemaps.Tilemap,
    tilesetImage: string,
  ): void {
    const tileset = map.addTilesetImage('tileset', tilesetImage);
    this.layer = map.createLayer('main', tileset, 0, 0);
    this.layer.depth = -100;
    map.setCollisionBetween(1, 32);
    map.setCollisionBetween(65, 80);
    map.setCollisionBetween(137, 156);
    this.scene.physics.add.collider(player, this.layer);
    this.scene.physics.add.collider(spikePlatformsGroup, this.layer);
    this.scene.physics.add.collider(cannonBallsGroup, this.layer);
    this.scene.physics.add.collider(crabsGroup, this.layer);
    this.scene.physics.add.collider(crabsGroup, crabsGroup);
    this.scene.physics.add.collider(crabsGroup, invisibleWallsGroup);
    this.scene.physics.add.collider(mummiesGroup, this.layer);
    this.scene.physics.add.collider(mummiesGroup, invisibleWallsGroup);
  }

  public updateCurrentRoom(player: Player): void {
    if (player.isLeavingRoom()) {
      const newRoomName = this.getNewRoomName(player);
      EventDispatcher.emit(
        'newRoomReached',
        newRoomName,
        this.roomName,
        player,
      );
      return;
    }

    this.setupCameras(player);
  }

  private getNewRoomName(player: Player): RoomName {
    const specialRoomName = this.getNewRoomNameSpecialCase(player);

    if (specialRoomName) {
      return specialRoomName;
    }

    const data = { x: this.roomName.getX(), y: this.roomName.getY() };

    if (player.isLeavingRoomLeft()) {
      data.x -= 1;
    } else if (player.isLeavingRoomRight()) {
      data.x += 1;
    }

    if (player.isLeavingRoomTop()) {
      data.y -= 1;
    } else if (player.isLeavingRoomBottom()) {
      data.y += 1;
    }

    return new RoomName(data.x, data.y);
  }

  private setupCameras(player: Player): void {
    const screenSizeX = config.gameWidth;
    const screenSizeY = config.gameHeight;

    // Add 1 to screen sizes to prevent reloacting cameras when player is exactly at the border:
    const roomX = Math.floor(player.x / (screenSizeX + 1));
    const roomY = Math.floor(player.y / (screenSizeY + 1));
    const cameraX = roomX * screenSizeX;
    const cameraY = roomY * screenSizeY;

    this.scene.cameras.main.setScroll(cameraX, cameraY);
  }

  private getNewRoomNameSpecialCase(player: Player): RoomName | null {
    const specialRooms = {
      '2_1': {
        left: '4_5',
        bottom: '4_7',
      },
      '4_5': {
        right: '2_1',
      },
      '4_8': {
        bottom: '4_7',
      },
      '5_0': {
        top: '3_6',
      },
      '5_8': {
        bottom: '4_7',
        left: '6_7',
      },
      '6_7': {
        right: '5_8',
        bottom: '2_1',
      },
    };

    const specialRoom = specialRooms[this.roomName.getName()];

    if (!specialRoom) {
      return null;
    }

    let name = null;
    if (player.isLeavingRoomLeft() && specialRoom.left) {
      name = specialRoom.left;
    }
    if (player.isLeavingRoomRight() && specialRoom.right) {
      name = specialRoom.right;
    }
    if (player.isLeavingRoomTop() && specialRoom.top) {
      name = specialRoom.top;
    }
    if (player.isLeavingRoomBottom() && specialRoom.bottom) {
      name = specialRoom.bottom;
    }

    if (name) {
      return RoomName.fromName(name);
    }

    return null;
  }
}
