import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksImagePath from '../../../assets/img/blocks.png';
import map from '../../../maps/map.json';
import MapManager from './Map/MapManager';
import Player from './Sprite/Player/Player';
import SpriteManager from './Sprite/SpriteManager';
import EventDispatcher from '../../Service/EventDispatcher';

export default class Main extends Phaser.Scene {
  private player: Player;

  private mapManager: MapManager;

  constructor() {
    super({ key: 'Main' });
  }

  public preload(): void {
    this.load.image(Player.texture, playerSpritePath);
    this.load.image('tilesetImage', tilesetPath);
    this.load.image('blocksImage', blocksImagePath);
    this.load.spritesheet('objects', objectsSpriteSheetsPath, { frameWidth: 8, frameHeight: 8 });
    this.load.tilemapTiledJSON('tileset', map);
  }

  public create(): void {
    EventDispatcher.getInstance().removeAllListeners();
    EventDispatcher.getInstance().on('playerHasDied', this.playerHasDied, this);
    const spriteManager = new SpriteManager(this);
    spriteManager.prepareObjects();
    this.player = spriteManager.getPlayer();
    this.mapManager = new MapManager(this, this.player, 'tileset', 'tilesetImage');
  }

  private playerHasDied(): void {
    this.scene.restart();
  }

  update(): void {
    this.player.update();
    this.mapManager.updateCurrentRoom(this.player);
  }
}
