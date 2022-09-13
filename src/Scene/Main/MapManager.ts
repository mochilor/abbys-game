import Phaser from 'phaser';
import Player from './Object/Player/Player';
import config from '../../../config/config.json';

export default class MapManager {
  private map: Phaser.Tilemaps.Tilemap;

  private tilesetImage: Phaser.Tilemaps.Tileset;

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, player: Player, tilemap: string, tilesetImage: string) {
    this.scene = scene;
    this.map = scene.add.tilemap(tilemap);
    this.tilesetImage = this.map.addTilesetImage(tilemap, tilesetImage);
    const layer: Phaser.Tilemaps.TilemapLayer = this.map.createLayer('main', this.tilesetImage, 0, 0);
    this.map.setCollisionBetween(1, 16);
    this.scene.physics.add.collider(player, layer);
  }

  public updateCurrentRoom(player: Player): void {
    if (this.playerIsOutOfRoom(player)) {
      this.setupCameras(player);
    }
  }

  private playerIsOutOfRoom(player: Player): boolean {
    const positionInRoom = player.positionInRoom(
      this.scene.cameras.main.scrollX,
      this.scene.cameras.main.scrollY,
    );

    return positionInRoom.y <= 0
      || positionInRoom.x <= 0
      || positionInRoom.y >= config.gameHeight
      || positionInRoom.x >= config.gameWidth;
  }

  private setupCameras(player: Player): void {
    const roomSizeX = config.gameWidth;
    const roomSizeY = config.gameHeight;
    const roomX = Math.floor(player.x / roomSizeX);
    const roomY = Math.floor(player.y / roomSizeY);
    const cameraX = (roomX * roomSizeX);
    const cameraY = (roomY * roomSizeY);

    this.scene.cameras.main.setScroll(cameraX, cameraY);
  }
}
