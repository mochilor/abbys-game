import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import Player from './Player/Player';
import map from '../../../maps/map.json';
import MapManager from './MapManager';
import { Controller } from './Player/Controller';

export default class Main extends Phaser.Scene {
  private player: Player;

  private mapManager: MapManager;

  constructor() {
    super({ key: 'Main' });
  }

  preload(): void {
    this.load.image(Player.texture, playerSpritePath);
    this.load.image('tilesetImage', tilesetPath);
    this.load.tilemapTiledJSON('tileset', map);
  }

  create(): void {
    const controller = new Controller(
      this.input.keyboard.addKey('LEFT'),
      this.input.keyboard.addKey('RIGHT'),
      this.input.keyboard.addKey('UP'),
    );

    this.player = new Player(this, 32, 32, controller);

    this.mapManager = new MapManager(this, this.player, 'tileset', 'tilesetImage');
  }

  update(): void {
    this.player.update();
    this.mapManager.updateCurrentRoom(this.player);
  }
}
