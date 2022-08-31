import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksImagePath from '../../../assets/img/blocks.png';
import Player from './Player/Player';
import map from '../../../maps/map.json';
import MapManager from './MapManager';
import { Controller } from './Player/Controller';
import LayerIterator from './LayerIterator';
import { make } from './Object/factory';
import { GameItem } from './Interfaces';
import Coin from './Object/Coin';
import Backpack from './Player/Backpack';
import Door from './Object/Door';

export default class Main extends Phaser.Scene {
  private player: Player;

  private mapManager: MapManager;

  private layerIterator: LayerIterator;

  private scuba: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: 'Main' });
  }

  preload(): void {
    this.load.image(Player.texture, playerSpritePath);
    this.load.image('tilesetImage', tilesetPath);
    this.load.image('blocksImage', blocksImagePath);
    this.load.spritesheet('objects', objectsSpriteSheetsPath, { frameWidth: 8, frameHeight: 8 });
    this.load.tilemapTiledJSON('tileset', map);

    this.layerIterator = new LayerIterator(map);
  }

  create(): void {
    const playerPosition = this.layerIterator.getPlayerPosition();

    const controller = new Controller(
      this.input.keyboard.addKey('LEFT'),
      this.input.keyboard.addKey('RIGHT'),
      this.input.keyboard.addKey('UP'),
    );

    this.player = new Player(this, playerPosition.x, playerPosition.y, controller, new Backpack());

    this.mapManager = new MapManager(this, this.player, 'tileset', 'tilesetImage');

    this.prepareObjects();

    this.prepareDoors();
  }

  private prepareObjects(): void {
    const objectsGroup = this.add.group();

    const coinPositions = this.layerIterator.getCoinPositions();

    coinPositions.forEach((item: GameItem) => {
      const coin = make(this, item) as Coin;
      objectsGroup.add(coin);
    });

    const scubaPosition = this.layerIterator.getScubaPosition();
    objectsGroup.add(make(this, scubaPosition));

    const finsPosition = this.layerIterator.getFinsPosition();
    objectsGroup.add(make(this, finsPosition));

    this.physics.add.overlap(
      this.player,
      objectsGroup,
      this.player.collectItem as ArcadePhysicsCallback,
      null,
      this.player,
    );
  }

  private prepareDoors(): void {
    const doorsGroup = this.add.group();

    const doorsPositions = this.layerIterator.getDoorsPositions();

    doorsPositions.forEach((item: GameItem) => {
      const door = make(this, item) as Door;
      doorsGroup.add(door);
    });

    this.physics.add.collider(
      this.player,
      doorsGroup,
      this.player.openDoor,
      null,
      this.player,
    );
  }

  update(): void {
    this.player.update();
    this.mapManager.updateCurrentRoom(this.player);
  }
}
