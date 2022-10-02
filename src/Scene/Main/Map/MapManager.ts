import Phaser from 'phaser';
import EventDispatcher from '../../../Service/EventDispatcher';
import Player from '../Sprite/Player/Player';
import RoomName from './RoomName';

export default class MapManager {
  private roomName: RoomName;

  constructor(
    scene: Phaser.Scene,
    player: Player,
    map: Phaser.Tilemaps.Tilemap,
    roomName: RoomName,
    tilesetImage: string,
  ) {
    this.roomName = roomName;
    const tileset = map.addTilesetImage('tileset', tilesetImage);
    const layer: Phaser.Tilemaps.TilemapLayer = map.createLayer('main', tileset, 0, 0);
    map.setCollisionBetween(1, 16);
    scene.physics.add.collider(player, layer);
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
}
