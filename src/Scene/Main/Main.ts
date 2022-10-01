import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksImagePath from '../../../assets/img/blocks.png';
import platformImagePath from '../../../assets/img/platform.png';
import map10_10 from '../../../maps/10-10.json';
import map10_11 from '../../../maps/10-11.json';
import map9_11 from '../../../maps/9-11.json';
import map11_10 from '../../../maps/11-10.json';
import MapManager from './Map/MapManager';
import Player from './Sprite/Player/Player';
import SpriteManager from './Sprite/SpriteManager';
import EventDispatcher from '../../Service/EventDispatcher';
import SaveGameLocator from './GameItem/Locator/SaveGameLocator';
import MapLocator from './GameItem/Locator/MapLocator';
import InMemoryGameLocator from './GameItem/Locator/InMemoryGameLocator';

interface Data {
  x: number,
  y: number,
  playerX: number,
  playerY: number,
}

function getRoomNumber(data?: Data): { x: number, y: number } {
  if (data && Object.keys(data).length > 0) {
    return { x: data.x, y: data.y };
  }

  return { x: 10, y: 10 };
}

export default class Main extends Phaser.Scene {
  private player: Player;

  private spriteManager: SpriteManager;

  private mapManager: MapManager;

  constructor() {
    super({ key: 'Main' });
  }

  public preload(): void {
    this.load.image(Player.texture, playerSpritePath);
    this.load.image('tilesetImage', tilesetPath);
    this.load.image('blocksImage', blocksImagePath);
    this.load.image('platformImage', platformImagePath);
    this.load.spritesheet('objects', objectsSpriteSheetsPath, { frameWidth: 8, frameHeight: 8 });
    this.load.tilemapTiledJSON('10_10', map10_10);
    this.load.tilemapTiledJSON('10_11', map10_11);
    this.load.tilemapTiledJSON('9_11', map9_11);
    this.load.tilemapTiledJSON('11_10', map11_10);

    // this.load.pack();
  }

  public create(data?: Data): void {
    EventDispatcher.getInstance().removeAllListeners();

    const roomNumber = getRoomNumber(data);
    const roomName = `${roomNumber.x}_${roomNumber.y}`;
    const map = this.add.tilemap(roomName);

    this.spriteManager = new SpriteManager(
      this,
      new InMemoryGameLocator(this),
      new SaveGameLocator(),
      new MapLocator(map, roomName),
    );
    this.spriteManager.prepareObjects(roomName);
    this.player = this.spriteManager.getPlayer();
    this.mapManager = new MapManager(this, this.player, map, roomNumber.x, roomNumber.y, 'tilesetImage');
    this.player.initBackpack();

    EventDispatcher.getInstance().on('playerHasDied', this.playerHasDied, this);
    EventDispatcher.getInstance().on('newRoomReached', this.scene.restart, this.scene);
  }

  private playerHasDied(): void {
    this.scene.restart();
  }

  update(): void {
    this.player.update();
    this.mapManager.updateCurrentRoom(this.player);
    this.spriteManager.update();
  }
}
