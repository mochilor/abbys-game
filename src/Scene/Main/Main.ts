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

  private objectsGroup: Phaser.GameObjects.Group;

  private doorsGroup: Phaser.GameObjects.Group;

  private layerIterator: LayerIterator;

  private itemFactory: ItemFactory;

  private scuba: Phaser.GameObjects.Sprite;

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

    this.objectsGroup = this.prepareObjects();

    this.doorsGroup = this.prepareDoors();
  }

  private prepareObjects(): Phaser.GameObjects.Group {
    const objectsGroup = this.add.group();

    const coinPositions = this.layerIterator.getObjectPositions(1);

    coinPositions.forEach((item: GameItem) => {
      const coin = this.itemFactory.make(item) as Coin;
      objectsGroup.add(coin);
    });

    const scubaPosition = this.layerIterator.getObjectPositions(4);
    objectsGroup.add(this.itemFactory.make(scubaPosition[0]));

    const finsPosition = this.layerIterator.getObjectPositions(5);
    objectsGroup.add(this.itemFactory.make(finsPosition[0]));

    this.physics.add.overlap(
      this.player,
      objectsGroup,
      this.player.collectItem as ArcadePhysicsCallback,
      null,
      this.player,
    );

    return objectsGroup;
  }

  private prepareDoors(): Phaser.GameObjects.Group {
    const doorsGroup = this.add.group();

    const doorsPositions = this.layerIterator.getObjectPositions(3);

    doorsPositions.forEach((item: GameItem) => {
      const door = this.itemFactory.make(item) as Door;
      doorsGroup.add(door);
    });

    this.physics.add.collider(
      this.player,
      doorsGroup,
      this.player.openDoor,
      null,
      this.player,
    );

    return doorsGroup;
  }

  update(): void {
    this.player.update();
    this.mapManager.updateCurrentRoom(this.player);
  }
}
