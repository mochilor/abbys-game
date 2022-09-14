import Phaser from 'phaser';
import playerSpritePath from '../../../assets/img/player.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksImagePath from '../../../assets/img/blocks.png';
import Player from './Object/Player/Player';
import map from '../../../maps/map.json';
import MapManager from './MapManager';
import MapLocator from './GameItem/Locator/MapLocator';
import Door from './Object/Door';
import { makeObjects } from './Object/factory';

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
    this.prepareObjects();
    this.mapManager = new MapManager(this, this.player, 'tileset', 'tilesetImage');

    // todo: listen to 'itemDestroyed' event and modify this.gameItems based on the item uuid
  }

  private prepareObjects(): void {
    // A different implementation of GameItemLocator is needed when loading a saved game:
    const gameItemLocator = new MapLocator(map);
    const gameItems = gameItemLocator.getGameItemCollection();
    const objects = makeObjects(this, gameItems);

    const objectsGroup = this.add.group();
    const doorsGroup = this.add.group();

    objects.forEach((item: Phaser.GameObjects.Sprite) => {
      if (item instanceof Door) {
        doorsGroup.add(item);
        return;
      }

      if (item instanceof Player) {
        this.player = item;
        return;
      }

      objectsGroup.add(item);
    });

    this.physics.add.overlap(
      this.player,
      objectsGroup,
      this.player.collectItem as ArcadePhysicsCallback,
      null,
      this.player,
    );

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
