import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksImagePath from '../../../assets/img/blocks.png';
import platformImagePath from '../../../assets/img/platform.png';
import bgUnderwaterPath from '../../../assets/img/background/bg-underwater.png';
import waterDetailsSpriteSheetPath from '../../../assets/img/background/water-details.png';
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
import { loadGame } from '../../Service/gameStore';
import RoomName from './Map/RoomName';
import BackgroundManager from './Background/BackgroundManager';

interface Data {
  x: number,
  y: number,
  playerX: number,
  playerY: number,
}

function getRoomName(data?: Data): RoomName {
  if (data && Object.keys(data).length > 0) {
    return new RoomName(data.x, data.y);
  }

  const savedGame = loadGame();

  if (savedGame !== null) {
    return new RoomName(savedGame.room.x, savedGame.room.y);
  }

  return new RoomName(10, 10);
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
    this.load.image('bgUnderwater', bgUnderwaterPath);
    this.load.spritesheet('objects', objectsSpriteSheetsPath, { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('waterDetails', waterDetailsSpriteSheetPath, { frameWidth: 16, frameHeight: 16 });
    this.load.tilemapTiledJSON('10_10', map10_10);
    this.load.tilemapTiledJSON('10_11', map10_11);
    this.load.tilemapTiledJSON('9_11', map9_11);
    this.load.tilemapTiledJSON('11_10', map11_10);

    // this.load.pack();
  }

  public create(data?: Data): void {
    EventDispatcher.getInstance().removeAllListeners();

    const roomName = getRoomName(data);
    const map = this.add.tilemap(roomName.getName());

    const backgroundManager = new BackgroundManager(this);
    backgroundManager.setup();

    this.spriteManager = new SpriteManager(
      this,
      new InMemoryGameLocator(this),
      new SaveGameLocator(),
      new MapLocator(map),
    );
    this.spriteManager.prepareObjects(roomName);

    this.player = this.spriteManager.getPlayer();
    this.mapManager = new MapManager(this, this.player, map, roomName, 'tilesetImage');
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
