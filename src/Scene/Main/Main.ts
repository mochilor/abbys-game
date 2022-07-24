import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import Player from './Player/Player';
import map from '../../../maps/map.json';
import { Controller } from './Player/Controller';

export default class Main extends Phaser.Scene {
  private player: Phaser.GameObjects.Image;

  private map: Phaser.Tilemaps.Tilemap;

  private tilesetImage: Phaser.Tilemaps.Tileset;

  constructor() {
    super({ key: 'Main' });
  }

  preload(): void {
    this.load.image(Player.texture, playerSpritePath);
    this.load.image('tilesetImage', tilesetPath);
    this.load.tilemapTiledJSON('tileset', map);
  }

  create(): void {
    this.map = this.add.tilemap('tileset');
    this.tilesetImage = this.map.addTilesetImage('tileset', 'tilesetImage');
    const layer: Phaser.Tilemaps.TilemapLayer = this.map.createLayer(0, this.tilesetImage, 0, 0);
    this.map.setCollision(1);

    const controller = new Controller(
      this.input.keyboard.addKey('LEFT'),
      this.input.keyboard.addKey('RIGHT'),
      this.input.keyboard.addKey('UP'),
    );

    this.player = new Player(this, 50, 50, controller);

    this.physics.add.collider(this.player, layer);
  }

  update(): void {
    this.player.update();
  }
}
