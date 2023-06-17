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
import Robot from '../Sprite/Collidable/Static/Enemy/Robot';
import Anchor from '../Sprite/Decoration/Anchor';
import getNewRoomNameSpecialCase from './SpecialRooms';

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
    robotsGroup: Robot[],
    anchor: Anchor | null,
    map: Phaser.Tilemaps.Tilemap,
    tilesetImage: string,
  ): void {
    const tileset = map.addTilesetImage('tileset', tilesetImage);
    this.layer = map.createLayer('main', tileset, 0, 0);
    this.layer.depth = -100;
    map.setCollisionBetween(1, 32); // cave
    map.setCollisionBetween(65, 80); // pyramid
    map.setCollisionBetween(137, 156); // base
    map.setCollisionBetween(185, 200); // secret
    this.scene.physics.add.collider(player, this.layer);
    this.scene.physics.add.collider(spikePlatformsGroup, this.layer);
    this.scene.physics.add.collider(cannonBallsGroup, this.layer);
    this.scene.physics.add.collider(crabsGroup, this.layer);
    this.scene.physics.add.collider(crabsGroup, crabsGroup);
    this.scene.physics.add.collider(crabsGroup, invisibleWallsGroup);
    this.scene.physics.add.collider(mummiesGroup, this.layer);
    this.scene.physics.add.collider(mummiesGroup, invisibleWallsGroup);
    this.scene.physics.add.collider(robotsGroup, this.layer);
    this.scene.physics.add.collider(robotsGroup, invisibleWallsGroup);

    if (anchor) {
      this.scene.physics.add.collider(anchor, this.layer);
    }
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
    const specialRoomName = getNewRoomNameSpecialCase(player, this.roomName);

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
}
