import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksImagePath from '../../../assets/img/blocks.png';
import spearImagePath from '../../../assets/img/spear.png';
import platformImagePath from '../../../assets/img/platform.png';
import bgUnderwaterPath from '../../../assets/img/background/bg-underwater.png';
import waterDetailsSpriteSheetPath from '../../../assets/img/background/water-details.png';
import map5_1 from '../../../maps/5-1.json';
import map5_2 from '../../../maps/5-2.json';
import map4_2 from '../../../maps/4-2.json';
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
}

function getRoomName(data?: Data): RoomName {
  if (data && Object.keys(data).length > 0) {
    return new RoomName(data.x, data.y);
  }

  const savedGame = loadGame();

  if (savedGame !== null) {
    return new RoomName(savedGame.room.x, savedGame.room.y);
  }

  return new RoomName(5, 1);
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
    this.load.image('spearImage', spearImagePath);
    this.load.image('platformImage', platformImagePath);
    this.load.image('bgUnderwater', bgUnderwaterPath);
    this.load.spritesheet('objects', objectsSpriteSheetsPath, { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('waterDetails', waterDetailsSpriteSheetPath, { frameWidth: 16, frameHeight: 16 });
    this.load.tilemapTiledJSON('5_1', map5_1);
    this.load.tilemapTiledJSON('5_2', map5_2);
    this.load.tilemapTiledJSON('4_2', map4_2);

    // this.load.pack();
  }

  public create(data?: Data): void {
    EventDispatcher.getInstance().removeAllListeners();

    const roomName = getRoomName(data);
    const map = this.add.tilemap(roomName.getName());

    this.spriteManager = new SpriteManager(
      this,
      new InMemoryGameLocator(this),
      new SaveGameLocator(this.registry),
      new MapLocator(map),
    );
    this.spriteManager.prepareObjects(roomName);

    this.player = this.spriteManager.getPlayer();
    this.mapManager = new MapManager(this, roomName);
    this.mapManager.setup(this.player, map, 'tilesetImage');

    (new BackgroundManager(this)).setup(
      this.spriteManager.getObjects(),
      this.mapManager.getLayer(),
    );

    this.player.initBackpack();

    EventDispatcher.getInstance().on('playerHasDied', this.playerHasDied, this);
    EventDispatcher.getInstance().on('newRoomReached', this.scene.restart, this.scene);
  }

  private playerHasDied(): void {
    this.registry.reset();
    this.scene.restart({});
  }

  update(): void {
    this.player.update();
    this.mapManager.updateCurrentRoom(this.player);
    this.spriteManager.update();
  }
}
