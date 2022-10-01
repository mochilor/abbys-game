import Phaser from 'phaser';
import EventDispatcher from '../../../Service/EventDispatcher';
import Player from '../Sprite/Player/Player';

export default class MapManager {
  private roomX: number;

  private roomY: number;

  constructor(
    scene: Phaser.Scene,
    player: Player,
    map: Phaser.Tilemaps.Tilemap,
    roomX: number,
    roomY: number,
    tilesetImage: string,
  ) {
    this.roomX = roomX;
    this.roomY = roomY;
    const tileset = map.addTilesetImage('tileset', tilesetImage);
    const layer: Phaser.Tilemaps.TilemapLayer = map.createLayer('main', tileset, 0, 0);
    map.setCollisionBetween(1, 16);
    scene.physics.add.collider(player, layer);
  }

  public updateCurrentRoom(player: Player): void {
    if (player.isLeavingRoom()) {
      const newRoomData = this.getNewRoomData(player);
      EventDispatcher.getInstance().emit('newRoomReached', newRoomData, { x: this.roomX, y: this.roomY }, player);
      this.roomX = newRoomData.x;
      this.roomY = newRoomData.y;
    }
  }

  private getNewRoomData(player: Player): { x: number, y: number } {
    const data = { x: this.roomX, y: this.roomY };

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

    return data;
  }
}
