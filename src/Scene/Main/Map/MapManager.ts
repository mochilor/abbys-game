import Phaser from 'phaser';
import EventDispatcher from '../../../Service/EventDispatcher';
import Player from '../Sprite/Player/Player';
import RoomName from './RoomName';
import config from '../../../../config/config.json';

export default class MapManager {
  private scene: Phaser.Scene;

  private roomName: RoomName;

  constructor(
    scene: Phaser.Scene,
    player: Player,
    map: Phaser.Tilemaps.Tilemap,
    roomName: RoomName,
    tilesetImage: string,
  ) {
    this.scene = scene;
    this.roomName = roomName;
    const tileset = map.addTilesetImage('tileset', tilesetImage);
    const layer: Phaser.Tilemaps.TilemapLayer = map.createLayer('main', tileset, 0, 0);
    map.setCollisionBetween(1, 16);
    this.scene.physics.add.collider(player, layer);
  }

  public updateCurrentRoom(player: Player): void {
    if (player.isLeavingRoom()) {
      const newRoomName = this.getNewRoomName(player);
      EventDispatcher.getInstance().emit(
        'newRoomReached',
        newRoomName,
        this.roomName,
        player,
      );
    } else {
      this.setupCameras(player);
    }
  }

  private getNewRoomName(player: Player): RoomName {
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
    // Add 1 to screen sizes to prevent reloacting cameras when player is exactly at the border:
    const screenSizeX = config.gameWidth + 1;
    const screenSizeY = config.gameHeight + 1;
    const roomX = Math.floor(player.x / screenSizeX);
    const roomY = Math.floor(player.y / screenSizeY);
    const cameraX = roomX * screenSizeX;
    const cameraY = roomY * screenSizeY;

    this.scene.cameras.main.setScroll(cameraX, cameraY);
  }
}
