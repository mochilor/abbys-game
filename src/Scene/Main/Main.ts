import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksImagePath from '../../../assets/img/blocks.png';
import Player from './Player/Player';
import map from '../../../maps/map.json';
import MapManager from './MapManager';
import { Controller } from './Player/Controller';
import LayerIterator from '../LayerIterator';
import ItemFactory from './Object/ItemFactory';
import { GameItem } from './Interfaces';
import Coin from './Object/Coin';
import Backpack from './Player/Backpack';
import Door from './Object/Door';

export default class Main extends Phaser.Scene {
  private player: Player;

  private mapManager: MapManager;

  private coinGroup: Phaser.GameObjects.Group;

  private doorsGroup: Phaser.GameObjects.Group;

  private layerIterator: LayerIterator;

  private itemFactory: ItemFactory;

  constructor() {
    super({ key: 'Main' });
    this.itemFactory = new ItemFactory(this);
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
    const playerPosition = this.layerIterator.getObjectPositions(2)[0];

    const controller = new Controller(
      this.input.keyboard.addKey('LEFT'),
      this.input.keyboard.addKey('RIGHT'),
      this.input.keyboard.addKey('UP'),
    );

    this.player = new Player(this, playerPosition.x, playerPosition.y, controller, new Backpack());

    this.mapManager = new MapManager(this, this.player, 'tileset', 'tilesetImage');

    this.coinGroup = this.add.group();

    const coinPositions = this.layerIterator.getObjectPositions(1);

    coinPositions.forEach((item: GameItem) => {
      const coin = this.itemFactory.make(item) as Coin;
      this.coinGroup.add(coin);
    });

    this.physics.add.overlap(
      this.player,
      this.coinGroup,
      this.player.collectItem as ArcadePhysicsCallback,
      null,
      this.player,
    );

    this.doorsGroup = this.add.group();

    const doorsPositions = this.layerIterator.getObjectPositions(3);

    doorsPositions.forEach((item: GameItem) => {
      const door = this.itemFactory.make(item) as Door;
      this.doorsGroup.add(door);
    });

    this.physics.add.collider(
      this.player,
      this.doorsGroup,
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
