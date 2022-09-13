import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksImagePath from '../../../assets/img/blocks.png';
import Player from './Object/Player/Player';
import map from '../../../maps/map.json';
import MapManager from './MapManager';
import { Controller } from './Object/Player/Controller';
import { make } from './Object/factory';
import { GameItem, GameItemCollection } from './Interfaces';
import Backpack from './Object/Player/Backpack';
import MapLocator from './GameItem/Locator/MapLocator';

export default class Main extends Phaser.Scene {
  private player: Player;

  private mapManager: MapManager;

  private gameItems: GameItemCollection;

  constructor() {
    super({ key: 'Main' });
  }

  public preload(): void {
    this.load.image(Player.texture, playerSpritePath);
    this.load.image('tilesetImage', tilesetPath);
    this.load.image('blocksImage', blocksImagePath);
    this.load.spritesheet('objects', objectsSpriteSheetsPath, { frameWidth: 8, frameHeight: 8 });
    this.load.tilemapTiledJSON('tileset', map);

    // A different implementation of GameItemLocator is needed when loading a saved game:
    const gameItemLocator = new MapLocator(map);
    this.gameItems = gameItemLocator.getGameItemCollection();
  }

  public create(): void {
    this.prepareObjects(this.gameItems);
    this.mapManager = new MapManager(this, this.player, 'tileset', 'tilesetImage');
  }

  // todo: extract to another file
  private prepareObjects(gameItems: GameItemCollection): void {
    const playerPosition = gameItems.getPlayerPosition();

    const controller = new Controller(
      this.input.keyboard.addKey('LEFT'),
      this.input.keyboard.addKey('RIGHT'),
      this.input.keyboard.addKey('UP'),
    );

    this.player = new Player(this, playerPosition.x, playerPosition.y, controller, new Backpack());

    const objectsGroup = this.add.group();

    const coinPositions = gameItems.getCoinPositions();
    coinPositions.forEach((item: GameItem) => {
      const coin = make(this, item);
      objectsGroup.add(coin);
    });

    const scubaPosition = gameItems.getScubaPosition();
    objectsGroup.add(make(this, scubaPosition));

    const finsPositions = gameItems.getFinsPosition();
    objectsGroup.add(make(this, finsPositions));

    const savesPosition = gameItems.getSavesPositions();
    savesPosition.forEach((item: GameItem) => {
      const save = make(this, item);
      objectsGroup.add(save);
    });

    this.physics.add.overlap(
      this.player,
      objectsGroup,
      this.player.collectItem as ArcadePhysicsCallback,
      null,
      this.player,
    );

    const doorsGroup = this.add.group();

    const doorsPositions = gameItems.getDoorsPositions();

    doorsPositions.forEach((item: GameItem) => {
      const door = make(this, item);
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

    // todo: listen to 'itemDestroyed' event and modify this.gameItems based on the item uuid
  }
}
