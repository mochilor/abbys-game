import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import Player from './Player/Player';
import map from '../../../maps/map.json';
import MapManager from './MapManager';
import { Controller } from './Player/Controller';
import LayerIterator from '../LayerIterator';
import ItemFactory from './Items/ItemFactory';
import { GameItem } from './Interfaces';
import Coin from './Items/Coin';

export default class Main extends Phaser.Scene {
  private player: Player;

  private mapManager: MapManager;

  private coinGroup: Phaser.GameObjects.Group;

  private layerIterator: LayerIterator;

  private itemFactory: ItemFactory;

  constructor() {
    super({ key: 'Main' });
    this.itemFactory = new ItemFactory(this);
  }

  preload(): void {
    this.load.image(Player.texture, playerSpritePath);
    this.load.image('tilesetImage', tilesetPath);
    this.load.spritesheet('objects', objectsSpriteSheetsPath, { frameWidth: 8, frameHeight: 8 });
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

    this.coinGroup = this.add.group();

    this.layerIterator = new LayerIterator(map);
    const coinPositions = this.layerIterator.getObjectPositions(1);

    coinPositions.forEach((item: GameItem) => {
      const coin = this.itemFactory.make(item) as Coin;
      this.coinGroup.add(coin);
    });
  }

  update(): void {
    this.player.update();
    this.mapManager.updateCurrentRoom(this.player);
  }
}
